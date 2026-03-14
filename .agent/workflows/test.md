---
description: Run all tests across the stack (API + PWA)
---

# Testing Workflow

// turbo
1. Run all PHP/Symfony PHPUnit tests:
```bash
make test
```

2. Run a specific PHPUnit test by filter (replace `<FilterName>`):
```bash
make test c="--filter <FilterName>"
```

// turbo
3. Verify Symfony Messenger transports are properly configured:
```bash
make ms-test
```

4. Run PWA lint checks (from the project root):
```bash
docker compose exec php sh -c "cd /app/pwa && pnpm lint"
```
