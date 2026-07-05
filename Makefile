ENV_FILE = .env.production

.PHONY: help setup env db pull migrate seed start restart stop logs deploy

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

setup:
	sudo apt update && sudo apt install -y docker.io docker-compose-v2 nginx certbot python3-certbot-nginx git nodejs npm
	sudo usermod -aG docker ubuntu
	sudo npm install -g pm2

env:
	cp -n .env.production.example $(ENV_FILE)
	@echo "Edit $(ENV_FILE) with your values"

db:
	docker compose --env-file $(ENV_FILE) up -d db

build:
	docker compose --env-file $(ENV_FILE) build app

migrate:
	docker compose --env-file $(ENV_FILE) run --rm app npx prisma generate
	docker compose --env-file $(ENV_FILE) run --rm app npx prisma db push

seed:
	docker compose --env-file $(ENV_FILE) run --rm app npx prisma db seed

start:
	docker compose --env-file $(ENV_FILE) up -d app

restart:
	docker compose --env-file $(ENV_FILE) up -d app

stop:
	docker compose down

logs:
	docker compose logs -f app

deploy: git_pull build migrate restart

git_pull:
	git pull origin main

nginx:
	DOMAIN=$(DOMAIN) sudo sed -i "s/yourdomain.com/$$DOMAIN/g" deploy/nginx.conf
	DOMAIN=$(DOMAIN) sudo sed -i "s/www.yourdomain.com/www.$$DOMAIN/g" deploy/nginx.conf
	sudo cp deploy/nginx.conf /etc/nginx/sites-available/deeray
	sudo ln -sf /etc/nginx/sites-available/deeray /etc/nginx/sites-enabled/
	sudo rm -f /etc/nginx/sites-enabled/default
	sudo nginx -t && sudo systemctl reload nginx

ssl:
	sudo certbot --nginx -d $(DOMAIN) -d www.$(DOMAIN) --non-interactive --agree-tos -m admin@$(DOMAIN)
