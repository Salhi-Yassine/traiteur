import type { Meta, StoryObj } from "@storybook/react";
import PriceRange from "./PriceRange";

const meta: Meta<typeof PriceRange> = {
  title: "Design System/PriceRange",
  component: PriceRange,
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "select",
      options: ["MAD", "MADMAD", "MADMADMAD", "MADMADMAD+"],
      description: "Price tier encoded as repeated MAD symbols",
    },
    label: {
      control: "boolean",
      description: "Show French label (Budget / Standard / Premium / Exclusif)",
    },
    lightMode: {
      control: "boolean",
      description: "Use white dim color — for use on dark/coloured backgrounds",
    },
  },
};
export default meta;
type Story = StoryObj<typeof PriceRange>;

export const Budget: Story = { args: { value: "MAD", label: true } };
export const Standard: Story = { args: { value: "MADMAD", label: true } };
export const Premium: Story = { args: { value: "MADMADMAD", label: true } };
export const Exclusif: Story = { args: { value: "MADMADMAD+", label: true } };

export const AllTiers: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(["MAD", "MADMAD", "MADMADMAD", "MADMADMAD+"] as const).map((v) => (
        <PriceRange key={v} value={v} label />
      ))}
    </div>
  ),
};

export const OnDarkBackground: Story = {
  parameters: { backgrounds: { default: "dark" } },
  render: () => (
    <div className="flex flex-col gap-3 p-4">
      {(["MAD", "MADMAD", "MADMADMAD", "MADMADMAD+"] as const).map((v) => (
        <PriceRange key={v} value={v} label lightMode />
      ))}
    </div>
  ),
};
