#!/bin/bash
set -e

# ==========================================
# Deeray — Zero-downtime Deploy Script
# Usage: bash deploy/deploy.sh
# ==========================================

APP_DIR="/opt/deeray"
BACKUP_DIR="/opt/deeray-backups/$(date +%Y%m%d_%H%M%S)"
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env.production"

echo "🚀 Starting deploy: $(date)"

# 1. Validate env
if [ ! -f "$APP_DIR/$ENV_FILE" ]; then
    echo "❌ $ENV_FILE not found. Create from .env.example"
    exit 1
fi

# 2. Pull latest code
cd "$APP_DIR"
echo "📦 Pulling latest code..."
git pull origin main

# 3. Create backup
echo "💾 Backing up current state..."
mkdir -p "$BACKUP_DIR"
docker compose exec -T db pg_dump -U deeray deeray > "$BACKUP_DIR/db.sql" 2>/dev/null || true
cp "$ENV_FILE" "$BACKUP_DIR/"

# 4. Build new images
echo "🏗️  Building new images..."
docker compose -f "$COMPOSE_FILE" build --no-cache app

# 5. Run migrations (safe — runs in a separate container that exits)
echo "🗃️  Running database migrations..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" run --rm migrate

# 6. Zero-downtime swap (graceful)
echo "🔄 Rolling update..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --no-deps --scale app=2 --no-recreate db
sleep 5

# Health check: wait for new containers to pass
for i in {1..30}; do
    HEALTHY=$(docker compose ps app | grep "healthy" | wc -l)
    if [ "$HEALTHY" -ge 1 ]; then
        echo "✅ New container healthy"
        # Gracefully stop old
        docker compose exec -T app sh -c "kill -TERM 1" || true
        sleep 3
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --no-deps --scale app=1
        break
    fi
    echo "⏳ Waiting for container to be healthy... ($i/30)"
    sleep 2
done

# 7. Cleanup
echo "🧹 Cleaning up..."
docker system prune -f --filter "until=24h" 2>/dev/null || true

echo "✅ Deploy complete: $(date)"
