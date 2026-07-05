#!/bin/bash
set -e

APP_DIR="/var/www/deeray"
ENV_FILE=".env.production"

cd "$APP_DIR"

echo "1. Pulling latest code..."
git pull origin main

echo "2. Building app..."
docker compose --env-file "$ENV_FILE" build app

echo "3. Running migrations..."
docker compose --env-file "$ENV_FILE" run --rm migrate

echo "4. Restarting app..."
docker compose --env-file "$ENV_FILE" up -d app

echo "Done."
