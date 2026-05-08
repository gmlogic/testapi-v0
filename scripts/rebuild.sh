#!/bin/bash
echo "Pulling latest..."
git pull origin gmlogic

echo "Building..."
npm run build

echo "Restarting PM2..."
pm2 restart panel-press

echo "Done."
