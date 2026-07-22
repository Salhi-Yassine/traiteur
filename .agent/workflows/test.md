---
description: Testing standards and workflow for frontend (Vitest) and backend (PHPUnit)
---

# Testing Workflow

## Commands

```bash
# Frontend — run all Vitest tests (CI mode)
make pnpm c="test"

# Frontend — watch mode during development
make pnpm c="test:watch"

# Frontend — run a single file
make pnpm c="test components/vendors/VendorCard.test.tsx"

# Backend — run all PHPUnit tests
make test

# Backend — run a specific test class or method
make test c="--filter VendorProfileTest"
make test c="--filter VendorProfileTest::testOwnerCanEdit"
```

---

## Test types

### Frontend (Vitest + React Testing Library)

#### 1. Unit tests — pure logic, no DOM
Target: Zod schemas, utility functions, custom hooks (via `renderHook`), `apiClient`

```ts
// lib/useVendorFilters.test.ts
import { renderHook, act } from '@testing-library/react';
import { useVendorFilters } from './useVendorFilters';

it('adds and removes a city filter', () => {
  const { result } = renderHook(() => useVendorFilters());
  act(() => result.current.toggleCity('casablanca'));
  expect(result.current.filters.cities).toContain('casablanca');
  act(() => result.current.toggleCity('casablanca'));
  expect(result.current.filters.cities).not.toContain('casablanca');
});
```

#### 2. Component tests — render + user interaction
Target: components with conditional rendering, multi-step flows, or form submission logic.
Skip pure display components — those are covered visually by Storybook.

```tsx
// components/guest/RSVPFlow.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import RSVPFlow from './RSVPFlow';

it('advances to step 2 on confirm', () => {
  render(<RSVPFlow guest={mockGuest} />);
  fireEvent.click(screen.getByRole('button', { name: /confirmer/i }));
  expect(screen.getByText(/préférences repas/i)).toBeInTheDocument();
});
```

#### 3. Schema validation tests
Target: every Zod schema used in a form.

```ts
// pages/auth/login.schema.test.ts
import { loginSchema } from './login';

it('rejects missing email', () => {
  const result = loginSchema.safeParse({ email: '', password: 'abc123' });
  expect(result.success).toBe(false);
  expect(result.error?.issues[0].path).toContain('email');
});
```

---

### Backend (PHPUnit)

#### 1. API integration tests — extend `ApiTestCase`
One class per entity. Tests full HTTP round-trips against a real test database.

```php
// tests/Api/VendorProfileTest.php
class VendorProfileTest extends ApiTestCase
{
    public function testOwnerCanEdit(): void { ... }
    public function testNonOwnerIsForbidden(): void { ... }
    public function testGuestCannotCreate(): void { ... }
}
```

Cover for every resource:
- POST: creates correctly, returns 201
- GET collection: returns `hydra:member` array
- GET item: returns correct shape
- PATCH: owner succeeds (200), non-owner gets 403
- DELETE: owner succeeds, voter blocks others

#### 2. Unit tests — extend `TestCase`
Target: Services and Voters in isolation (no HTTP, no DB).

```php
// tests/Service/ReviewAggregationServiceTest.php
// tests/Voter/VendorProfileVoterTest.php
```

---

## File locations

### Frontend — co-locate beside the file under test

```
pwa/
├── components/vendors/
│   ├── VendorCard.tsx
│   ├── VendorCard.stories.tsx
│   └── VendorCard.test.tsx       ← co-located
├── lib/
│   ├── useVendorFilters.ts
│   └── useVendorFilters.test.ts  ← co-located
├── utils/
│   └── apiClient.ts
└── tests/
    └── apiClient.test.ts         ← existing, kept here
```

Vitest is configured to pick up `*.test.{ts,tsx}` from:
`components/`, `pages/`, `lib/`, `utils/`, `context/`, `tests/`

### Backend — mirror source under `api/tests/`

```
api/src/Service/ReviewAggregationService.php
api/tests/Service/ReviewAggregationServiceTest.php

api/src/Voter/VendorProfileVoter.php
api/tests/Voter/VendorProfileVoterTest.php

api/src/Entity/VendorProfile.php
api/tests/Api/VendorProfileTest.php
```

---

## What we test (priority order)

| Priority | Target | Type |
|----------|--------|------|
| 1 | Zod schemas (login, register, quote modal) | Schema unit |
| 2 | `useVendorFilters` state machine | Hook unit |
| 3 | `AuthContext` — login / logout / forced-logout | Hook + component |
| 4 | `fetchServerSide` error branches | Unit |
| 5 | `RSVPFlow` step transitions | Component |
| 6 | `VendorProfileVoter` / `QuoteRequestVoter` | PHP unit |
| 7 | `VendorProfile` API CRUD + security | PHP API integration |

## What we don't test

- shadcn/ui primitives — tested by the library
- Static/display-only components — covered by Storybook
- Storybook stories themselves
- API response shapes on the frontend — covered by TypeScript types

---

## Rules

- A new component with logic or a new custom hook **requires** a test file in the same commit
- No `any` in test assertions — use proper types or `as ConcreteType`
- Mock at the boundary (`vi.stubGlobal('fetch', ...)`) — never mock internal modules
- Backend: use `ApiTestCase` for endpoint tests; never use `doctrine:schema:update --force` in test setup — fixtures handle seeding
- Keep each test focused: one behaviour per `it()` block
