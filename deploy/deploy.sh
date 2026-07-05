#!/bin/bash
set -e

APP_DIR="/var/www/deeray"
ENV_FILE=".env.production"

cd "$APP_DIR"

echo "1. Pulling latest code..."
git pull origin main

echo "2. Pulling latest image from Docker Hub..."
docker compose --env-file "$ENV_FILE" pull app

echo "3. Running migrations..."
docker compose --env-file "$ENV_FILE" run --rm app npx prisma generate
docker compose --env-file "$ENV_FILE" run --rm app npx prisma db push

echo "4. Starting app..."
docker compose --env-file "$ENV_FILE" up -d app || true

sleep 15

if curl -sf http://localhost:3000/api/health >/dev/null 2>&1; then
  echo "Done."
else
  echo "Failed — rolling back to previous version..."
  git checkout HEAD~1 -- Dockerfile docker-compose.yml Makefile deploy/ src/ prisma/ package.json
  docker compose --env-file "$ENV_FILE" build app
  docker compose --env-file "$ENV_FILE" up -d app
  git checkout main
fi
