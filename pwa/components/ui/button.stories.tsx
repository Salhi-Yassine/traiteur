import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Design System/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "secondary", "ghost", "outline", "danger", "destructive", "whatsapp", "link"],
      description: "Visual style of the button",
    },
    size: {
      control: "select",
      options: ["sm", "default", "md", "lg", "icon"],
      description: "Size preset",
    },
    loading: {
      control: "boolean",
      description: "Shows a loading spinner and disables interaction",
    },
    disabled: {
      control: "boolean",
    },
    children: {
      control: "text",
    },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

// ─── Primary (Terracotta) ───
export const Primary: Story = {
  args: {
    variant: "default",
    children: "Commencer",
  },
};

// ─── Secondary (Outlined neutral-900) ───
export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Voir plus",
  },
};

// ─── Ghost ───
export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Annuler",
  },
};

// ─── WhatsApp ───
export const WhatsApp: Story = {
  args: {
    variant: "whatsapp",
    size: "lg",
    children: "Contacter via WhatsApp",
  },
};

// ─── Danger ───
export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Supprimer",
  },
};

// ─── Link ───
export const Link: Story = {
  args: {
    variant: "link",
    children: "En savoir plus",
  },
};

// ─── Loading state ───
export const Loading: Story = {
  args: {
    variant: "default",
    loading: true,
    children: "Envoi en cours…",
  },
};

// ─── Sizes ───
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// ─── All variants at a glance ───
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
      <Button variant="default">Primary (Terracotta)</Button>
      <Button variant="secondary">Secondary (Outlined)</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="whatsapp" size="lg">WhatsApp</Button>
      <Button variant="link">Link</Button>
      <Button variant="default" disabled>Disabled</Button>
      <Button variant="default" loading>Loading</Button>
    </div>
  ),
};
