import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./textarea";
import { Label } from "./label";

const meta: Meta<typeof Textarea> = {
  title: "Design System/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    rows: { control: { type: "number", min: 2, max: 10 } },
  },
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder:
      "Décrivez votre événement, le thème souhaité, vos questions…",
    rows: 4,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-96">
      <Label htmlFor="msg">Message</Label>
      <Textarea
        id="msg"
        placeholder="Thème du mariage, prestations souhaitées, questions particulières..."
        rows={4}
      />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Ce champ n'est pas modifiable pour le moment.",
    rows: 3,
  },
};

export const WithCharacterCount: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [val, setVal] = require("react").useState("");
    const max = 2000;
    return (
      <div className="flex flex-col gap-2 w-96">
        <Label htmlFor="counted">Vos précisions</Label>
        <Textarea
          id="counted"
          rows={4}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          maxLength={max}
          placeholder="Décrivez votre projet…"
        />
        <p className="text-xs text-neutral-400 text-end">
          {val.length}/{max}
        </p>
      </div>
    );
  },
};
