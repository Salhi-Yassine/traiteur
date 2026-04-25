import type { Meta, StoryObj } from '@storybook/react';
import { QuickStatGrid, BudgetCard, GuestsCard, ChecklistCard, WebsiteCard } from './QuickStatCards';

const meta: Meta<typeof QuickStatGrid> = {
  title: 'Dashboard/QuickStatCards',
  component: QuickStatGrid,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof QuickStatGrid>;

export const Default: Story = {
  args: {
    budgetSpent: 60_500,
    budgetTotal: 120_000,
    guestsCount: 48,
    tasksDone: 2,
    tasksTotal: 7,
    elderMode: false,
  },
};

export const ElderMode: Story = {
  args: {
    ...Default.args,
    elderMode: true,
  },
};

export const BudgetFull: Story = {
  args: {
    ...Default.args,
    budgetSpent: 120_000,
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

export const WebsiteCardOnly: StoryObj<typeof WebsiteCard> = {
  render: () => <WebsiteCard className="max-w-xl" />,
};
