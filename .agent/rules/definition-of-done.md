# Definition of Done

Run this checklist before appending anything to `DONE.md`. Every item must be checked. If something can't be checked, note it explicitly (e.g. `ar/ary translations pending #47`) — do not silently skip.

---

## Backend changes (if any)

- [ ] Every property on the entity has an explicit `#[Groups([...])]` annotation — no field is accidentally exposed or hidden
- [ ] All `#[ApiResource]` operations have a `security:` expression (`new Get()` without security is only acceptable for truly public data)
- [ ] Migration created **and** run: `make full-migrat`
- [ ] PHPStan passes: `make stan`
- [ ] PHP-CS-Fixer clean: `make fix-php`
- [ ] At least one PHPUnit test or manual curl verification of the new operation

---

## Frontend changes (if any)

- [ ] No hardcoded strings — every DOM-visible string uses `t()` (see `.agent/rules/no-hardcoded-strings.md`)
- [ ] Translation keys added in **all 4** locale files: `fr` (full text) + `ar`, `ary`, `en` (can be placeholder)
- [ ] All data fetching uses TanStack Query — no `useEffect + fetch` or `useEffect + apiClient`
- [ ] All forms use Formik + Yup with a validation schema
- [ ] Every new component in `components/ui/` or `components/<domain>/` has a co-located `.stories.tsx` file
- [ ] RTL-safe layout: only `start-*`, `end-*`, `ps-*`, `pe-*`, `ms-*`, `me-*` — no `left-*` / `right-*`
- [ ] Mobile layout looks correct at 390px width
- [ ] ESLint clean: `make pnpm c="lint"`

---

## Both

- [ ] Feature works end-to-end in the running Docker stack (`make up`)
- [ ] No regressions on adjacent features (quick smoke test)
- [ ] GitHub issue closed: `gh issue close <number> --comment "Implemented: <short description>"`
- [ ] `DONE.md` updated with today's date (append only)
- [ ] Completed item removed from `TODO.md`
- [ ] If an architectural decision was made: recorded in `DECISIONS.md`

---

## Partial done format

When you cannot complete all boxes in one session, record it explicitly:

```markdown
## 2026-04-11
- [2026-04-11] Vendor price filter (PARTIAL) — ar/ary translations pending, tracked in #47
```

Never silently append to DONE.md if the feature is broken or has known open items that aren't tracked.
