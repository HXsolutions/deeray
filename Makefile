ENV_FILE = .env.production

.PHONY: help setup env db build migrate seed start restart stop logs deploy pull

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

setup:
	sudo apt update && sudo apt install -y docker.io docker-compose-v2 nginx certbot python3-certbot-nginx git
	sudo usermod -aG docker ubuntu

env:
	cp -n .env.production.example $(ENV_FILE)
	@echo "Edit $(ENV_FILE) with your values"

db:
	docker compose --env-file $(ENV_FILE) up -d db

pull:
	docker compose --env-file $(ENV_FILE) pull app

migrate:
	docker compose --env-file $(ENV_FILE) run --rm app npx prisma generate
	docker compose --env-file $(ENV_FILE) run --rm app npx prisma db push

seed:
	docker compose --env-file $(ENV_FILE) run --rm app npx prisma db seed

start:
	@echo "Starting app..."
	docker compose --env-file $(ENV_FILE) up -d app

restart:
	@echo "Updating app with zero downtime..."
	docker compose --env-file $(ENV_FILE) up -d --no-deps --scale app=2 --no-recreate app
	@sleep 10
	@docker compose --env-file $(ENV_FILE) ps --filter "status=running" --format "{{.Names}}" | grep -q "deeray.*app" || (echo "Rollback" && docker compose --env-file $(ENV_FILE) up -d --no-deps --scale app=1 app)

stop:
	docker compose down

logs:
	docker compose logs -f app

deploy: git_pull pull migrate start

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
