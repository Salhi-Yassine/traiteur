# Docker Usage Rules

To maintain environment consistency and avoid issues with missing local dependencies, all development commands must be executed within Docker containers.

## Rules for Agents

1. **Host Isolation**: Never execute `php`, `composer`, `node`, `npm`, `npx`, or `pnpm` directly on the host machine.
2. **Preferred Interface**: Always check the `Makefile` first for a corresponding target.
3. **Manual Execution**: If no `Makefile` target exists, use `docker compose exec`:
    - Use `docker compose exec php ...` for PHP/Symfony/Composer commands.
    - Use `docker compose exec pwa ...` for Node/NPM/Next.js commands.
4. **Service Context**: Always ensure you are targeting the correct service (`php` or `pwa`).
5. **Permissions**: If files created inside the container are owned by root, use `make chown` to fix host permissions.

## Prohibited Actions

- ❌ Running `npm install` on the host.
- ❌ Running `composer install` on the host.
- ❌ Running `bin/console` on the host.
- ❌ Installing tools like `php` or `nodejs` on the host system via `apt` or similar during tasks.
