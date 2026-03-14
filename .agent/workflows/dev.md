---
description: Start the development environment and common daily tasks
---

# Development Workflow

// turbo
1. Start all Docker containers:
```bash
make up
```

// turbo
2. Clear the Symfony cache:
```bash
make cc
```

3. Tail live logs from all containers:
```bash
make logs
```

4. Open a shell inside the PHP container (for manual commands):
```bash
make bash
```

5. Run a Symfony console command (replace `<cmd>` with the desired command):
```bash
make sf c="<cmd>"
```

6. After modifying Doctrine entities, run a full migration cycle:
```bash
make full-migrat
```
