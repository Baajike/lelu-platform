#!/bin/bash
# =============================================================================
# LELU Platform — Update Script
# Pulls latest code from master, rebuilds, and restarts the app.
#
# Usage:
#   sudo bash update.sh              # Run a manual update
#   sudo bash update.sh --install    # Schedule daily auto-updates via cron
#   sudo bash update.sh --status     # Show current version and app health
# =============================================================================

set -euo pipefail

# ── Colours ──────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log()     { echo -e "${GREEN}[✔]${NC} $1"; }
info()    { echo -e "${BLUE}[→]${NC} $1"; }
warn()    { echo -e "${YELLOW}[!]${NC} $1"; }
error()   { echo -e "${RED}[✘]${NC} $1"; exit 1; }
section() {
  echo ""
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${CYAN}  $1${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# ── Config ───────────────────────────────────────────────────────────────────
REPO="https://github.com/Baajike/lelu-platform.git"
BRANCH="master"
PM2_APP="lelu-platform"
LOG_FILE="/var/log/lelu-update.log"

# ── Resolve APP_DIR ──────────────────────────────────────────────────────────
# Try PM2 first, then common locations, then ask.
resolve_app_dir() {
  local dir=""

  if command -v pm2 &>/dev/null && pm2 describe "$PM2_APP" &>/dev/null; then
    dir=$(pm2 describe "$PM2_APP" 2>/dev/null \
      | grep -i "exec cwd" | awk '{print $NF}' | head -1 || true)
  fi

  if [ -z "$dir" ] || [ ! -d "$dir" ]; then
    for candidate in /var/www/lelu/app /var/www/lelu-platform /opt/lelu-platform; do
      if [ -d "$candidate" ] && [ -f "$candidate/package.json" ]; then
        dir="$candidate"
        break
      fi
    done
  fi

  if [ -z "$dir" ] || [ ! -d "$dir" ]; then
    read -rp "  App directory not found. Enter path: " dir
  fi

  echo "$dir"
}

# ── Root check ───────────────────────────────────────────────────────────────
if [ "$EUID" -ne 0 ]; then
  error "Please run with sudo: sudo bash update.sh"
fi

# ── --status ─────────────────────────────────────────────────────────────────
if [ "${1:-}" = "--status" ]; then
  section "LELU Platform — Status"
  APP_DIR=$(resolve_app_dir)
  info "App directory : $APP_DIR"
  info "Current commit: $(cd "$APP_DIR" && git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"
  info "Branch        : $(cd "$APP_DIR" && git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')"
  echo ""
  pm2 show "$PM2_APP" 2>/dev/null || warn "PM2 process '$PM2_APP' not found."
  echo ""
  exit 0
fi

# ── --install ─────────────────────────────────────────────────────────────────
if [ "${1:-}" = "--install" ]; then
  section "Scheduling Daily Updates"
  SCRIPT_PATH="$(realpath "$0")"
  # Remove existing entry, add fresh at 3 AM
  (crontab -l 2>/dev/null | grep -v "$SCRIPT_PATH"; \
   echo "0 3 * * * sudo bash $SCRIPT_PATH >> $LOG_FILE 2>&1") | crontab -
  log "Daily update scheduled at 3:00 AM."
  echo ""
  echo "  Manual update : sudo bash $SCRIPT_PATH"
  echo "  Update logs   : sudo tail -f $LOG_FILE"
  echo ""
  exit 0
fi

# ═════════════════════════════════════════════════════════════════════════════
#  MAIN UPDATE
# ═════════════════════════════════════════════════════════════════════════════
section "LELU Update — $(date '+%Y-%m-%d %H:%M:%S')"

APP_DIR=$(resolve_app_dir)

[ -d "$APP_DIR" ]              || error "App directory not found: $APP_DIR"
[ -f "$APP_DIR/package.json" ] || error "package.json not found in $APP_DIR — is this the right directory?"
[ -f "$APP_DIR/.env" ]         || error ".env not found at $APP_DIR/.env — app cannot run without it."

info "App directory : $APP_DIR"
cd "$APP_DIR"

# ── Git safe.directory (needed when root pulls a repo owned by another user) ─
git config --global --add safe.directory "$APP_DIR" 2>/dev/null || true

# ── Step 1: Fetch & check for updates ────────────────────────────────────────
info "Checking for updates on $BRANCH..."
git fetch origin "$BRANCH" 2>&1 || error "git fetch failed — check network or repo URL."

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/$BRANCH")

if [ "$LOCAL" = "$REMOTE" ]; then
  log "Already up to date ($(git rev-parse --short HEAD))."
  echo "$(date '+%Y-%m-%d %H:%M:%S') — Already up to date." >> "$LOG_FILE"
  echo ""
  exit 0
fi

echo ""
info "Changes incoming:"
git log --oneline HEAD..origin/"$BRANCH"
echo ""

# ── Step 2: Pull latest code ─────────────────────────────────────────────────
info "Pulling latest code..."
# Hard reset so stale local edits never block the pull.
# Secrets live in .env (gitignored) — they are never touched.
git reset --hard origin/"$BRANCH" || error "git reset failed."
log "Code updated to $(git rev-parse --short HEAD)."

# ── Step 3: Dependencies ──────────────────────────────────────────────────────
info "Installing dependencies..."
npm install || error "npm install failed."
log "Dependencies installed."

# ── Step 4: Prisma ───────────────────────────────────────────────────────────
# migrate deploy: runs only NEW forward migrations — never drops or resets data.
info "Running database migrations..."
npx prisma migrate deploy || error "Prisma migrate deploy failed."
log "Migrations applied."

info "Regenerating Prisma client..."
npx prisma generate || error "Prisma generate failed."
log "Prisma client up to date."

# ── Step 5: Build ─────────────────────────────────────────────────────────────
info "Building app..."
npm run build || error "Build failed — rolled back; app is still running the previous version."
log "Build complete."

# ── Step 6: Restart ───────────────────────────────────────────────────────────
info "Restarting app via PM2..."
if pm2 describe "$PM2_APP" &>/dev/null; then
  pm2 restart "$PM2_APP" || error "PM2 restart failed."
  pm2 save --force
  log "App restarted."
else
  warn "PM2 process '$PM2_APP' not found — starting it now..."
  pm2 start npm --name "$PM2_APP" -- start
  pm2 save --force
  log "App started."
fi

# ── Step 7: Health check ──────────────────────────────────────────────────────
info "Waiting for app to come up..."
sleep 5

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://localhost:3000 2>/dev/null || echo "000")

if [[ "$HTTP_CODE" =~ ^(200|301|302|307|308)$ ]]; then
  log "App is healthy (HTTP $HTTP_CODE)."
else
  warn "App returned HTTP $HTTP_CODE — check logs: pm2 logs $PM2_APP"
fi

# ── Log the update ────────────────────────────────────────────────────────────
NEW_VERSION=$(git rev-parse --short HEAD)
echo "$(date '+%Y-%m-%d %H:%M:%S') — Updated to ${NEW_VERSION} (HTTP ${HTTP_CODE})" >> "$LOG_FILE"

# ── Done ──────────────────────────────────────────────────────────────────────
section "Update Complete ✔"
echo ""
echo -e "  ${GREEN}Version:${NC} ${NEW_VERSION}"
echo -e "  ${GREEN}Status :${NC} pm2 status"
echo -e "  ${GREEN}Logs   :${NC} pm2 logs ${PM2_APP}"
echo -e "  ${GREEN}History:${NC} sudo tail $LOG_FILE"
echo ""
