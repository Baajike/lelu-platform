#!/bin/bash
# =============================================================================
# LELU Platform — Auto Update Script
# Pulls latest code from master, rebuilds, and restarts the app.
#
# Runs daily via cron — set up by running:
#   sudo bash update.sh --install
#
# To run a manual update:
#   sudo bash update.sh
#
# Deploy key setup (one time only — do this before scheduling):
#   1. Run: sudo bash update.sh --setup-key
#   2. Copy the public key it prints
#   3. Go to https://github.com/Baajike/lelu-platform/settings/keys
#   4. Click "Add deploy key", paste the key, title it "csa-server", read-only is fine
#   5. Save and you're done
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

APP_DIR="/var/www/lelu/app"
REPO="git@github.com:Baajike/lelu-platform.git"
BRANCH="master"
LOG_FILE="/var/log/lelu-update.log"
DEPLOY_KEY="/home/leluapp/.ssh/lelu_deploy_key"

# -----------------------------------------------------------------------
# Setup deploy key — run once before scheduling
# -----------------------------------------------------------------------
if [ "$1" = "--setup-key" ]; then
    section "Setting Up GitHub Deploy Key"

    if [ ! -d "/home/leluapp/.ssh" ]; then
        mkdir -p /home/leluapp/.ssh
        chown leluapp:leluapp /home/leluapp/.ssh
        chmod 700 /home/leluapp/.ssh
    fi

    if [ -f "$DEPLOY_KEY" ]; then
        warn "Deploy key already exists at $DEPLOY_KEY"
        read -p "Generate a new one anyway? This will replace the old key. (y/N): " OVERWRITE
        if [[ "$OVERWRITE" != "y" && "$OVERWRITE" != "Y" ]]; then
            echo ""
            echo "Existing public key:"
            cat "${DEPLOY_KEY}.pub"
            exit 0
        fi
    fi

    info "Generating deploy key..."
    sudo -u leluapp ssh-keygen -t ed25519 -C "lelu-csa-server-deploy" -f "$DEPLOY_KEY" -N ""
    chown leluapp:leluapp "$DEPLOY_KEY" "${DEPLOY_KEY}.pub"
    chmod 600 "$DEPLOY_KEY"

    # Add GitHub to known hosts so git doesn't prompt on first connect
    sudo -u leluapp ssh-keyscan -H github.com >> /home/leluapp/.ssh/known_hosts 2>/dev/null
    chown leluapp:leluapp /home/leluapp/.ssh/known_hosts

    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  Deploy key generated. Add this to GitHub:${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    cat "${DEPLOY_KEY}.pub"
    echo ""
    echo "Steps:"
    echo "  1. Copy the key above"
    echo "  2. Go to: https://github.com/Baajike/lelu-platform/settings/keys"
    echo "  3. Click 'Add deploy key'"
    echo "  4. Title: csa-server"
    echo "  5. Paste the key"
    echo "  6. Leave 'Allow write access' unchecked"
    echo "  7. Click Add key"
    echo ""
    echo "Then test the connection:"
    echo "  sudo -u leluapp GIT_SSH_COMMAND='ssh -i $DEPLOY_KEY' git ls-remote $REPO"
    echo ""
    echo "Once that works, schedule the daily update:"
    echo "  sudo bash update.sh --install"
    echo ""
    exit 0
fi

# -----------------------------------------------------------------------
# Install — schedule the daily cron job
# -----------------------------------------------------------------------
if [ "$1" = "--install" ]; then
    section "Scheduling Daily Updates"

    if [ ! -f "$DEPLOY_KEY" ]; then
        error "Deploy key not found. Run 'sudo bash update.sh --setup-key' first."
    fi

    # Test the connection before scheduling
    info "Testing GitHub connection..."
    sudo -u leluapp GIT_SSH_COMMAND="ssh -i $DEPLOY_KEY" git ls-remote "$REPO" > /dev/null 2>&1 \
        || error "Cannot connect to GitHub. Make sure the deploy key has been added to the repo."
    log "GitHub connection works."

    SCRIPT_PATH="$(realpath "$0")"

    # Remove existing entry if any, then add fresh
    (crontab -l 2>/dev/null | grep -v "update.sh"; \
     echo "0 3 * * * sudo bash $SCRIPT_PATH >> $LOG_FILE 2>&1") | crontab -

    log "Daily update scheduled at 3 AM."
    echo ""
    echo "To run a manual update anytime:"
    echo "  sudo bash $SCRIPT_PATH"
    echo ""
    echo "To check update logs:"
    echo "  sudo tail -f $LOG_FILE"
    echo ""
    exit 0
fi

# -----------------------------------------------------------------------
# Run update
# -----------------------------------------------------------------------
section "LELU Update — $(date '+%Y-%m-%d %H:%M:%S')"

if [ "$EUID" -ne 0 ]; then
    error "Please run with sudo: sudo bash update.sh"
fi

if [ ! -d "$APP_DIR" ]; then
    error "App directory not found at $APP_DIR. Has setup.sh been run?"
fi

if [ ! -f "$DEPLOY_KEY" ]; then
    error "Deploy key not found. Run 'sudo bash update.sh --setup-key' first."
fi

cd "$APP_DIR"

# -----------------------------------------------------------------------
# Check if there's anything new before doing any work
# -----------------------------------------------------------------------
info "Checking for updates on master..."
sudo -u leluapp GIT_SSH_COMMAND="ssh -i $DEPLOY_KEY" git fetch origin master > /dev/null 2>&1

LOCAL=$(sudo -u leluapp git rev-parse HEAD)
REMOTE=$(sudo -u leluapp git rev-parse origin/master)

if [ "$LOCAL" = "$REMOTE" ]; then
    log "Already up to date. Nothing to do."
    echo "$(date '+%Y-%m-%d %H:%M:%S') — Already up to date." >> "$LOG_FILE"
    exit 0
fi

# Show what changed
echo ""
info "Changes incoming:"
sudo -u leluapp git log --oneline HEAD..origin/master
echo ""

# -----------------------------------------------------------------------
# Pull latest code
# -----------------------------------------------------------------------
info "Pulling latest code from master..."
sudo -u leluapp GIT_SSH_COMMAND="ssh -i $DEPLOY_KEY" git pull origin master
log "Code updated."

# -----------------------------------------------------------------------
# Install any new dependencies
# -----------------------------------------------------------------------
info "Installing dependencies..."
sudo -u leluapp npm install --silent
log "Dependencies up to date."

# -----------------------------------------------------------------------
# Regenerate Prisma client in case schema changed
# -----------------------------------------------------------------------
info "Regenerating Prisma client..."
sudo -u leluapp npx prisma generate > /dev/null 2>&1
log "Prisma client regenerated."

# -----------------------------------------------------------------------
# Run any new migrations
# -----------------------------------------------------------------------
info "Running migrations..."
sudo -u leluapp npx prisma migrate deploy
log "Migrations done."

# -----------------------------------------------------------------------
# Rebuild the app
# -----------------------------------------------------------------------
info "Building app..."
sudo -u leluapp npm run build
log "App rebuilt."

# -----------------------------------------------------------------------
# Restart PM2
# -----------------------------------------------------------------------
info "Restarting app..."
sudo -u leluapp pm2 restart lelu-platform
log "App restarted."

# -----------------------------------------------------------------------
# Verify it came back up
# -----------------------------------------------------------------------
sleep 3
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "307" ] || [ "$HTTP_CODE" = "302" ]; then
    log "App is up and responding (HTTP $HTTP_CODE)."
else
    warn "App returned HTTP $HTTP_CODE after restart — check: pm2 logs lelu-platform"
fi

# -----------------------------------------------------------------------
# Log the update
# -----------------------------------------------------------------------
NEW_VERSION=$(sudo -u leluapp git rev-parse --short HEAD)
echo "$(date '+%Y-%m-%d %H:%M:%S') — Updated to ${NEW_VERSION}" >> "$LOG_FILE"

section "Update Complete"
echo ""
echo -e "  ${GREEN}Updated to:${NC} ${NEW_VERSION}"
echo "  Check logs: sudo tail $LOG_FILE"
echo ""
