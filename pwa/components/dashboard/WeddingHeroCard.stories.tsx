import type { Meta, StoryObj } from '@storybook/react';
import { WeddingHeroCard } from './WeddingHeroCard';

const meta: Meta<typeof WeddingHeroCard> = {
  title: 'Dashboard/WeddingHeroCard',
  component: WeddingHeroCard,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 1200, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof WeddingHeroCard>;

export const WithCoverImage: Story = {
  args: {
    brideName: 'Yasmine',
    groomName: 'Yassine',
    weddingDate: new Date(Date.now() + 87 * 86_400_000).toISOString().split('T')[0],
    weddingCity: 'Marrakech',
    coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
    budgetTotal: 120_000,
    guestsCount: 48,
    completionPercent: 41,
  },
};

export const WithoutCoverImage: Story = {
  args: {
    brideName: 'Yasmine',
    groomName: 'Yassine',
    weddingDate: new Date(Date.now() + 87 * 86_400_000).toISOString().split('T')[0],
    weddingCity: 'Casablanca',
    budgetTotal: 80_000,
    guestsCount: 120,
    completionPercent: 65,
  },
};

export const Demo: Story = {
  args: {
    brideName: 'Yasmine',
    groomName: 'Yassine',
    weddingDate: new Date(Date.now() + 87 * 86_400_000).toISOString().split('T')[0],
    weddingCity: 'Marrakech',
    coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
    budgetTotal: 120_000,
    guestsCount: 48,
    completionPercent: 0,
    isDemo: true,
  },
};


export const NearWeddingDate: Story = {
  args: {
    brideName: 'Sara',
    groomName: 'Mehdi',
    weddingDate: new Date(Date.now() + 5 * 86_400_000).toISOString().split('T')[0],
    weddingCity: 'Fès',
    budgetTotal: 200_000,
    guestsCount: 300,
    completionPercent: 92,
  },
};
