#!/bin/bash
set -e

APP_NAME="${APP_NAME:-api-schema-columns}"
APP_DIR="${APP_DIR:-/var/www/clients/client5/web26/private/api-schema-columns}"
BACKUP_DIR="${BACKUP_DIR:-/var/www/clients/client5/web26/private/backups}"
BRANCH="${BRANCH:-main}"

export PATH="$HOME/.npm-global/bin:$HOME/.local/bin:$PATH"

echo "Creating backup..."
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_FILE="$BACKUP_DIR/${APP_NAME}-rebuild-${TIMESTAMP}.tar.gz"
mkdir -p "$BACKUP_DIR"
cd "$APP_DIR"
tar -czf "$BACKUP_FILE" --ignore-failed-read \
    app components hooks lib public styles types \
    package.json next.config.mjs postcss.config.mjs \
    tsconfig.json components.json ecosystem.config.js scripts \
    2>/dev/null || true
echo "Backup: $BACKUP_FILE"

echo "Pulling latest ($BRANCH)..."
cd "$APP_DIR"
git pull origin "$BRANCH"

echo "Installing dependencies..."
npm install

echo "Building..."
npm run build

echo "Restarting PM2..."
pm2 restart "$APP_NAME"
pm2 save

echo "Done."
