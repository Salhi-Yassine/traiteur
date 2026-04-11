# No Hardcoded Strings

Every string that reaches the DOM **must** come from `t()`. No exceptions for "temporary" or "obvious" labels.

## What counts as a hardcoded string

Catch all of these before committing:

```tsx
// ✗ JSX text node
<p>Prestataires</p>

// ✗ String in JSX expression
<h1>{"Trouver un prestataire"}</h1>

// ✗ Template literal in JSX
<title>{`Farah.ma - ${name}`}</title>

// ✗ aria-label
<button aria-label="Fermer">

// ✗ placeholder
<input placeholder="Rechercher..." />

// ✗ alt text
<Image alt="Photo de mariage" />

// ✗ title attribute
<div title="Prestataire vérifié">
```

## Correct pattern

```tsx
const { t } = useTranslation('common');

<p>{t('nav.vendors')}</p>
<title>{t('page.meta_title', { name })}</title>
<button aria-label={t('common.close')}>
<input placeholder={t('search_bar.placeholder')} />
<Image alt={businessName} />  {/* use a variable, not a literal */}
```

## How to add a new string

1. Choose a key following `.agent/rules/naming-conventions.md`
2. Add the French text to `pwa/public/locales/fr/common.json` first
3. Add entries in `ar/common.json`, `ary/common.json`, `en/common.json` — placeholder value = same as French is acceptable for now
4. Use `t('your.key')` in the component
5. Never commit with a missing locale entry (all 4 files must have the key)

## Exceptions — these do NOT need t()

- `console.error()` / `console.log()` messages — developer-facing, English is fine
- `className` values — not user-visible
- `href`, `src`, `data-*` attribute values
- `queryKey` arrays in TanStack Query
- Internal constants and enum-like values in PHP/TS

## Quick grep to catch violations before committing

```bash
# Find JSX text nodes that look like French strings
grep -r ">[A-ZÀÂÇÉÈÊËÎÏÔÙÛÜ]" pwa/pages pwa/components --include="*.tsx" -l

# Find hardcoded placeholders
grep -r 'placeholder="' pwa/pages pwa/components --include="*.tsx"

# Find hardcoded aria-labels
grep -r 'aria-label="' pwa/pages pwa/components --include="*.tsx"
```
