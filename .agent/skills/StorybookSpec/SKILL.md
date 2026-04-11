# Storybook Story Spec

Canonical story format for Farah.ma. All stories follow CSF3 with `satisfies`, autodocs, and mandatory RTL variants.

---

## File anatomy

Derived from `pwa/components/vendors/VendorCard.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import MyComponent from './MyComponent';

// ALWAYS use `satisfies`, never `: Meta<typeof MyComponent>`
const meta = {
  title: 'Components/Vendors/MyComponent',   // see title hierarchy below
  component: MyComponent,
  parameters: { layout: 'centered' },         // 'padded' for full-width components
  tags: ['autodocs'],                          // always — generates the docs page
  decorators: [
    (Story) => (
      <div style={{ width: '360px' }}>         // constrain width for card-style components
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;
```

---

## Title hierarchy

| Prefix | Used for |
|---|---|
| `Design System/` | Primitive tokens and base components: `Button`, `Badge`, `Input`, `Card` |
| `Components/<Domain>/` | Domain components: `Components/Vendors/VendorCard`, `Components/Planning/BudgetItem` |
| `Pages/` | Full page compositions (rarely needed — use sparingly) |

---

## Required story variants

Every story file must have at minimum:

### 1. Default — happy path

Use realistic Moroccan data. Never Lorem Ipsum.

```tsx
export const Default: Story = {
  args: {
    id: 1,
    title: 'Traiteur Lahlou',           // real Moroccan vendor name
    subtitle: 'Saveurs authentiques marocaines',
    isVerified: true,
  },
};
```

### 2. Empty / loading state (when applicable)

```tsx
export const Empty: Story = {
  args: {
    ...Default.args,
    items: [],
  },
};
```

### 3. RTL — required for every layout-sensitive component

```tsx
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

---

## i18n decorator (for components using useTranslation)

When a component calls `useTranslation('common')`, wrap it with the i18n provider:

```tsx
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../.storybook/i18n';  // pre-configured test instance

const meta = {
  // ...
  decorators: [
    (Story) => (
      <I18nextProvider i18n={i18n}>
        <div style={{ width: '360px' }}>
          <Story />
        </div>
      </I18nextProvider>
    ),
  ],
} satisfies Meta<typeof MyComponent>;
```

---

## Forbidden patterns

```tsx
// ✗ Colon-type annotation instead of satisfies
const meta: Meta<typeof MyComponent> = { ... }

// ✗ Lorem Ipsum in args
args: { title: 'Lorem ipsum dolor sit amet' }

// ✗ Importing next/router directly in stories
import { useRouter } from 'next/router';
// → mock it in .storybook/preview.tsx instead

// ✗ Inline styles for layout-sensitive values
decorators: [(Story) => <div style={{ paddingLeft: '20px' }}><Story /></div>]
// → use className with Tailwind utilities
```

---

## Realistic Moroccan test data

Use these when filling args:

**Vendor names:** Traiteur Lahlou, Palais des Roses, Négafa Dar El Makhzen, Studio Zine Photo, Orchestre Al Andalous

**Cities:** Casablanca, Rabat, Marrakech, Fès, Tanger

**Arabic names:** مطبخ الحلو، قصر الورود، نقافة دار المخزن

**Prices:** 350–50000 MAD range

**Images:** Use Unsplash URLs already present in the codebase (see `pwa/pages/vendors/index.tsx` fallback data)
