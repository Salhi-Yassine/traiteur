# 🌐 GLOBAL CONFIG

DOCKER_COMPOSE = docker compose
PROJECT_PHP    = php        # Service name for Symfony
PROJECT_PWA    = pwa        # Service name for Next.js
PROJECT_DIR    = api        # Symfony project directory
EXEC_PHP       = $(DOCKER_COMPOSE) exec $(PROJECT_PHP)
EXEC_PWA       = $(DOCKER_COMPOSE) exec $(PROJECT_PWA)

PHP            = $(EXEC_PHP) php
CONSOLE        = $(EXEC_PHP) bin/console
SYMFONY        = $(CONSOLE)
COMPOSER       = $(EXEC_PHP) composer

PHP_CS_FIXER   = $(EXEC_PHP) vendor/bin/php-cs-fixer
PHPSTAN        = $(EXEC_PHP) vendor/bin/phpstan

.DEFAULT_GOAL := help

# � HELP

.PHONY: help
help:
	@grep -E '(^[a-zA-Z0-9\./_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) \
	 | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-28s\033[0m %s\n", $$1, $$2}' \
	 | sed -e 's/\[32m##/[33m/'

##############################################
## 🐳 DOCKER COMMANDS
##############################################
.PHONY: build up start sh bash stop down logs chown

build: ## 🛠️ Build Docker images (no cache)
	$(DOCKER_COMPOSE) build --pull --no-cache

up: ## 🚀 Start containers (detached)
	$(DOCKER_COMPOSE) up -d

start: build up ## 🛠️🚀 Build and start

sh: ## � Open sh shell inside container
	$(EXEC_PHP) sh

bash: ## � Open bash shell inside container
	$(EXEC_PHP) bash

stop: ## 🛑 Stop containers
	$(DOCKER_COMPOSE) stop

down: ## 🗑️ Remove containers + networks
	$(DOCKER_COMPOSE) down --remove-orphans

logs: ## 📜 View live logs
	$(DOCKER_COMPOSE) logs --tail=0 --follow

chown: ## 👤 Fix file permissions (host user)
	$(DOCKER_COMPOSE) run --rm $(PROJECT_PHP) chown -R $$(id -u):$$(id -g) .

pwa-sh: ## 🌐 Open sh shell inside PWA container
	$(EXEC_PWA) sh

##############################################
## 🎵 SYMFONY COMMANDS
##############################################
.PHONY: sf cc ccf rm-log jwt session

php: ## 🐘 Run PHP: make php c="-v"
	@$(eval c ?=)
	$(PHP) $(c)

console: ## 🎛️ Run Symfony console: make console c="about"
	@$(eval c ?=)
	$(CONSOLE) $(c)

sf: console ## 🎛️ Alias for console

cc: ## 🧹 Clear cache
	$(CONSOLE) cache:clear

ccf: ## 🧼 Clear cache (force, no warmup)
	$(CONSOLE) cache:clear --no-warmup

rm-log: ## �️ Remove log files
	@find $(PROJECT_DIR)/var/log -name '*.log' -type f -delete

jwt: ## 🔐 Generate JWT keys
	$(CONSOLE) lexik:jwt:generate-keypair --overwrite

session: ## ⚙️ Create application sessions
	$(CONSOLE) app:create-sessions

##############################################
## 🗃️ DATABASE & MIGRATIONS
##############################################
.PHONY: full-migrat make-migrat remove-migration-files migrate migrate-diff db-test

full-migrat: make-migrat migrate remove-migration-files ## ��🛫🗑️ Full migration cycle

make-migrat: ## 📜 Create a migration
	$(CONSOLE) make:migration --no-interaction

remove-migration-files: ## 🗑️ Delete migration files
	@find $(PROJECT_DIR)/migrations -maxdepth 1 -name 'Version[0-9]*.php' -type f -delete

migrate: ## 🛫 Run database migrations
	$(CONSOLE) doctrine:migrations:migrate --no-interaction

migrate-diff: ## � Generate migration diff
	$(CONSOLE) doctrine:migrations:diff

db-test: ## ✅ Test DB connection
	$(CONSOLE) dbal:run-sql -q "SELECT 1" && echo "✅ DB OK" || echo "❌ DB FAILED"

##############################################
## 🧪 TESTING
##############################################
.PHONY: test ms-test

test: ## 🧪 Run PHPUnit tests (make test c="--filter Order")
	@$(eval c ?=)
	$(DOCKER_COMPOSE) exec -e APP_ENV=test $(PROJECT) bin/phpunit $(c)

ms-test: ## 📡 Test Messenger transports
	$(CONSOLE) messenger:setup-transports -vv

##############################################
## 📦 COMPOSER
##############################################
.PHONY: cmp cmp-req cmp-up cmp-ins

cmp: ## 📦 Run composer directly: make cmp c="require twig"
	@$(eval c ?=)
	$(COMPOSER) $(c)

cmp-req: ## ➕ Composer require: make cmp-req c=twig
	$(MAKE) cmp c="require $(c)"

cmp-up: ## ⬆️ Update dependencies
	$(COMPOSER) update

cmp-ins: ## ⬇️ Install dependencies
	$(COMPOSER) install --prefer-dist --no-scripts --no-progress --no-interaction

##############################################
## ✨ CODING STANDARDS & STATIC ANALYSIS
##############################################
.PHONY: fix-php lint-php stan cs

fix-php: ## 🛠️ Fix code with PHP-CS-Fixer
	$(PHP_CS_FIXER) fix --allow-risky=yes

lint-php: ## 🧹 Lint PHP files (dry run)
	$(PHP_CS_FIXER) fix --dry-run --allow-risky=yes

stan: ##  Run PHPStan static analysis
	$(PHPSTAN) analyse --memory-limit 1G

cs: fix-php stan ## ✨ Run complete code quality suite

##############################################
## 🌐 PWA & NPM COMMANDS
##############################################
.PHONY: npm npx pnpm node

npm: ## 📦 Run npm: make npm c="install"
	@$(eval c ?=)
	$(EXEC_PWA) npm $(c)

npx: ## 🚀 Run npx: make npx c="next build"
	@$(eval c ?=)
	$(EXEC_PWA) npx $(c)

pnpm: ## 📦 Run pnpm: make pnpm c="install"
	@$(eval c ?=)
	$(EXEC_PWA) pnpm $(c)

node: ## 🟢 Run node: make node c="-v"
	@$(eval c ?=)
	$(EXEC_PWA) node $(c)

##############################################
## 📚 STORYBOOK (dev-only)
##############################################
.PHONY: storybook build-storybook

storybook: ## 📚 Start Storybook dev server (port 6006)
	$(EXEC_PWA) pnpm storybook

build-storybook: ## 📚 Build static Storybook site
	$(EXEC_PWA) pnpm build-storybook