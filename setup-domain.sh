#!/bin/bash
# =============================================================================
# LELU Platform — Deployment Script (Domain + SSL)
# Ubuntu 24.04 LTS
#
# Run this from inside the lelu-platform-master folder:
#   cd lelu-platform-master
#   chmod +x setup-domain.sh
#   sudo bash setup-domain.sh
#
# Before running this:
#   - Phases 0–8 done (server hardened)
#   - Domain DNS A record pointing to this server's public IP
#   - Ports 80 and 443 forwarded on the office router to this server
#   - prisma/schema.prisma must have provider = "postgresql"
#   - Wait at least 30 minutes after DNS change before running
# =============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()    { echo -e "${GREEN}[✔]${NC} $1"; }
info()   { echo -e "${BLUE}[→]${NC} $1"; }
warn()   { echo -e "${YELLOW}[!]${NC} $1"; }
error()  { echo -e "${RED}[✘]${NC} $1"; exit 1; }
section(){ echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; \
           echo -e "${BLUE}  $1${NC}"; \
           echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; }

if [ "$EUID" -ne 0 ]; then
    error "Please run with sudo: sudo bash setup-domain.sh"
fi

if [ ! -f "package.json" ]; then
    error "Run this script from inside the lelu-platform-master folder."
fi

APP_SOURCE_DIR="$(pwd)"

# -----------------------------------------------------------------------
# Check Prisma schema is set to PostgreSQL
# -----------------------------------------------------------------------
if ! grep -q 'provider *= *"postgresql"' prisma/schema.prisma; then
    error "prisma/schema.prisma is not set to PostgreSQL. Tell the dev to update the provider before running this script."
fi

# -----------------------------------------------------------------------
# Collect info upfront
# -----------------------------------------------------------------------
section "LELU Platform Setup — Domain + SSL"
echo ""
echo "This script will:"
echo "  • Install Node.js 20, PM2, nginx, and PostgreSQL"
echo "  • Deploy LELU to /var/www/lelu/app"
echo "  • Configure nginx with your domain"
echo "  • Set up SSL automatically with Certbot"
echo "  • Set up PM2 to keep the app running"
echo "  • Configure automated daily database backups"
echo ""

read -p "Enter your domain (e.g. lelu.csa.gov.gh): " DOMAIN
if [ -z "$DOMAIN" ]; then
    error "Domain cannot be empty."
fi

read -p "Enter an email address for SSL certificate alerts: " SSL_EMAIL
if [ -z "$SSL_EMAIL" ]; then
    error "Email cannot be empty."
fi

echo ""
read -s -p "Enter a password for the LELU database user: " DB_PASSWORD
echo ""
if [ -z "$DB_PASSWORD" ]; then
    error "Database password cannot be empty."
fi
read -s -p "Confirm database password: " DB_PASSWORD_CONFIRM
echo ""
if [ "$DB_PASSWORD" != "$DB_PASSWORD_CONFIRM" ]; then
    error "Passwords do not match."
fi

echo ""
echo "Generating a secure NEXTAUTH_SECRET..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
log "Secret generated."

# -----------------------------------------------------------------------
# Check DNS is actually pointing here before doing anything
# -----------------------------------------------------------------------
echo ""
info "Checking DNS for ${DOMAIN}..."
PUBLIC_IP=$(curl -s ifconfig.me)
DOMAIN_IP=$(dig +short "$DOMAIN" | tail -1)

if [ -z "$DOMAIN_IP" ]; then
    error "Could not resolve ${DOMAIN}. Make sure the DNS A record is set and has had time to propagate (wait ~30 minutes after setting it)."
fi

if [ "$DOMAIN_IP" != "$PUBLIC_IP" ]; then
    warn "DNS check: ${DOMAIN} resolves to ${DOMAIN_IP} but this server's public IP is ${PUBLIC_IP}."
    warn "This might cause Certbot to fail. Make sure the A record points to ${PUBLIC_IP}."
    read -p "Continue anyway? (y/N): " CONTINUE
    if [[ "$CONTINUE" != "y" && "$CONTINUE" != "Y" ]]; then
        error "Aborted. Fix the DNS and try again."
    fi
else
    log "DNS check passed — ${DOMAIN} points to ${PUBLIC_IP}."
fi

echo ""
warn "About to begin. This will take a few minutes."
read -p "Press Enter to continue, or Ctrl+C to cancel..."

# -----------------------------------------------------------------------
# PHASE 9 — Install Core Stack
# -----------------------------------------------------------------------
section "Phase 9 — Installing Core Stack"

info "Updating package lists..."
apt-get update -qq

info "Installing Node.js 20..."
if ! command -v node &>/dev/null || [[ "$(node -v)" != v20* ]]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
    apt-get install -y nodejs > /dev/null 2>&1
fi
log "Node.js $(node -v) installed."

info "Installing PM2..."
npm install -g pm2 --silent
log "PM2 $(pm2 -v) installed."

info "Installing nginx and Certbot..."
apt-get install -y nginx certbot python3-certbot-nginx dnsutils > /dev/null 2>&1
systemctl enable nginx > /dev/null 2>&1
systemctl start nginx > /dev/null 2>&1
log "nginx installed and running."

info "Installing PostgreSQL..."
apt-get install -y postgresql postgresql-contrib > /dev/null 2>&1
systemctl enable postgresql > /dev/null 2>&1
systemctl start postgresql > /dev/null 2>&1
log "PostgreSQL installed and running."

# -----------------------------------------------------------------------
# PostgreSQL — create database and user
# -----------------------------------------------------------------------
section "Setting Up PostgreSQL"

info "Creating database user and database..."
sudo -u postgres psql -c "DROP DATABASE IF EXISTS lelu_db;" > /dev/null 2>&1 || true
sudo -u postgres psql -c "DROP USER IF EXISTS lelu_user;" > /dev/null 2>&1 || true
sudo -u postgres psql -c "CREATE USER lelu_user WITH ENCRYPTED PASSWORD '${DB_PASSWORD}';"
sudo -u postgres psql -c "CREATE DATABASE lelu_db OWNER lelu_user;"
sudo -u postgres psql -d lelu_db -c "GRANT ALL ON SCHEMA public TO lelu_user;"
log "Database lelu_db and user lelu_user created."

# -----------------------------------------------------------------------
# PHASE 10 — nginx Config (HTTP first, Certbot upgrades to HTTPS)
# -----------------------------------------------------------------------
section "Phase 10 — Configuring nginx"

info "Removing default nginx site..."
rm -f /etc/nginx/sites-enabled/default

info "Writing initial nginx config for ${DOMAIN}..."
cat > /etc/nginx/sites-available/lelu << NGINXCONF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    add_header X-Frame-Options        "SAMEORIGIN"                      always;
    add_header X-Content-Type-Options "nosniff"                         always;
    add_header X-XSS-Protection       "1; mode=block"                   always;
    add_header Referrer-Policy        "strict-origin-when-cross-origin" always;

    client_max_body_size 20M;

    access_log /var/log/nginx/lelu-access.log;
    error_log  /var/log/nginx/lelu-error.log;

    location /uploads/ {
        alias /var/www/lelu/app/public/uploads/;
        expires 7d;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options "nosniff" always;
        try_files \$uri @nextjs;
    }

    location /_next/static/ {
        alias /var/www/lelu/app/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade    \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host              \$host;
        proxy_set_header X-Real-IP         \$remote_addr;
        proxy_set_header X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout    60s;
        proxy_connect_timeout 10s;
        proxy_send_timeout    60s;
    }

    location @nextjs {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host            \$host;
        proxy_set_header X-Real-IP       \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
NGINXCONF

ln -sf /etc/nginx/sites-available/lelu /etc/nginx/sites-enabled/

info "Testing nginx config..."
nginx -t || error "nginx config has errors — check /etc/nginx/sites-available/lelu"
systemctl reload nginx
log "nginx configured and reloaded."

# -----------------------------------------------------------------------
# PHASE 11 — Deploy LELU
# -----------------------------------------------------------------------
section "Phase 11 — Deploying LELU Platform"

info "Creating leluapp system user..."
if ! id "leluapp" &>/dev/null; then
    adduser --disabled-password --gecos "" leluapp
fi

info "Setting up app directory..."
mkdir -p /var/www/lelu
chown leluapp:leluapp /var/www/lelu

info "Copying app files to /var/www/lelu/app..."
if [ -d "/var/www/lelu/app" ]; then
    warn "Existing deployment found — backing up to /var/www/lelu/app.bak"
    rm -rf /var/www/lelu/app.bak
    mv /var/www/lelu/app /var/www/lelu/app.bak
fi

cp -r "$APP_SOURCE_DIR" /var/www/lelu/app
chown -R leluapp:leluapp /var/www/lelu/app

info "Writing .env file..."
cat > /var/www/lelu/app/.env << ENVFILE
DATABASE_URL="postgresql://lelu_user:${DB_PASSWORD}@localhost:5432/lelu_db"
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"
NEXTAUTH_URL="https://${DOMAIN}"
NODE_ENV="production"
ENVFILE

chmod 600 /var/www/lelu/app/.env
chown leluapp:leluapp /var/www/lelu/app/.env
log ".env written and locked down."

info "Installing Node dependencies..."
cd /var/www/lelu/app
sudo -u leluapp npm install --silent || error "npm install failed — check the error above."
log "Dependencies installed."

info "Regenerating Prisma client for Linux..."
sudo -u leluapp npx prisma generate || error "prisma generate failed."
log "Prisma client generated."

info "Running database migrations..."
sudo -u leluapp npx prisma migrate deploy || error "prisma migrate failed."
log "Database schema created."

info "Seeding default user accounts..."
sudo -u leluapp node prisma/seed.js || error "seed.js failed."
log "Users seeded."

info "Building production app (this takes a few minutes)..."
sudo -u leluapp npm run build || error "npm run build failed — check the error above."
log "App built."

# -----------------------------------------------------------------------
# PM2
# -----------------------------------------------------------------------
section "Setting Up PM2"

info "Starting app under PM2..."
sudo -u leluapp pm2 delete lelu-platform 2>/dev/null || true
cd /var/www/lelu/app
sudo -u leluapp pm2 start "npm start" --name lelu-platform

info "Configuring PM2 to start on boot..."
PM2_STARTUP=$(sudo -u leluapp pm2 startup systemd -u leluapp --hp /home/leluapp | grep "sudo")
if [ -n "$PM2_STARTUP" ]; then
    eval "$PM2_STARTUP"
fi
sudo -u leluapp pm2 save
log "PM2 configured."

# -----------------------------------------------------------------------
# SSL — Certbot
# -----------------------------------------------------------------------
section "Setting Up SSL"

info "Running Certbot for ${DOMAIN}..."
certbot --nginx \
    --non-interactive \
    --agree-tos \
    --email "$SSL_EMAIL" \
    --redirect \
    -d "$DOMAIN" || error "Certbot failed. Check that port 80 is forwarded to this server and DNS is correct."

log "SSL certificate installed. nginx updated to HTTPS automatically."

info "Verifying auto-renewal..."
certbot renew --dry-run > /dev/null 2>&1 && log "Auto-renewal is working." || warn "Auto-renewal dry run failed — check certbot manually."

# -----------------------------------------------------------------------
# PHASE 12 — Backups
# -----------------------------------------------------------------------
section "Phase 12 — Database Backups"

info "Writing backup script..."
cat > /usr/local/bin/backup-lelu-db.sh << BACKUPSCRIPT
#!/bin/bash
BACKUP_DIR="/var/backups/lelu"
DATE=\$(date +%Y-%m-%d)
KEEP_DAYS=30

mkdir -p "\$BACKUP_DIR"

PGPASSWORD="${DB_PASSWORD}" pg_dump -U lelu_user -h localhost lelu_db > "\$BACKUP_DIR/lelu-\$DATE.sql"
gzip -f "\$BACKUP_DIR/lelu-\$DATE.sql"

find "\$BACKUP_DIR" -name "*.sql.gz" -mtime +\$KEEP_DAYS -delete

echo "Backup complete: \$BACKUP_DIR/lelu-\$DATE.sql.gz"
BACKUPSCRIPT

chmod +x /usr/local/bin/backup-lelu-db.sh

info "Running first backup..."
/usr/local/bin/backup-lelu-db.sh
log "First backup created."

info "Scheduling daily backup at 2 AM..."
(crontab -l 2>/dev/null | grep -v "backup-lelu-db"; echo "0 2 * * * /usr/local/bin/backup-lelu-db.sh >> /var/log/lelu-backup.log 2>&1") | crontab -
log "Cron job set."

# -----------------------------------------------------------------------
# Health check
# -----------------------------------------------------------------------
section "Verifying Deployment"

info "Waiting for app to come up..."
sleep 5

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "307" ] || [ "$HTTP_CODE" = "302" ]; then
    log "App is responding on port 3000 (HTTP $HTTP_CODE)."
else
    warn "App returned HTTP $HTTP_CODE on port 3000 — check: pm2 logs lelu-platform"
fi

HTTPS_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://${DOMAIN} || echo "000")
if [ "$HTTPS_CODE" = "200" ] || [ "$HTTPS_CODE" = "307" ] || [ "$HTTPS_CODE" = "302" ]; then
    log "HTTPS is working (HTTP $HTTPS_CODE)."
else
    warn "HTTPS check returned $HTTPS_CODE — check: sudo tail /var/log/nginx/lelu-error.log"
fi

# -----------------------------------------------------------------------
# Done
# -----------------------------------------------------------------------
section "Setup Complete"

echo ""
echo -e "  ${GREEN}LELU is live at:${NC} https://${DOMAIN}"
echo ""
echo -e "  ${YELLOW}Default login credentials (change these immediately):${NC}"
echo "    head@lelu.gov.gh         — Head of Unit"
echo "    admin@lelu.gov.gh        — Office Administrator"
echo "    supervisor@lelu.gov.gh   — Supervisor"
echo "    asante@lelu.gov.gh       — Officer"
echo "    boateng@lelu.gov.gh      — Officer"
echo "    darko@lelu.gov.gh        — Officer"
echo "    Password: lelu2026"
echo ""
echo -e "  ${YELLOW}Useful commands:${NC}"
echo "    pm2 status                      — check app is running"
echo "    pm2 logs lelu-platform          — view live logs"
echo "    pm2 restart lelu-platform       — restart the app"
echo "    sudo nginx -t                   — test nginx config"
echo "    sudo systemctl reload nginx     — reload nginx"
echo "    ls /var/backups/lelu/           — check backups"
echo "    sudo certbot renew --dry-run    — test SSL auto-renewal"
echo ""
echo -e "  ${YELLOW}NEXTAUTH_SECRET (save this somewhere safe):${NC}"
echo "    ${NEXTAUTH_SECRET}"
echo ""
warn "Tell all officers to change their passwords on first login."
echo ""