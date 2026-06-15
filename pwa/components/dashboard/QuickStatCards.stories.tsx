import type { Meta, StoryObj } from '@storybook/react';
import { PlanningOverviewCard, BudgetCard, GuestsCard, ChecklistCard } from './QuickStatCards';

const meta: Meta<typeof PlanningOverviewCard> = {
  title: 'Dashboard/QuickStatCards',
  component: PlanningOverviewCard,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 700, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof PlanningOverviewCard>;

const nextTask = { id: 3, name: 'Envoyer les faire-parts', status: 'in_progress' as const, dueDate: '2026-05-01' };

export const Default: Story = {
  args: {
    tasksDone: 2,
    tasksTotal: 7,
    daysLeft: 87,
    guestsCount: 48,
    budgetSpent: 60_500,
    budgetTotal: 120_000,
    nextTask,
  },
};

export const AllDone: Story = {
  args: {
    tasksDone: 7,
    tasksTotal: 7,
    daysLeft: 12,
    guestsCount: 48,
    budgetSpent: 115_000,
    budgetTotal: 120_000,
  },
};

export const NoNextTask: Story = {
  args: {
    tasksDone: 7,
    tasksTotal: 7,
    daysLeft: null,
    guestsCount: 0,
    budgetSpent: 0,
    budgetTotal: 0,
  },
};


export const BudgetCardOnly: StoryObj<typeof BudgetCard> = {
  render: () => <BudgetCard spent={60_500} total={120_000} />,
};

export const GuestsCardOnly: StoryObj<typeof GuestsCard> = {
  render: () => <GuestsCard count={48} />,
};

export const ChecklistCardOnly: StoryObj<typeof ChecklistCard> = {
  render: () => <ChecklistCard done={2} total={7} />,
};
