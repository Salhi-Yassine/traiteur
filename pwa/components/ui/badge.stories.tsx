import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "Design System/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "neutral", "accent", "verified", "warning", "danger", "outline", "category"],
      description: "Visual style of the badge",
    },
    children: {
      control: "text",
    },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    variant: "default",
    children: "Default",
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Photographe",
  },
};

export const Verified: Story = {
  args: {
    variant: "verified",
    children: "✓ Vérifié",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "En attente",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Refusé",
  },
};

export const Category: Story = {
  args: {
    variant: "category",
    children: "Salles de Fête",
  },
};

export const Neutral: Story = {
  args: {
    variant: "neutral",
    children: "12 résultats",
  },
};

// ─── All variants ───
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="accent">Accent</Badge>
      <Badge variant="verified">✓ Vérifié</Badge>
      <Badge variant="warning">En attente</Badge>
      <Badge variant="danger">Refusé</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="category">Catégorie</Badge>
    </div>
  ),
};
