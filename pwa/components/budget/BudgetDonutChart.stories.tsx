import type { Meta, StoryObj } from "@storybook/react";
import BudgetDonutChart from "./BudgetDonutChart";

const meta: Meta<typeof BudgetDonutChart> = {
  title: "Budget/BudgetDonutChart",
  component: BudgetDonutChart,
  parameters: { backgrounds: { default: "dark" } },
};
export default meta;

type Story = StoryObj<typeof BudgetDonutChart>;

const sampleItems = [
  { category: "Salle", estimatedAmount: 45000, spentAmount: 45000 },
  { category: "Traiteur", estimatedAmount: 60000, spentAmount: 30000 },
  { category: "Photographe", estimatedAmount: 15000, spentAmount: 0 },
  { category: "Décoration", estimatedAmount: 20000, spentAmount: 12000 },
  { category: "Musique", estimatedAmount: 10000, spentAmount: 5000 },
];

export const WithData: Story = {
  args: {
    items: sampleItems,
    totalBudget: 200000,
    progressPercent: 46,
  },
};

export const FullyAllocated: Story = {
  args: {
    items: sampleItems.map((i) => ({ ...i, estimatedAmount: i.estimatedAmount * 1.33 })),
    totalBudget: 200000,
    progressPercent: 46,
  },
};

export const Empty: Story = {
  args: {
    items: [],
    totalBudget: 200000,
    progressPercent: 0,
  },
};

export const SingleCategory: Story = {
  args: {
    items: [{ category: "Traiteur", estimatedAmount: 80000, spentAmount: 40000 }],
    totalBudget: 200000,
    progressPercent: 20,
  },
};
