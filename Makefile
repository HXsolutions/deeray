ENV_FILE = .env.production

.PHONY: help setup env db pull migrate seed stop logs deploy

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

stop:
	docker compose down

logs:
	docker compose logs -f app

deploy: git_pull pull migrate switch

git_pull:
	git pull origin main

switch:
	@echo "--- Starting new version ---"
	-docker compose --env-file $(ENV_FILE) up -d app
	@sleep 15
	@if curl -sf http://localhost:3000/api/health >/dev/null 2>&1; then \
		echo "Done."; \
	else \
		echo "Failed — rolling back..."; \
		git checkout HEAD~1 -- Dockerfile docker-compose.yml Makefile deploy/ src/ prisma/ package.json; \
		docker compose --env-file $(ENV_FILE) build app; \
		docker compose --env-file $(ENV_FILE) up -d app; \
		git checkout main; \
	fi

nginx:
	sudo cp deploy/nginx.conf /etc/nginx/sites-available/deeray
	sudo ln -sf /etc/nginx/sites-available/deeray /etc/nginx/sites-enabled/
	sudo rm -f /etc/nginx/sites-enabled/default
	sudo nginx -t && sudo systemctl reload nginx

ssl:
	sudo certbot --nginx -d $(DOMAIN) -d www.$(DOMAIN) --non-interactive --agree-tos -m admin@$(DOMAIN)
