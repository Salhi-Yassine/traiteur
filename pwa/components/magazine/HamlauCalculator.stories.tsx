import type { Meta, StoryObj } from "@storybook/react";
import HamlauCalculator from "./HamlauCalculator";

const meta = {
    title: "Components/Magazine/HamlauCalculator",
    component: HamlauCalculator,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div style={{ maxWidth: "680px", width: "100%" }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof HamlauCalculator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
