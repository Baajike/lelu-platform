#!/bin/bash
set -euo pipefail

# ============================================================
#  LELU Platform — Update Script
#  Pulls latest code, applies DB migrations, rebuilds, restarts.
#
#  DATABASE SAFETY:
#    'prisma migrate deploy' only runs NEW forward migrations.
#    It will NEVER roll back, drop tables, or delete data.
#    Existing data is always preserved.
#
#  Run as: sudo bash update.sh
# ============================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✔]${NC} $1"; }
info() { echo -e "${BLUE}[→]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
fail() { echo -e "${RED}[✘]${NC} $1"; exit 1; }

# ── Root check ───────────────────────────────────────────────
if [ "$EUID" -ne 0 ]; then
  fail "Please run as root: sudo bash update.sh"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  LELU Update — $(date '+%Y-%m-%d %H:%M:%S')"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── Detect APP_DIR ───────────────────────────────────────────
APP_DIR=""

# Try PM2 first
if pm2 describe lelu-platform &>/dev/null; then
  APP_DIR=$(pm2 describe lelu-platform 2>/dev/null \
    | grep -i "exec cwd" | awk '{print $NF}' | head -1 || true)
fi

# Fallback: common locations
if [ -z "$APP_DIR" ] || [ ! -d "$APP_DIR" ]; then
  for candidate in /var/www/lelu/app /var/www/lelu-platform /opt/lelu-platform; do
    if [ -d "$candidate" ] && [ -f "$candidate/package.json" ]; then
      APP_DIR="$candidate"
      break
    fi
  done
fi

# Last resort: ask
if [ -z "$APP_DIR" ] || [ ! -d "$APP_DIR" ]; then
  read -rp "  App directory [/var/www/lelu/app]: " APP_DIR
  APP_DIR="${APP_DIR:-/var/www/lelu/app}"
fi

[ -d "$APP_DIR" ]              || fail "App directory not found: $APP_DIR"
[ -f "$APP_DIR/package.json" ] || fail "package.json not found in $APP_DIR — is this the right directory?"
[ -f "$APP_DIR/.env" ]         || fail ".env not found at $APP_DIR/.env — create it before running updates."

info "App directory : $APP_DIR"

# ── Read NEXTAUTH_URL for display ────────────────────────────
NEXTAUTH_URL=$(grep '^NEXTAUTH_URL=' "$APP_DIR/.env" | cut -d= -f2- | tr -d '"' || true)
[ -n "$NEXTAUTH_URL" ] && info "App URL       : $NEXTAUTH_URL"
echo ""

cd "$APP_DIR" || fail "Cannot cd to $APP_DIR"

# Allow root to access repo even if owned by another user
git config --global --add safe.directory "$APP_DIR" 2>/dev/null || true

# ── Step 1: Pull latest code ─────────────────────────────────
info "Checking for updates on master..."
git fetch origin master

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/master)

if [ "$LOCAL" = "$REMOTE" ]; then
  warn "Already up to date ($(git rev-parse --short HEAD))."
else
  # Hard reset — discards any local edits so the pull is never blocked.
  # Secrets live in .env (gitignored), so nothing important is lost.
  git reset --hard origin/master || fail "git reset failed"
  log "Code updated $(git rev-parse --short "$LOCAL")  →  $(git rev-parse --short HEAD)."
fi
echo ""

# ── Step 2: Install / sync dependencies ──────────────────────
info "Installing dependencies..."
npm install || fail "npm install failed"
log "Dependencies installed."
echo ""

# ── Step 3: Database migrations (data-safe) ──────────────────
info "Running database migrations..."
# Use the LOCAL prisma binary to avoid npx pulling a breaking global version.
PRISMA="./node_modules/.bin/prisma"
[ -f "$PRISMA" ] || fail "Prisma binary not found — did npm install succeed?"

$PRISMA migrate deploy || fail "prisma migrate deploy failed"
log "Migrations applied."

info "Regenerating Prisma client..."
$PRISMA generate || fail "prisma generate failed"
log "Prisma client regenerated."
echo ""

# ── Step 4: Build Next.js app ────────────────────────────────
info "Building Next.js app..."
npm run build || fail "Build failed — the running app is unchanged."
log "Build complete."
echo ""

# ── Step 5: Fix file ownership ───────────────────────────────
# Ensure the process user (typically the lelu system user) owns the files.
APP_USER=$(stat -c '%U' "$APP_DIR/package.json" 2>/dev/null || echo "")
if [ -n "$APP_USER" ] && [ "$APP_USER" != "root" ]; then
  chown -R "$APP_USER":"$APP_USER" "$APP_DIR"
  log "Ownership set to $APP_USER."
fi

# ── Step 6: Restart via PM2 ──────────────────────────────────
info "Restarting lelu-platform..."
pm2 restart lelu-platform || fail "PM2 restart failed — check: pm2 logs lelu-platform"
pm2 save
log "App restarted."
echo ""

# ── Step 7: Health check ─────────────────────────────────────
info "Health check..."
sleep 3
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  --max-time 10 http://localhost:3000 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "302" ]; then
  log "App is responding (HTTP $HTTP_CODE)."
else
  warn "App returned HTTP $HTTP_CODE — check logs: pm2 logs lelu-platform"
fi

# ── Done ─────────────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "  ${GREEN}Update complete!${NC}  $(git rev-parse --short HEAD)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
[ -n "$NEXTAUTH_URL" ] && echo -e "  ${GREEN}App:${NC}    $NEXTAUTH_URL"
echo -e "  ${GREEN}Status:${NC} pm2 status"
echo -e "  ${GREEN}Logs:${NC}   pm2 logs lelu-platform"
echo ""
