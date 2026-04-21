import type { Meta, StoryObj } from '@storybook/react';
import { HeroBanner } from './HeroBanner';

const meta: Meta<typeof HeroBanner> = {
  title: 'Dashboard/HeroBanner',
  component: HeroBanner,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 900 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HeroBanner>;

const future90 = new Date(Date.now() + 90 * 86_400_000).toISOString().split('T')[0];
const future3 = new Date(Date.now() + 3 * 86_400_000).toISOString().split('T')[0];

export const Default: Story = {
  args: {
    brideName: 'Yasmine',
    groomName: 'Yassine',
    weddingDate: future90,
    coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
  },
};

export const NoCoverImage: Story = {
  args: {
    brideName: 'Salma',
    groomName: 'Karim',
    weddingDate: future90,
  },
};

export const NoDateSet: Story = {
  args: {
    brideName: 'Nadia',
    groomName: 'Omar',
  },
};

export const SoonWedding: Story = {
  args: {
    brideName: 'Fatima',
    groomName: 'Hassan',
    weddingDate: future3,
    coverImageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80',
  },
};

export const ElderMode: Story = {
  args: {
    brideName: 'Yasmine',
    groomName: 'Yassine',
    weddingDate: future90,
    coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
    elderMode: true,
  },
};
