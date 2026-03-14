---
description: Full project setup from scratch
---

# Project Setup Workflow

// turbo
1. Build Docker images (no cache):
```bash
make build
```

// turbo
2. Start Docker containers in detached mode:
```bash
make up
```

// turbo
3. Install Composer dependencies:
```bash
make cmp-ins
```

4. Install PWA dependencies (run from the project root):
```bash
docker compose exec php sh -c "cd /app/pwa && pnpm install"
```

// turbo
5. Run database migrations:
```bash
make migrate
```

// turbo
6. Generate JWT key pair:
```bash
make jwt
```

7. Verify the DB connection is healthy:
```bash
make db-test
```
