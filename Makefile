# Executables (local)
DOCKER_COMP = docker compose

# Docker containers
PHP_CONT = $(DOCKER_COMP) exec php

# Executables
PHP      = $(PHP_CONT) php
COMPOSER = $(PHP_CONT) composer
SYMFONY  = $(PHP) bin/console

# Executables: vendors
PHP_CS_FIXER  = $(PHP_CONT) ./vendor/bin/php-cs-fixer
PHPSTAN       = $(PHP_CONT) ./vendor/bin/phpstan

# Misc
.DEFAULT_GOAL = help

## —— 🎵 🐳 The Symfony Docker Makefile 🐳 🎵 ————————————————————————————————————————————————————————————
.PHONY: help

help: ##  🆘 Outputs this help screen
	@grep -E '(^[a-zA-Z0-9\./_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

## —————— 🐳 Docker —————————————————————————————————————————————————————————————————————
.PHONY: build up start sh bash stop down logs test chown

build: ## 🏗️ Builds the Docker images
	@$(DOCKER_COMP) build --pull --no-cache

up: ## 🚀 Start the project in detached mode (no logs)
	@$(DOCKER_COMP) up -d

start: build up ## 🏗️ 🚀 Build and start the containers

sh: ## 📟 Log to the PHP docker container
	@$(PHP_CONT) sh

bash: ## 📟 Log to the docker container
	@$(PHP_CONT) bash

stop: ## 🛑 Stop the project
	$(DOCKER_COMP) stop

down: ## 🗑️ Stop and remove containers, networks
	@$(DOCKER_COMP) down --remove-orphans

logs: ## 📜 Show live logs
	@$(DOCKER_COMP) logs --tail=0 --follow


# for more info see https://github.com/dunglas/symfony-docker/blob/main/docs/troubleshooting.md
chown: ## ©️ set yourself as owner of the project files that were created by the docker container
	@$(DOCKER_COMP) run --rm php chown -R $(shell id -u)\:$(shell id -g) .

## —————— 🧙‍♀️Composer —————————————————————————————————————————————————————————————————————
.PHONY: cmp cmp-req cmp-up cmp-ins

cmp: ## Run composer, example: make composer c='req symfony/orm-pack'
	@$(eval c ?=)
	@$(COMPOSER) $(c)

cmp-req: ## 📥 Run composer require, example: make cmp-req c=twig
	@$(MAKE) cmp c="require $(c)"


# Update composer.lock based on changes in composer.json
cmp-up: composer.lock ## 🔃 Update project dependencies

composer.lock: composer.json
	$(COMPOSER) update

# Install vendors according to the current composer.lock file
cmp-ins: vendor ## 📥 Install vendors according to the current composer.lock file

vendor: composer.lock
	@$(MAKE) cmp c=install --prefer-dist --no-dev --no-progress --no-scripts --no-interaction

## —————— 🎵 Symfony —————————————————————————————————————————————————————————————————————
.PHONY: sf cc ccf rm-log

sf: ## List all Symfony commands, example: make sf c=about
	@$(eval c ?=)
	@$(SYMFONY) $(c)

cc: c=c:c ## 🧹 Clear the cache
cc: sf

ccf: c=c:c --no-warmup ## 🧼🧹 Clear Symfony cache (force)
ccf: sf

rm-log: ## 🗑️ remove log files
	@find var/log -name '*.log' -type f -delete

## —————— 🗃️ Database —————————————————————————————————————————————————————————————————————
.PHONY: full-migrat make-migrat remove-migration-files migrate migrate-diff

full-migrat: make-migrat migrate remove-migration-files ## 🎫🛫🗑️ make migration and migrate

make-migrat: c=make:migration --no-interaction ## 🎫 make migration
make-migrat: sf

remove-migration-files: ## 🗑️ remove migration
	@find migrations -name 'Version*.php' -type f -delete

migrate: ## 🛫 Run database migrations
	$(SYMFONY) doctrine:migrations:migrate --no-interaction

# Generate and view a Doctrine migration diff
migrate-diff: ## 🟰 Generate and view a Doctrine migration diff
	$(SYMFONY) doctrine:migrations:diff
## —————— ✅ Tests —————————————————————————————————————————————————————————————————————
.PHONY: test

test: ## 🧪 Start tests with phpunit, pass the parameter "c=" to add options to phpunit, example: make test c="--group e2e --stop-on-failure"
	@$(eval c ?=)
	@$(DOCKER_COMP) exec -e APP_ENV=test php bin/phpunit $(c)

## —————— ✨ Coding standards ——————————————————————————————————————————————————————
.PHONY: fix-php stan cs

fix-php: ## ⚒️Fix files with php-cs-fixer
	@$(eval c ?=)
	@$(PHP_CS_FIXER) $(c)

stan: ## 🛠️Run PHPStan
	@$(eval c ?=)
	@$(PHPSTAN) $(c)

cs: fix-php stan ## Run all coding standards checks

## —— 🎵 🐳 The Symfony Docker Makefile 🐳 🎵 ————————————————————————————————————————————————————————————