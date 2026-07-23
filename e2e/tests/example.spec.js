// @ts-check
const { test, expect } = require('@playwright/test');

// Smoke tests — verify the stack boots and serves the real app.
// Deeper user-journey specs (directory search, RSVP flow, onboarding)
// are tracked in .agent/docs/TODO.md.

test('homepage serves the PWA', async ({ page }) => {
  // First hit compiles the page in the Next.js dev server — allow extra time
  test.setTimeout(120_000);
  await page.goto('https://localhost/', { timeout: 90_000 });
  await expect(page).toHaveTitle(/Farah\.ma/);
});

test('API entrypoint responds', async ({ request }) => {
  const res = await request.get('https://localhost/api', {
    headers: { Accept: 'application/ld+json' },
  });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body['@context']).toBeDefined();
});

test('vendor directory lists vendors from the API', async ({ request }) => {
  const res = await request.get('https://localhost/api/vendor_profiles', {
    headers: { Accept: 'application/ld+json' },
  });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(Array.isArray(body['member'] ?? body['hydra:member'])).toBeTruthy();
});
