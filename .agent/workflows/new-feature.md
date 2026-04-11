# New Feature Workflow

End-to-end sequence from backlog item to closed GitHub issue. Follow this every time.

---

## Step 1 — Claim the issue

```bash
# Find open issues
gh issue list --repo Salhi-Yassine/traiteur --state open

# Mark it in-progress
gh issue edit <number> --add-label "in-progress"
```

If no issue exists for the work, create one first:
```bash
gh issue create \
  --title "Short imperative title" \
  --label "phase:1,frontend" \
  --body "## Acceptance criteria\n- [ ] ..."
```

**No issue = no work.**

---

## Step 2 — Identify scope

Answer these before writing any code:

| Question | Answer → |
|---|---|
| Backend only? | Use Recipe 3 from `FeatureRecipes` skill |
| Frontend only? | Use Recipe 1 (component) or Recipe 2 (page) from `FeatureRecipes` skill |
| Full-stack? | Both — always implement **backend first** |
| New entity? | Entity → Voter → Factory → `make full-migrat` → `make cs` |
| New page? | Decide fetch strategy: `getStaticProps` / `getServerSideProps` / client-only |
| New component? | Plan the Props interface and translation keys before touching code |

Plan translation key names using `.agent/rules/naming-conventions.md` before writing a single string.

---

## Step 3 — Implementation order

**For full-stack features — always backend first:**

1. Entity + migration (`make full-migrat`)
2. Voter (if ownership rules apply)
3. Verify routes: `make sf c="debug:router"`
4. Smoke test new endpoint with curl or PHPUnit
5. Frontend page / component
6. TanStack Query data fetching (see `.agent/rules/data-fetching.md`)
7. Error handling (see `.agent/rules/error-handling.md`)
8. Translation keys — all 4 locales
9. Storybook story (see `StorybookSpec` skill)

**For frontend-only features:**

1. Translation keys — plan and add to all 4 locale files first
2. Component / page implementation
3. Storybook story

---

## Step 4 — Self-review

Before marking anything done, run the full checklist in `.agent/rules/definition-of-done.md`.

If an item can't be checked, note it explicitly in the GitHub issue comment.

---

## Step 5 — Quality gates

Both must pass before closing the issue:

```bash
make cs                      # PHP-CS-Fixer + PHPStan
make pnpm c="lint"           # Next.js ESLint
```

---

## Step 6 — Close out

```bash
# Close the issue
gh issue close <number> --comment "Implemented: <one-line description> — closes #<number>"

# Remove the in-progress label (GitHub auto-closes it, but clean up manually if needed)
gh issue edit <number> --remove-label "in-progress"
```

Then update the tracking files:
1. Append completed work to `.agent/docs/DONE.md` with today's date
2. Remove the item from `.agent/docs/TODO.md`
3. If an architectural decision was made: record it in `.agent/docs/DECISIONS.md`

---

## Reference

| Topic | File |
|---|---|
| Translation key naming | `.agent/rules/naming-conventions.md` |
| No hardcoded strings | `.agent/rules/no-hardcoded-strings.md` |
| Data fetching patterns | `.agent/rules/data-fetching.md` |
| Error handling patterns | `.agent/rules/error-handling.md` |
| Component / page / endpoint templates | `.agent/skills/FeatureRecipes/SKILL.md` |
| Story format | `.agent/skills/StorybookSpec/SKILL.md` |
| Entity anatomy | `.agent/rules/symfony-entity-anatomy.md` |
| Done checklist | `.agent/rules/definition-of-done.md` |
