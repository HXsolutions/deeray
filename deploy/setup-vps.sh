#!/bin/bash
set -e

DOMAIN="${1:-yourdomain.com}"
APP_DIR="/var/www/deeray"

echo "=== Deeray VPS Setup ==="

# Dependencies
sudo apt update -qq
sudo apt install -y -qq curl git docker.io docker-compose-v2 nginx certbot python3-certbot-nginx
sudo usermod -aG docker ubuntu

# App directory
sudo mkdir -p "$APP_DIR"
sudo chown -R ubuntu:ubuntu "$APP_DIR"

echo ""
echo "GitHub se clone karo:"
echo "  git clone <your-repo-url> $APP_DIR"
echo ""
echo "Phir env file banao:"
echo "  cp $APP_DIR/.env.production.example $APP_DIR/.env.production"
echo "  nano $APP_DIR/.env.production"
echo ""
echo "Phir run karo:"
echo "  cd $APP_DIR"
echo "  docker compose --env-file .env.production up -d db"
echo "  sleep 15"
echo "  docker compose --env-file .env.production run --rm migrate"
echo "  docker compose --env-file .env.production up -d app"
echo "  docker compose exec app npx prisma db seed"
echo ""
echo "Nginx + SSL:"
echo "  sudo cp $APP_DIR/deploy/nginx.conf /etc/nginx/sites-available/deeray"
echo "  sudo sed -i 's/yourdomain.com/$DOMAIN/g' /etc/nginx/sites-available/deeray"
echo "  sudo sed -i 's/www.yourdomain.com/www.$DOMAIN/g' /etc/nginx/sites-available/deeray"
echo "  sudo ln -sf /etc/nginx/sites-available/deeray /etc/nginx/sites-enabled/"
echo "  sudo rm -f /etc/nginx/sites-enabled/default"
echo "  sudo nginx -t && sudo systemctl reload nginx"
echo "  sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN"
echo ""
echo "Naya version: bash $APP_DIR/deploy/deploy.sh"
