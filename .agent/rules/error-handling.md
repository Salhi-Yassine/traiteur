# Error Handling

Four error surfaces, each with one canonical pattern. Pick the right surface and use it consistently.

---

## 1. Toast notifications — transient feedback

**Use for:** save success, delete success, network errors on mutations.

```tsx
import { toast } from 'sonner';
import { ApiError } from '@/utils/apiClient';

// Success
onSuccess: () => {
  toast.success(t('common.saved'));
}

// Error
onError: (error: unknown) => {
  if (error instanceof ApiError) {
    toast.error(error.message);  // already hydra:description / detail / message
  } else {
    toast.error(t('errors.something_went_wrong'));
  }
}
```

`ApiError` is defined in `pwa/utils/apiClient.ts` — its `.message` is extracted from `hydra:description`, `detail`, or `description` from the API response. Use it directly.

---

## 2. Form field errors — inline validation

**Use for:** Formik field-level errors (Yup client-side + API 422 server-side).

```tsx
{/* Client-side Yup error */}
{formik.touched.email && formik.errors.email && (
  <p className="text-[13px] text-red-600 mt-1">{formik.errors.email}</p>
)}
```

**Mapping API 422 errors to Formik fields:**
```tsx
onError: (error: unknown) => {
  if (error instanceof ApiError) {
    // hydra:description often contains the field path
    formik.setFieldError('email', error.message);
    // or show a toast if you can't map to a specific field
    toast.error(error.message);
  }
}
```

---

## 3. Page-level empty states

**Use for:** when `getServerSideProps` catches an error (API down), or when a collection is empty.

Pattern derived from `pwa/pages/vendors/index.tsx`:

```tsx
// In getServerSideProps catch block — return empty state, NOT an error page
} catch {
  return {
    props: {
      items: [],
      total: 0,
      ...(await serverSideTranslations(locale || 'fr', ['common'])),
    },
  };
}

// In the component — visual empty state with retry CTA
{items.length === 0 && (
  <div className="py-20 text-center bg-[#F7F7F7] rounded-[24px] border border-[#DDDDDD] flex flex-col items-center">
    <div className="w-16 h-16 rounded-full bg-[#DDDDDD] flex items-center justify-center mb-5">
      {/* icon */}
    </div>
    <h3 className="text-[20px] font-semibold text-[#1A1A1A] mb-2">
      {t('common.no_results')}
    </h3>
    <p className="text-[14px] text-[#717171] mb-8 max-w-sm mx-auto">
      {t('common.no_results_desc')}
    </p>
    <Button onClick={handleRetry} variant="ghost">
      {t('common.retry')}
    </Button>
  </div>
)}
```

**Never** show raw PHP exception messages, `hydra:description`, or stack traces to users. Map to `t('errors.something_went_wrong')` if the message isn't user-friendly.

---

## 4. Loading states

**Prefer skeleton over spinner** for content areas:

```tsx
// Skeleton — use while isLoading from useQuery
{isLoading && (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="bg-[#F7F7F7] rounded-[24px] aspect-[4/3] animate-pulse"
      />
    ))}
  </div>
)}

// Spinner — only for small inline actions (button loading state)
<Button disabled={mutation.isPending}>
  {mutation.isPending ? (
    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  ) : t('common.save')}
</Button>
```

Always guard render with `isLoading` before accessing `data`:
```tsx
const { data, isLoading } = useQuery(...);
if (isLoading) return <Skeleton />;
// now data is safe to use
```

---

## NEVER

```tsx
// ✗ console.error for user-visible errors
console.error('Failed to save');

// ✗ alert()
alert('Une erreur est survenue');

// ✗ Raw hydra:description to the user
<p>{error.data['hydra:description']}</p>

// ✗ Throwing from event handlers without catch
const handleSave = async () => {
  await fetchApi('/api/...');  // unhandled rejection
};

// ✗ useState string for error display (use toast instead)
const [errorMsg, setErrorMsg] = useState<string | null>(null);
```
