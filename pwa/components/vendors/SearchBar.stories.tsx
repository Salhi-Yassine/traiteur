import type { Meta, StoryObj } from "@storybook/react";
import SearchBar from "./SearchBar";

const meta: Meta<typeof SearchBar> = {
  title: "Components/Vendors/SearchBar",
  component: SearchBar,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["hero", "page"],
      description: "Hero — large pill for the homepage. Page — compact bar for directory.",
    },
    initialLocation: { control: "text" },
    initialCategory: { control: "text" },
  },
};
export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Hero: Story = {
  args: { variant: "hero" },
  parameters: {
    backgrounds: { default: "neutral-100" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "800px", maxWidth: "100vw", padding: "2rem" }}>
        <Story />
      </div>
    ),
  ],
};

export const Page: Story = {
  args: { variant: "page" },
  decorators: [
    (Story) => (
      <div style={{ width: "900px", maxWidth: "100vw", padding: "2rem" }}>
        <Story />
      </div>
    ),
  ],
};

export const HeroWithPreselected: Story = {
  args: {
    variant: "hero",
    initialLocation: "casablanca",
    initialCategory: "catering",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "800px", maxWidth: "100vw", padding: "2rem" }}>
        <Story />
      </div>
    ),
  ],
};
