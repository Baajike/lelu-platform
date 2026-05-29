# Environment Setup

Two flows: **local development** and **production deployment**. Each is end-to-end — pick one.

## Required environment variables

All three are mandatory. Copy `.env.example` to `.env` and fill in.

| Variable | Purpose | How to obtain |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@host:5432/lelu_db` |
| `NEXTAUTH_SECRET` | Signing key for JWT session tokens | `openssl rand -base64 32` (32 bytes, base64-encoded) |
| `NEXTAUTH_URL` | Absolute URL the app is served from. No trailing slash. | `http://192.168.1.10:3000` for IP, `https://lelu.example.gov.gh` for domain |

`.env` is gitignored — never commit it. If the secret leaks, rotate it and all sessions are invalidated on next request.

---

## Local development

Assumes you have Node 22, Git, and PostgreSQL installed. On Windows, use PowerShell or Git Bash; the codebase doesn't require any Unix-only tooling.

```bash
git clone <repo-url>
cd lelu-platform
npm install          # postinstall runs prisma generate automatically
```

### Local PostgreSQL

Install PostgreSQL via your platform's package manager. Create a local database:

```sql
-- run as superuser
CREATE DATABASE lelu_db;
CREATE USER lelu_user WITH PASSWORD 'devpassword';
GRANT ALL PRIVILEGES ON DATABASE lelu_db TO lelu_user;
\c lelu_db
GRANT ALL ON SCHEMA public TO lelu_user;
```

### .env

```env
DATABASE_URL="postgresql://lelu_user:devpassword@localhost:5432/lelu_db"
NEXTAUTH_SECRET="<openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
```

### Migrate + run

```bash
npx prisma migrate deploy    # apply all committed migrations
npm run dev                  # localhost:3000
```

Open `http://localhost:3000` and click "Enter Platform" → register a HEAD_OF_UNIT account. The first HEAD_OF_UNIT is auto-approved so you can log in immediately and exercise admin features.

### Useful dev commands

```bash
npx prisma studio              # GUI on localhost:5555 to inspect the DB
npx prisma migrate dev --name my_change   # create a new migration after editing schema.prisma
npx prisma generate            # regenerate client after schema changes
```

---

## Production deployment (Ubuntu)

Two automated paths exist. Both are idempotent — safe to re-run.

### Option 1 — Bootstrap script

```bash
git clone <repo-url> /var/www/lelu/app
cd /var/www/lelu/app
sudo bash setup.sh
```

`setup.sh` installs PostgreSQL, nginx, PM2; creates the DB user and database; prompts for the values that go into `.env`; runs `prisma migrate deploy`, `prisma generate`, and `npm run build`; starts the app under PM2 named `lelu-platform`; and registers PM2 with systemd.

For an HTTPS deployment with a domain name:

```bash
sudo bash setup-domain.sh your-domain.gov.gh
```

This extends `setup.sh` with Let's Encrypt via certbot and rewrites the nginx server block to redirect HTTP→HTTPS.

### Option 2 — Manual

```bash
# Install Node 22, PostgreSQL, PM2 via your standard tooling
sudo npm install -g pm2

# Create DB + user as in the local section but with a strong password
# Clone + install
git clone <repo-url> /var/www/lelu/app
cd /var/www/lelu/app
npm install

# .env
cp .env.example .env
nano .env
# Fill DATABASE_URL with the prod connection string
# Fill NEXTAUTH_SECRET with `openssl rand -base64 32`
# Fill NEXTAUTH_URL with `http://YOUR_SERVER_IP:3000` (or your domain)

# Migrate and build
npx prisma migrate deploy
npx prisma generate
npm run build

# Start under PM2
pm2 start npm --name "lelu-platform" -- start
pm2 save
pm2 startup           # run the command it prints to enroll in systemd

# Sanity check
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000
# expect 200
```

### nginx

`lelu-nginx.conf` is the production-ready vhost. Copy it into `/etc/nginx/sites-available/lelu`, symlink to `sites-enabled`, and reload nginx. It proxies all traffic to `localhost:3000`, sets the standard reverse-proxy headers, and pins the upstream so PM2 restarts don't time out the client connection.

```bash
sudo cp lelu-nginx.conf /etc/nginx/sites-available/lelu
sudo ln -s /etc/nginx/sites-available/lelu /etc/nginx/sites-enabled/lelu
sudo nginx -t && sudo systemctl reload nginx
```

### Updating production

```bash
cd /var/www/lelu/app
sudo bash update.sh
```

`update.sh` performs `git pull`, `npm install`, `npx prisma migrate deploy`, `npx prisma generate`, `npm run build`, and `pm2 restart lelu-platform`. If a migration fails, fix it before re-running — the script doesn't auto-rollback.

### Manual recovery commands

```bash
sudo ss -tlnp | grep 3000                # find orphan next-server process
sudo kill -9 <pid>                       # if PM2 lost track of it
pm2 restart lelu-platform
pm2 logs lelu-platform --lines 200       # tail logs
pm2 status                               # health check
```

---

## Default admin account

There are **no default users**. `prisma/seed.js` is a no-op. The intended first run is:

1. Deploy.
2. Hit `/register` and create a HEAD_OF_UNIT account (the form will only allow this if no HEAD_OF_UNIT exists yet).
3. That account is auto-approved.
4. Log in as the HEAD_OF_UNIT to approve subsequent registrations from `/dashboard/admin`.

The historical README mentions seed credentials (`head@lelu.gov.gh` / `lelu2026`) — those came from an earlier `seed.js` that has since been removed. Don't expect them to work on a fresh deploy.

---

## Port and firewall

- **3000**: Next.js (loopback only; nginx proxies).
- **80 / 443**: nginx (public).
- **5432**: PostgreSQL (loopback only; do not expose).

Open firewall: `sudo ufw allow 22 80 443`. The DB and Node port stay behind localhost.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `relation "X" does not exist` on every API call | Schema model added without a migration | Generate one: `npx prisma migrate dev --name add_x`, then `migrate deploy` in prod |
| Login returns "PENDING_APPROVAL" for first HEAD_OF_UNIT | A HEAD_OF_UNIT already exists in the DB | Use the existing HEAD account or, if locked out, set `approved = true` manually in `User` table |
| `EADDRINUSE :::3000` after `pm2 restart` | Orphan `next-server` process | `sudo ss -tlnp \| grep 3000`, kill it, then `pm2 restart lelu-platform` |
| All API routes 500 after pulling | Stale Prisma client | `npx prisma generate && pm2 restart lelu-platform` |
| `NEXTAUTH_URL` warnings in logs | Mismatch between configured URL and the URL the user hits | Update `.env` to match the actual public URL exactly (no trailing slash) |
