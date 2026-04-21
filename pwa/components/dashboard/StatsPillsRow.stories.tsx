import type { Meta, StoryObj } from '@storybook/react';
import { StatsPillsRow } from './StatsPillsRow';

const meta: Meta<typeof StatsPillsRow> = {
  title: 'Dashboard/StatsPillsRow',
  component: StatsPillsRow,
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
type Story = StoryObj<typeof StatsPillsRow>;

export const Default: Story = {
  args: {
    daysLeft: 85,
    budgetTotal: 120000,
    tasksLeft: 12,
    guestsCount: 48,
  },
};

export const NoDate: Story = {
  args: {
    daysLeft: null,
    budgetTotal: 80000,
    tasksLeft: 5,
    guestsCount: 30,
  },
};

export const NoBudget: Story = {
  args: {
    daysLeft: 45,
    budgetTotal: 0,
    tasksLeft: 0,
    guestsCount: 0,
  },
};
