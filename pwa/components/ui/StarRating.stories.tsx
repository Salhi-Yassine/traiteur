import type { Meta, StoryObj } from "@storybook/react";
import StarRating from "./StarRating";

const meta: Meta<typeof StarRating> = {
  title: "Design System/StarRating",
  component: StarRating,
  tags: ["autodocs"],
  argTypes: {
    rating: {
      control: { type: "number", min: 0, max: 5, step: 0.5 },
      description: "Rating value (0–5, supports half stars)",
    },
    reviewCount: {
      control: "number",
      description: "Number of reviews to display alongside the score",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Star icon size",
    },
    showCount: {
      control: "boolean",
      description: "Toggle visibility of numeric score and review count",
    },
  },
};
export default meta;
type Story = StoryObj<typeof StarRating>;

export const Default: Story = {
  args: { rating: 4.8, reviewCount: 42, size: "md", showCount: true },
};

export const HalfStar: Story = {
  args: { rating: 3.5, reviewCount: 18, size: "md" },
};

export const Perfect: Story = {
  args: { rating: 5, reviewCount: 120, size: "md" },
};

export const Zero: Story = {
  args: { rating: 0, reviewCount: 0, size: "md" },
};

export const NoCount: Story = {
  args: { rating: 4.2, showCount: false, size: "md" },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <StarRating rating={4.8} reviewCount={42} size="sm" />
      <StarRating rating={4.8} reviewCount={42} size="md" />
      <StarRating rating={4.8} reviewCount={42} size="lg" />
    </div>
  ),
};
