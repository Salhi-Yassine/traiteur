# Progress Tracking Workflow

## Three files, three purposes

| File | Purpose | Rule |
|------|---------|------|
| `DONE.md` | Permanent log of completed work | Append-only — never edit past entries |
| `TODO.md` | Live prioritized backlog | Reorder freely, remove when done |
| `DECISIONS.md` | Architectural & design choices | Add when a non-obvious decision is made |

---

## After every work session — checklist

### 1. DONE.md — append completed items
```markdown
## 2026-04-10
- [2026-04-10] Fixed duplicate amenities array in vendor profile page
- [2026-04-10] Added Monday-first week to AvailabilityCalendar (Morocco locale)
```
- Use today's date
- One line per logical unit of work
- Be specific enough that future-Claude understands what was done without reading the code

### 2. TODO.md — remove completed items
Delete the lines that are now in DONE.md.
Add any newly discovered tasks to the appropriate section.
Keep the list ordered: highest priority at the top.

### 3. DECISIONS.md — record architectural choices
Only when a non-obvious decision was made:
- Tech choice (library A over library B)
- Design pattern (why this approach, not another)
- Scope decision (what was deliberately left out)

Format:
```markdown
### Decision title
**Decision:** What was decided.
**Why:** The reasoning.
**Trade-off:** What was accepted/sacrificed.
```

---

## What counts as "done"
- Works end-to-end (API + UI if applicable)
- No known regressions
- i18n keys added for all new strings
- Storybook story exists for new components

## Never skip this step
Stale tracking files cause Claude to re-do work or miss what's already implemented.
If a session ends without updating these files, start the next session by updating them first.
