# Data Fetching

## Decision tree

```
Is data fetched at request time for a public/SEO page?
  → YES → getServerSideProps (or getStaticProps with revalidate)
         → fetch() directly, NOT fetchApi (no browser/localStorage on server)

Is data needed after the page loads (user-specific, interactive, real-time)?
  → YES → TanStack Query (useQuery / useMutation)
         → ALWAYS use fetchApi() from pwa/utils/apiClient.ts

NEVER: useEffect + fetch / useEffect + apiClient.get  ← this pattern is banned
```

**Known violation to fix:** `pwa/pages/planning/budget.tsx` uses `useEffect + apiClient.get` — convert to `useQuery`.

---

## Server-side fetching (getServerSideProps)

Pattern derived from `pwa/pages/vendors/index.tsx`:

```ts
export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  try {
    const params = new URLSearchParams({ page: String(Number(query.page) || 1) });
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost';

    const res = await fetch(`${baseUrl}/api/vendor_profiles?${params}`, {
      headers: {
        Accept: 'application/ld+json',
        'Accept-Language': locale || 'fr',   // drives Gedmo Translatable on the API
      },
    });

    if (!res.ok) throw new Error('API unavailable');
    const data = await res.json();

    const items = data['hydra:member'] ?? [];       // always hydra:member for collections
    const total: number = data['hydra:totalItems'] ?? 0;

    return {
      props: {
        items,
        total,
        ...(await serverSideTranslations(locale || 'fr', ['common'])),
      },
    };
  } catch {
    return {
      props: {
        items: [],
        total: 0,
        ...(await serverSideTranslations(locale || 'fr', ['common'])),
      },
    };
  }
};
```

**Rules:**
- Always send `Accept-Language: locale` to drive Gedmo Translatable (businessName, tagline, description return in the right language)
- Always spread `serverSideTranslations` in every return branch (including the catch)
- Return empty arrays, not null, on failure — the page gracefully renders empty state

---

## Client-side fetching — useQuery

```ts
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/utils/apiClient';
import { useRouter } from 'next/router';

const { locale } = useRouter();

const { data, isLoading, error } = useQuery({
  queryKey: ['budget_items', weddingProfileId],
  queryFn: () =>
    fetchApi(`/api/budget_items?weddingProfile=${weddingProfileId}`, { locale }),
  enabled: !!weddingProfileId,                      // only fire when id is available
  select: (data) => data['hydra:member'] as BudgetItem[],  // unwrap collection
});
```

**Always pass `locale`** to `fetchApi` so the API returns translated fields.

---

## Client-side mutations — useMutation

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi, ApiError } from '@/utils/apiClient';
import { toast } from 'sonner';

const queryClient = useQueryClient();
const { t } = useTranslation('common');

const mutation = useMutation({
  mutationFn: (payload: NewBudgetItem) =>
    fetchApi('/api/budget_items', {
      method: 'POST',
      body: JSON.stringify(payload),
      locale,
    }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['budget_items'] });
    toast.success(t('common.saved'));
  },
  onError: (error: unknown) => {
    if (error instanceof ApiError) {
      toast.error(error.message);   // message is already hydra:description or detail
    }
  },
});
```

---

## API Platform response shapes

```ts
// Collection endpoint → always has hydra:member + hydra:totalItems
{
  "@context": "/api/contexts/VendorProfile",
  "@type": "hydra:Collection",
  "hydra:member": [...],
  "hydra:totalItems": 42
}

// Single resource → plain object, no wrapper
{
  "@id": "/api/vendor_profiles/1",
  "@type": "VendorProfile",
  "id": 1,
  "businessName": "Traiteur Lahlou",
  ...
}
```

---

## NEVER

```ts
// ✗ useEffect + fetch
useEffect(() => {
  fetch('/api/budget_items').then(r => r.json()).then(setItems);
}, []);

// ✗ useEffect + apiClient
useEffect(() => {
  apiClient.get('/api/budget_items').then(setItems);
}, []);

// ✗ Direct fetch on client without fetchApi (loses auth headers + Accept-Language)
const data = await fetch('/api/vendor_profiles').then(r => r.json());

// ✗ Storing API data in useState as primary cache
const [vendors, setVendors] = useState<VendorProfile[]>([]);
```

---

## Bundle optimisation

For lazy-loading, code-splitting, and bundle size rules see the `vercel-react-best-practices` skill.
