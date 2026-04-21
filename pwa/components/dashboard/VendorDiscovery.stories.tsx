import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VendorDiscovery } from './VendorDiscovery';

const mockVendors = [
  { id: 1, slug: 'dar-zitoun', businessName: 'Dar Zitoun', tagline: 'Élégance berbère', cities: [{ name: 'Marrakech', slug: 'marrakech' }], category: { name: 'Salles', slug: 'salle' }, priceRange: 'MADMAD', startingPrice: 45000, coverImageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80', averageRating: 4.8, reviewCount: 34, isVerified: true },
  { id: 2, slug: 'riad-al-bacha', businessName: 'Riad Al Bacha', tagline: 'Au cœur de la médina', cities: [{ name: 'Fès', slug: 'fes' }], category: { name: 'Salles', slug: 'salle' }, priceRange: 'MADMADMAD', startingPrice: 80000, coverImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', averageRating: 4.9, reviewCount: 67, isVerified: true },
  { id: 3, slug: 'palais-el-badi', businessName: 'Palais El Badi', tagline: 'Grandeur royale', cities: [{ name: 'Casablanca', slug: 'casablanca' }], category: { name: 'Salles', slug: 'salle' }, priceRange: 'MADMADMAD+', startingPrice: 120000, coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', averageRating: 5.0, reviewCount: 12, isVerified: true },
];

function withQueryClient(data: unknown) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  qc.setQueryData(['featuredVendors'], { 'hydra:member': data });
  return (Story: React.ComponentType) => (
    <QueryClientProvider client={qc}>
      <div style={{ maxWidth: 900, padding: 16 }}>
        <Story />
      </div>
    </QueryClientProvider>
  );
}

const meta: Meta<typeof VendorDiscovery> = {
  title: 'Dashboard/VendorDiscovery',
  component: VendorDiscovery,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VendorDiscovery>;

export const WithVendors: Story = {
  decorators: [withQueryClient(mockVendors)],
};

export const Empty: Story = {
  decorators: [withQueryClient([])],
};

export const Loading: Story = {
  decorators: [
    (Story) => {
      const qc = new QueryClient({ defaultOptions: { queries: { retry: false, enabled: false } } });
      return (
        <QueryClientProvider client={qc}>
          <div style={{ maxWidth: 900, padding: 16 }}>
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};
