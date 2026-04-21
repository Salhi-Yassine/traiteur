import type { Meta, StoryObj } from '@storybook/react';
import { MilestoneCategories } from './MilestoneCategories';

const meta: Meta<typeof MilestoneCategories> = {
  title: 'Dashboard/MilestoneCategories',
  component: MilestoneCategories,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 900, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MilestoneCategories>;

export const Default: Story = {};
