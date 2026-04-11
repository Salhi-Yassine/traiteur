# Feature Recipes

Copy-ready templates for the three most common Farah.ma development tasks. All patterns are derived from real code in the repo.

---

## Recipe 1 — New UI Component

**When to use:** adding a reusable component to `pwa/components/<domain>/`

### Files to create

1. `pwa/components/<domain>/<ComponentName>.tsx`
2. `pwa/components/<domain>/<ComponentName>.stories.tsx`
3. Add translation keys to **all 4** locale files in `pwa/public/locales/*/common.json`

### Component template

Derived from `pwa/components/vendors/VendorCard.tsx`:

```tsx
import { useTranslation } from 'next-i18next';
import { ChevronRight } from 'lucide-react';   // example directional icon

// 1. Always export the Props interface
export interface MyComponentProps {
  id: number;
  title: string;
  subtitle?: string;
  isVerified?: boolean;
}

// 2. Default export is the component
export default function MyComponent({ id, title, subtitle, isVerified }: MyComponentProps) {
  const { t } = useTranslation('common');

  return (
    // 3. Use design system tokens: rounded-[24px], shadow-[0_1px_2px_rgba(0,0,0,0.08)]
    <div className="bg-white rounded-[24px] border border-[#DDDDDD] shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:-translate-y-[2px] transition-all duration-300 p-5">
      <h3 className="font-semibold text-[17px] text-[#222222]">{title}</h3>

      {subtitle && (
        <p className="text-[13px] text-[#5E5E5E] mt-1">{subtitle}</p>
      )}

      {/* 4. RTL-safe layout: start/end, ps-*/pe-*, ms-*/me-* — NEVER left-*/right-* */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F3F3F3]">
        <span className="text-[13px] text-[#717171]">
          {t('my_component.some_label')}
        </span>

        {/* 5. Directional icons: rtl:-scale-x-100 */}
        <div className="flex items-center gap-1 text-[13px] font-semibold text-[#222222]">
          {t('common.view')}
          <ChevronRight className="w-4 h-4 rtl:-scale-x-100" />
        </div>
      </div>
    </div>
  );
}
```

### Story template

Derived from `pwa/components/vendors/VendorCard.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import MyComponent from './MyComponent';

// Use `satisfies`, not `: Meta<typeof MyComponent>`
const meta = {
  title: 'Components/<Domain>/MyComponent',  // e.g. Components/Vendors/VendorCard
  component: MyComponent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '360px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// Always use realistic Moroccan data, never Lorem Ipsum
export const Default: Story = {
  args: {
    id: 1,
    title: 'Traiteur Lahlou',
    subtitle: 'Saveurs authentiques marocaines',
    isVerified: true,
  },
};

// RTL variant is required for every layout-sensitive component
export const RTL: Story = {
  name: 'RTL (Arabic)',
  decorators: [(Story) => <div dir="rtl" lang="ar"><Story /></div>],
  args: {
    ...Default.args,
    title: 'مطبخ الحلو',
    subtitle: 'نكهات مغربية أصيلة',
  },
};
```

### Checklist before done

- [ ] `Props` interface exported (not inline)
- [ ] All visible strings use `t()` — no hardcoded text
- [ ] No `left-*` / `right-*` classes — only `start-*`, `end-*`, `ps-*`, `pe-*`, `ms-*`, `me-*`
- [ ] Directional icons have `rtl:-scale-x-100`
- [ ] `.stories.tsx` file exists with `Default` + `RTL` variants
- [ ] Translation keys added in all 4 locale files

---

## Recipe 2 — New Page

**When to use:** adding a file to `pwa/pages/`

### Fetch strategy decision

| Scenario | Strategy |
|---|---|
| Public page, SEO matters, data changes infrequently | `getStaticProps` with `revalidate: 3600` |
| Authenticated user data, or query params matter | `getServerSideProps` |
| Dashboard widget — all data loaded after auth check | No `getXxxProps` — client-side TanStack Query only |

### getServerSideProps template

Derived from `pwa/pages/vendors/index.tsx`:

```tsx
import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface MyPageProps {
  items: MyItem[];
  total: number;
}

export default function MyPage({ items, total }: MyPageProps) {
  const { t } = useTranslation('common');

  return (
    <div className="bg-white min-h-screen">
      <Head>
        {/* Always use t() for meta — never hardcoded */}
        <title>{t('my_page.meta_title')} — Farah.ma</title>
        <meta name="description" content={t('my_page.meta_description')} />
      </Head>

      {/* Page content */}
      {items.length === 0 && (
        <div className="py-20 text-center bg-[#F7F7F7] rounded-[24px] border border-[#DDDDDD]">
          <h3 className="text-[20px] font-semibold text-[#1A1A1A] mb-2">
            {t('common.no_results')}
          </h3>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost';
    const res = await fetch(`${baseUrl}/api/my_resources`, {
      headers: {
        Accept: 'application/ld+json',
        'Accept-Language': locale || 'fr',
      },
    });

    if (!res.ok) throw new Error('API unavailable');
    const data = await res.json();

    return {
      props: {
        items: data['hydra:member'] ?? [],
        total: data['hydra:totalItems'] ?? 0,
        ...(await serverSideTranslations(locale || 'fr', ['common'])),
      },
    };
  } catch {
    // Always catch and return empty state — never crash the page
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

### Checklist before done

- [ ] `<Head>` has `<title>` with `t()` key
- [ ] `serverSideTranslations` spread in **every** return branch (including catch)
- [ ] `my_page.meta_title` key added to all 4 locale files
- [ ] No hardcoded strings anywhere in the page
- [ ] Mobile-first layout looks correct at 390px width
- [ ] `aria-*` attributes on all interactive elements

---

## Recipe 3 — New Symfony API Endpoint

**When to use:** adding or modifying entities/operations in `api/`

### Step-by-step order

1. **Entity** in `api/src/Entity/` (see `.agent/rules/symfony-entity-anatomy.md` for the exact format)
2. **Voter** in `api/src/Security/Voter/` — only if the entity has ownership rules
3. **State Processor/Provider** in `api/src/State/` — only if operations need custom logic
4. **Factory** in `api/src/Factory/` for fixtures
5. **Run:** `make full-migrat` (creates migration → runs it → cleans up)
6. **Run:** `make cs` (PHP-CS-Fixer + PHPStan — must pass before any commit)

### Voter template

Derived from `api/src/Security/Voter/VendorProfileVoter.php`:

```php
<?php

namespace App\Security\Voter;

use App\Entity\MyEntity;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class MyEntityVoter extends Voter
{
    public const EDIT   = 'my_entity:edit';
    public const CREATE = 'my_entity:create';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::EDIT, self::CREATE])
            && $subject instanceof MyEntity;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!$user instanceof User) {
            return false;
        }

        /** @var MyEntity $entity */
        $entity = $subject;

        return match ($attribute) {
            self::EDIT   => $this->canEdit($entity, $user),
            self::CREATE => in_array('ROLE_VENDOR', $user->getRoles()) || in_array('ROLE_ADMIN', $user->getRoles()),
            default      => false,
        };
    }

    private function canEdit(MyEntity $entity, User $user): bool
    {
        if (in_array('ROLE_ADMIN', $user->getRoles())) {
            return true;
        }
        return $entity->getOwner() === $user;
    }
}
```

### State Provider template

Derived from `api/src/State/MeProvider.php`:

```php
<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\MyEntity;
use App\Repository\MyEntityRepository;

class MyEntityProvider implements ProviderInterface
{
    public function __construct(private readonly MyEntityRepository $repository)
    {
    }

    /** @return MyEntity|null */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ?MyEntity
    {
        return $this->repository->find($uriVariables['id'] ?? null);
    }
}
```

### Checklist before done

- [ ] All operations in `#[ApiResource]` have explicit `security:` expressions
- [ ] Migration created AND run (`make full-migrat`)
- [ ] PHPStan passes (`make stan`)
- [ ] PHP-CS-Fixer clean (`make fix-php`)
- [ ] Verify new endpoint: `make sf c="debug:router"` then test with curl or PHPUnit
