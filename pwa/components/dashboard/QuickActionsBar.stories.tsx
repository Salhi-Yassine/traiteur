import type { Meta, StoryObj } from '@storybook/react';
import { QuickActionsBar } from './QuickActionsBar';

const meta: Meta<typeof QuickActionsBar> = {
  title: 'Dashboard/QuickActionsBar',
  component: QuickActionsBar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 600, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof QuickActionsBar>;

export const Default: Story = {};

export const WithWebsiteUrl: Story = {
  args: {
    websiteUrl: '/invitation/yasmine-yassine',
  },
};
