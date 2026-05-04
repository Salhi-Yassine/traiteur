import type { Meta, StoryObj } from '@storybook/react';
import { DeadlineTimeline } from './DeadlineTimeline';
import { MOCK_MILESTONES } from './mock';

const meta: Meta<typeof DeadlineTimeline> = {
  title: 'Dashboard/DeadlineTimeline',
  component: DeadlineTimeline,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 900, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DeadlineTimeline>;

export const AllUpcoming: Story = {
  args: { milestones: MOCK_MILESTONES },
};

export const WithOverdue: Story = {
  args: {
    milestones: [
      {
        id: 1,
        title: 'Envoyer les faire-parts',
        dueDate: new Date(Date.now() - 5 * 86_400_000).toISOString().split('T')[0],
        status: 'in_progress',
        isOverdue: true,
      },
      {
        id: 2,
        title: 'Confirmer le photographe',
        dueDate: new Date(Date.now() + 3 * 86_400_000).toISOString().split('T')[0],
        status: 'todo',
        isOverdue: false,
      },
      ...MOCK_MILESTONES.slice(2),
    ],
  },
};

export const Empty: Story = {
  args: { milestones: [] },
};
