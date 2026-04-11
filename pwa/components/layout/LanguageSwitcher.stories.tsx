import type { Meta, StoryObj } from "@storybook/react";
import LanguageSwitcher from "./LanguageSwitcher";

const meta: Meta<typeof LanguageSwitcher> = {
  title: "Layout/LanguageSwitcher",
  component: LanguageSwitcher,
  tags: ["autodocs"],
  argTypes: {
    scrolled: {
      control: "boolean",
      description: "Solid navbar mode — switches pill colors to dark-on-light",
    },
    mobile: {
      control: "boolean",
      description: "Mobile grid layout used inside the mobile drawer",
    },
  },
};
export default meta;
type Story = StoryObj<typeof LanguageSwitcher>;

export const OnTransparentNav: Story = {
  args: { scrolled: false },
  parameters: { backgrounds: { default: "dark" } },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export const OnSolidNav: Story = {
  args: { scrolled: true },
};

export const Mobile: Story = {
  args: { mobile: true },
  decorators: [
    (Story) => (
      <div style={{ width: "300px" }}>
        <Story />
      </div>
    ),
  ],
};
