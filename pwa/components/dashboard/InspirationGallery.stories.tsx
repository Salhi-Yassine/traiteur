import type { Meta, StoryObj } from '@storybook/react';
import { InspirationGallery } from './InspirationGallery';

const meta: Meta<typeof InspirationGallery> = {
  title: 'Dashboard/InspirationGallery',
  component: InspirationGallery,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 700, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof InspirationGallery>;

export const Default: Story = {};
