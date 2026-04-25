import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VendorDiscovery } from './VendorDiscovery';
import { MOCK_VENDORS } from './mock';

function makeQueryDecorator(data: unknown) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  qc.setQueryData(['featuredVendors'], { 'hydra:member': data });

  function QueryDecorator(Story: React.ComponentType) {
    return (
      <QueryClientProvider client={qc}>
        <div style={{ maxWidth: 900, padding: 16 }}>
          <Story />
        </div>
      </QueryClientProvider>
    );
  }

  return QueryDecorator;
}

const meta: Meta<typeof VendorDiscovery> = {
  title: 'Dashboard/VendorDiscovery',
  component: VendorDiscovery,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VendorDiscovery>;

export const WithMockVendors: Story = {
  decorators: [makeQueryDecorator(MOCK_VENDORS)],
};

export const WithCustomVendors: Story = {
  decorators: [
    makeQueryDecorator([
      MOCK_VENDORS[0],
      MOCK_VENDORS[1],
    ]),
  ],
};

export const Loading: Story = {
  decorators: [
    function LoadingDecorator(Story: React.ComponentType) {
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
