import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./label";
import { Input } from "./input";
import { Checkbox } from "./checkbox";

const meta: Meta<typeof Label> = {
  title: "Design System/Label",
  component: Label,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: { children: "Nom du prestataire" },
};

export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-72">
      <Label htmlFor="biz">Nom de l&apos;entreprise</Label>
      <Input id="biz" placeholder="Traiteur Lahlou" />
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">
        J&apos;accepte les conditions d&apos;utilisation
      </Label>
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <Label>
      Date de mariage <span className="text-destructive">*</span>
    </Label>
  ),
};
