import type { Meta, StoryObj } from "@storybook/react";
import HireTheProsWidget from "./HireTheProsWidget";

const meta = {
    title: "Components/Magazine/HireTheProsWidget",
    component: HireTheProsWidget,
    parameters: { layout: "fullscreen" },
    tags: ["autodocs"],
} satisfies Meta<typeof HireTheProsWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        categorySlug: "negafa",
        categoryName: "Négafa",
    },
};

export const NoCategoryFilter: Story = {
    args: {},
};
