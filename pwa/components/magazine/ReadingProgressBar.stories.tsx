import type { Meta, StoryObj } from "@storybook/react";
import ReadingProgressBar from "./ReadingProgressBar";

const meta = {
    title: "Components/Magazine/ReadingProgressBar",
    component: ReadingProgressBar,
    parameters: { layout: "fullscreen" },
    tags: ["autodocs"],
} satisfies Meta<typeof ReadingProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
