# GitHub Projects Workflow

## Setup (already done)

| Resource | URL |
|----------|-----|
| Project board | https://github.com/users/Salhi-Yassine/projects/1 |
| Issues | https://github.com/Salhi-Yassine/traiteur/issues |
| Milestones | https://github.com/Salhi-Yassine/traiteur/milestones |

**Labels:** `phase:1` `phase:2` `phase:3` `phase:4` `frontend` `backend` `design` `i18n` `bug` `blocked`

**Milestones:**
- Milestone 1 → Phase 1 — Foundation
- Milestone 2 → Phase 2 — Planning Tools
- Milestone 3 → Phase 3 — Content & Monetization
- Milestone 4 → Phase 4 — Pre-Launch

---

## Session workflow

### Starting work on a task
The user names what they want to work on. Claude finds the matching issue and marks it in progress:
```bash
gh issue list --repo Salhi-Yassine/traiteur --state open --label "phase:1"
gh issue edit <number> --repo Salhi-Yassine/traiteur --add-label "in-progress"
```

### Finishing a task
When the feature is done and working:
```bash
# Close the issue
gh issue close <number> --repo Salhi-Yassine/traiteur --comment "Implemented in <commit or description>"

# Then update DONE.md and TODO.md per the progress-tracking workflow
```

### Creating a new issue (discovered during session)
```bash
gh issue create --repo Salhi-Yassine/traiteur \
  --title "Short descriptive title" \
  --label "phase:1,frontend" \
  --milestone "Phase 1 — Foundation" \
  --body "## Acceptance criteria\n- [ ] ..."
```

### Checking what's open in a phase
```bash
gh issue list --repo Salhi-Yassine/traiteur --state open --milestone "Phase 1 — Foundation"
```

### Checking all open issues
```bash
gh issue list --repo Salhi-Yassine/traiteur --state open
```

---

## Issue format

Every issue should have:
- **Title:** short, action-oriented (`"Vendor Directory: price range filter"`)
- **Label:** at least one phase label + one domain label
- **Milestone:** the phase it belongs to
- **Body:** acceptance criteria as a checklist

```markdown
## User Story (optional)
As [persona], I want [goal] so that [reason].

## Acceptance criteria
- [ ] Specific, testable condition
- [ ] Another condition
```

---

## Board columns

On the GitHub Projects board, use these columns:
- **Backlog** — all open issues not yet started
- **In Progress** — currently being worked on (max 2–3 at a time)
- **In Review** — PR open, waiting for check
- **Done** — issue closed

Issues move automatically to Done when closed via `gh issue close`.

---

## Linking commits to issues

In commit messages, reference the issue number:
```
feat: add price range filter to vendor directory

Closes #8
```

GitHub will automatically close the issue and move it to Done when the commit lands on main.

---

## Rule

Every meaningful unit of work must have a GitHub issue before coding starts.
No issue = no work. This keeps the board accurate and the backlog honest.
