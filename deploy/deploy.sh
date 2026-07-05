#!/bin/bash
set -e

APP_DIR="/var/www/deeray"
ENV_FILE=".env.production"

cd "$APP_DIR"

echo "1. Pulling latest code..."
git pull origin main

echo "2. Pulling latest Docker image..."
docker compose --env-file "$ENV_FILE" pull app

echo "3. Running migrations..."
docker compose --env-file "$ENV_FILE" run --rm app npx prisma generate
docker compose --env-file "$ENV_FILE" run --rm app npx prisma db push

echo "4. Starting app..."
docker compose --env-file "$ENV_FILE" up -d app

echo "Done."
