#!/usr/bin/env bash
set -euo pipefail

APP_NAME="${APP_NAME:-api-schema-columns}"
APP_DIR="${APP_DIR:-/var/www/clients/client5/web26/private/api-schema-columns}"
PORT="${PORT:-3001}"
ACTION="${1:-deploy}"

export PATH="$HOME/.npm-global/bin:$HOME/.local/bin:$PATH"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing command: $1"
    exit 1
  fi
}

start_or_restart() {
  cd "$APP_DIR"

  if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
    PORT="$PORT" pm2 restart "$APP_NAME" --update-env
  else
    PORT="$PORT" pm2 start npm --name "$APP_NAME" -- start
  fi

  pm2 save
  pm2 list
}

require_command npm
require_command pm2

case "$ACTION" in
  deploy)
    cd "$APP_DIR"
    npm install
    npm run build
    start_or_restart
    ;;
  start)
    start_or_restart
    ;;
  restart)
    PORT="$PORT" pm2 restart "$APP_NAME" --update-env
    pm2 save
    pm2 list
    ;;
  stop)
    pm2 stop "$APP_NAME"
    pm2 save
    ;;
  delete)
    pm2 delete "$APP_NAME"
    pm2 save
    ;;
  status)
    pm2 list
    ;;
  logs)
    pm2 logs "$APP_NAME" --lines 100
    ;;
  *)
    echo "Usage: $0 {deploy|start|restart|stop|delete|status|logs}"
    echo "Env: APP_NAME=$APP_NAME APP_DIR=$APP_DIR PORT=$PORT"
    exit 2
    ;;
esac
