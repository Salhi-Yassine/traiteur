import type { Meta, StoryObj } from '@storybook/react';
import VendorCard from './VendorCard';

const meta = {
  title: 'Components/Vendors/VendorCard',
  component: VendorCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VendorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 1,
    slug: 'traiteur-lahlou',
    businessName: 'Traiteur Lahlou',
    tagline: 'Saveurs authentiques marocaines',
    cities: [
      { name: 'Casablanca', slug: 'casablanca' },
      { name: 'Rabat', slug: 'rabat' }
    ],
    category: {
      name: 'Catering',
      slug: 'catering',
    },
    priceRange: '$$',
    startingPrice: 350,
    coverImageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
    averageRating: 4.8,
    reviewCount: 42,
    isVerified: true,
  },
};

export const WithoutStartingPrice: Story = {
  args: {
    ...Default.args,
    startingPrice: null,
  },
};

export const Unverified: Story = {
  args: {
    ...Default.args,
    isVerified: false,
  },
};

export const ListVariant: Story = {
  args: {
    ...Default.args,
    variant: "list",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "640px" }}>
        <Story />
      </div>
    ),
  ],
};

export const ListStack: Story = {
  render: () => (
    <div style={{ width: "640px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <VendorCard {...(Default.args as any)} variant="list" id={1} businessName="Palais des Roses" averageRating={4.9} reviewCount={128} priceRange="MADMADMAD" />
      <VendorCard {...(Default.args as any)} variant="list" id={2} businessName="Traiteur El Bahia" averageRating={4.7} reviewCount={95} priceRange="MADMAD" />
      <VendorCard {...(Default.args as any)} variant="list" id={3} businessName="Négafa Dar El Makhzen" averageRating={5.0} reviewCount={64} priceRange="MADMADMAD+" />
    </div>
  ),
};
