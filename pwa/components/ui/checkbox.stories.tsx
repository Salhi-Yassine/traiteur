import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta: Meta<typeof Checkbox> = {
  title: "Design System/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {
  args: { checked: false },
};

export const Checked: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: { checked: true, disabled: true },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="salle" defaultChecked />
        <Label htmlFor="salle">Salles de Fête</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="catering" />
        <Label htmlFor="catering">Traiteurs</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="photo" />
        <Label htmlFor="photo">Photographes</Label>
      </div>
    </div>
  ),
};
