import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";
import { Label } from "./label";

const meta: Meta<typeof Input> = {
  title: "Design System/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "date", "search"],
    },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: "Votre prénom" },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-72">
      <Label htmlFor="email">Adresse email</Label>
      <Input id="email" type="email" placeholder="vous@example.com" />
    </div>
  ),
};

export const Password: Story = {
  args: { type: "password", placeholder: "Mot de passe" },
};

export const Disabled: Story = {
  args: { placeholder: "Non modifiable", disabled: true, value: "Casablanca" },
};

export const WithError: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-72">
      <Label htmlFor="err-email" className="text-destructive">
        Email invalide
      </Label>
      <Input
        id="err-email"
        type="email"
        placeholder="vous@example.com"
        className="border-destructive focus-visible:ring-destructive"
        defaultValue="invalid-email"
      />
    </div>
  ),
};

export const Search: Story = {
  args: { type: "search", placeholder: "Rechercher un prestataire…" },
};
