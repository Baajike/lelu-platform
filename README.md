# LELU Platform

Law Enforcement Liaison Unit (LELU) — internal case management system for the Ghana Police Service. Officers log cases, submit CDR requests, track international requests, and generate activity reports. Role-based access controls restrict what each user can see and do.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Database ORM | Prisma |
| Database | PostgreSQL |
| Auth | NextAuth.js (JWT sessions) |
| UI | React, Lucide icons |
| Password hashing | bcryptjs |

---

## Production Setup (Ubuntu Server)

### Prerequisites

- Ubuntu 20.04 or 22.04
- Node.js 18 or higher
- Git
- PM2 (`npm install -g pm2`)

---

### 1. Install PostgreSQL

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

---

### 2. Create the database and user

```bash
sudo -u postgres psql
```

Inside the PostgreSQL shell:

```sql
CREATE DATABASE lelu_db;
CREATE USER lelu_user WITH PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE lelu_db TO lelu_user;
-- PostgreSQL 15+ also requires this:
\c lelu_db
GRANT ALL ON SCHEMA public TO lelu_user;
\q
```

Replace `your_strong_password` with a strong password. Keep it — you will need it in the next step.

---

### 3. Clone and install dependencies

```bash
git clone <repository-url>
cd lelu-platform
npm install
```

`npm install` automatically runs `prisma generate` via the `postinstall` script.

---

### 4. Set up the environment file

```bash
cp .env.example .env
nano .env
```

Fill in the three values:

```env
DATABASE_URL="postgresql://lelu_user:your_strong_password@localhost:5432/lelu_db"
NEXTAUTH_SECRET="<output of: openssl rand -base64 32>"
NEXTAUTH_URL="http://YOUR_SERVER_IP:3000"
```

Generate the secret with:

```bash
openssl rand -base64 32
```

> **Important:** Never commit `.env` to version control. It is already listed in `.gitignore`.

---

### 5. Run database migrations

```bash
npx prisma migrate deploy
```

This applies all schema migrations to the PostgreSQL database.

---

### 6. Seed initial user accounts

```bash
node prisma/seed.js
```

This creates the default officer accounts (see [Default Login Credentials](#default-login-credentials) below).

---

### 7. Build the application

```bash
npm run build
```

---

### 8. Start with PM2

```bash
pm2 start npm --name "lelu-platform" -- start
pm2 save
pm2 startup
```

Run the command printed by `pm2 startup` to configure PM2 to restart automatically on server reboot.

To check status:

```bash
pm2 status
pm2 logs lelu-platform
```

The application will be available at `http://YOUR_SERVER_IP:3000`.

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://lelu_user:password@localhost:5432/lelu_db` |
| `NEXTAUTH_SECRET` | Secret key used to sign JWT tokens — must be long, random, and kept private | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Full URL of the application (no trailing slash) | `http://192.168.1.10:3000` |

---

## Default Login Credentials

All accounts use password: **`lelu2026`**

| Email | Role |
|---|---|
| `head@lelu.gov.gh` | Head of Unit |
| `admin@lelu.gov.gh` | Office Administrator |
| `supervisor@lelu.gov.gh` | Supervisor |
| `asante@lelu.gov.gh` | Officer |
| `boateng@lelu.gov.gh` | Officer |
| `darko@lelu.gov.gh` | Officer |

> Change all passwords after first login in production.

---

## Folder Structure

```
lelu-platform/
├── app/
│   ├── api/                  # API route handlers
│   │   ├── auth/             # NextAuth authentication
│   │   ├── cases/            # Case CRUD + assignments
│   │   ├── cdr/              # CDR request management
│   │   ├── notifications/    # In-app notifications
│   │   ├── reports/          # Activity report generation
│   │   └── users/            # User management
│   ├── dashboard/            # Protected dashboard pages
│   │   ├── cases/            # Case list + case detail
│   │   ├── cdr/              # CDR requests
│   │   ├── fraud/            # Intel DB search
│   │   ├── international/    # International requests
│   │   ├── reports/          # Reports
│   │   └── admin/            # User administration
│   ├── generated/prisma/     # Auto-generated Prisma client (do not edit)
│   ├── lib/                  # Shared utilities (db client, helpers)
│   └── login/                # Login page
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.js               # Initial user seed
├── .env                      # Local environment variables (not committed)
├── .env.example              # Template for environment variables
└── README.md
```
