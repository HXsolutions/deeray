#!/bin/bash
set -e

# ==========================================
# Deeray — Quick Setup for VPS (Ubuntu/Debian)
# Run: bash deploy/setup-vps.sh
# ==========================================

DOMAIN="${1:-yourdomain.com}"
echo "🚀 Setting up Deeray on VPS for domain: $DOMAIN"

# 1. System dependencies
echo "📦 Installing system dependencies..."
sudo apt-get update -qq
sudo apt-get install -y -qq curl git docker.io docker-compose-v2 nginx certbot python3-certbot-nginx

# 2. Start Docker
sudo systemctl enable --now docker

# 3. Create app directory
sudo mkdir -p /opt/deeray
sudo chown -R "$USER:$USER" /opt/deeray

# 4. Clone repo (replace with your repo URL)
echo "📥 Clone your repository manually:"
echo "    git clone <your-repo-url> /opt/deeray"
echo ""
echo "    Or if already cloned:"
echo "    cp -r /path/to/deeray/* /opt/deeray/"

# 5. Create .env.production
if [ ! -f /opt/deeray/.env.production ]; then
    echo "🔧 Creating .env.production — edit with your values"
    cat > /opt/deeray/.env.production << 'ENVEOF'
DATABASE_URL="postgresql://deeray:YOUR_DB_PASSWORD@db:5432/deeray?schema=public"
SESSION_SECRET="YOUR_64_CHAR_HEX_SECRET"
NEXT_PUBLIC_SITE_URL="https://$DOMAIN"
NEXT_PUBLIC_GA4_ID=""
NEXT_PUBLIC_FB_PIXEL_ID=""
ENVEOF
    echo "⚠️  Edit /opt/deeray/.env.production with your secrets!"
fi

# 6. Generate session secret
SECRET=$(openssl rand -hex 32)
echo "🔑 Generated SESSION_SECRET: $SECRET"
sed -i "s/YOUR_64_CHAR_HEX_SECRET/$SECRET/" /opt/deeray/.env.production

# 7. Set up Nginx
echo "🔧 Configuring Nginx..."
sudo cp /opt/deeray/deploy/nginx.conf /etc/nginx/sites-available/deeray
sudo sed -i "s/yourdomain.com/$DOMAIN/g" /etc/nginx/sites-available/deeray
sudo sed -i "s/www.yourdomain.com/www.$DOMAIN/g" /etc/nginx/sites-available/deeray
sudo ln -sf /etc/nginx/sites-available/deeray /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# 8. SSL via Let's Encrypt
echo "🔒 Obtaining SSL certificate..."
sudo certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m "admin@$DOMAIN" || true

# 9. First deploy
echo "🚀 Running first deploy..."
cd /opt/deeray
DB_PASSWORD=$(openssl rand -hex 16)
sed -i "s/YOUR_DB_PASSWORD/$DB_PASSWORD/" .env.production
export DB_PASSWORD
docker compose --env-file .env.production up -d db
sleep 10
docker compose --env-file .env.production run --rm migrate
docker compose --env-file .env.production up -d app

echo ""
echo "✅ Setup complete!"
echo "   Site: https://$DOMAIN"
echo "   Admin: https://$DOMAIN/admin"
echo "   DB password: $DB_PASSWORD (check .env.production)"
echo ""
echo "⚠️  Next steps:"
echo "   1. Create admin user: docker compose exec app npx prisma db seed"
echo "   2. Set GA4/FB Pixel IDs in .env.production"
echo "   3. For updates: bash deploy/deploy.sh"
