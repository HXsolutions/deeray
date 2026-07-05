ENV_FILE := $(or $(filter-out $@,$(MAKECMDGOALS)),.env.production)

.PHONY: help setup db migrate seed build start restart logs deploy

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

setup: ## First-time server setup (run once)
	sudo apt update && sudo apt install -y docker.io docker-compose-v2 nginx certbot python3-certbot-nginx git nodejs npm
	sudo usermod -aG docker ubuntu
	sudo npm install -g pm2

db: ## Start PostgreSQL
	docker compose --env-file $(ENV_FILE) up -d db

migrate: ## Run database migrations
	docker compose --env-file $(ENV_FILE) run --rm migrate

seed: ## Seed admin user
	docker compose --env-file $(ENV_FILE) exec app npx prisma db seed

build: ## Build the app (Docker)
	docker compose --env-file $(ENV_FILE) build app

start: ## Start the app
	docker compose --env-file $(ENV_FILE) up -d app

restart: ## Restart the app
	docker compose --env-file $(ENV_FILE) up -d app

stop: ## Stop everything
	docker compose down

logs: ## View app logs
	docker compose logs -f app

deploy: git_pull build migrate restart ## Full deploy: pull + build + migrate + restart

git_pull: ## Pull latest code from git
	git pull origin main

nginx: ## Setup nginx + SSL
	DOMAIN=$(DOMAIN) sudo cp deploy/nginx.conf /etc/nginx/sites-available/deeray
	DOMAIN=$(DOMAIN) sudo sed -i "s/yourdomain.com/$$DOMAIN/g" /etc/nginx/sites-available/deeray
	DOMAIN=$(DOMAIN) sudo sed -i "s/www.yourdomain.com/www.$$DOMAIN/g" /etc/nginx/sites-available/deeray
	sudo ln -sf /etc/nginx/sites-available/deeray /etc/nginx/sites-enabled/
	sudo rm -f /etc/nginx/sites-enabled/default
	sudo nginx -t && sudo systemctl reload nginx

ssl: ## Get SSL certificate
	sudo certbot --nginx -d $(DOMAIN) -d www.$(DOMAIN) --non-interactive --agree-tos -m admin@$(DOMAIN)

env: ## Create .env.production from example
	cp .env.production.example $(ENV_FILE)
	@echo "Edit $(ENV_FILE) with your values"

dev: ## Start local dev server
	npm run dev

# Prevent make from interpreting domain args as targets
%:
	@:
