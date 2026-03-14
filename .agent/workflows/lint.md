---
description: Run code quality checks and static analysis
---

# Code Quality Workflow

// turbo
1. Auto-fix PHP code style with PHP-CS-Fixer:
```bash
make fix-php
```

// turbo
2. Dry-run PHP-CS-Fixer to check for violations without modifying files:
```bash
make lint-php
```

// turbo
3. Run PHPStan static analysis:
```bash
make stan
```

// turbo
4. Run the full code quality suite (fix + stan):
```bash
make cs
```

5. Run PWA ESLint:
```bash
docker compose exec php sh -c "cd /app/pwa && pnpm lint"
```
