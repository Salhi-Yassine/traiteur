import type { Meta, StoryObj } from "@storybook/react";
import CategoryPills from "./CategoryPills";

const meta: Meta<typeof CategoryPills> = {
    title: "Vendors/CategoryPills",
    component: CategoryPills,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
    },
    decorators: [
        (Story) => (
            <div style={{ maxWidth: "800px", background: "#fff", padding: "16px 0" }}>
                <Story />
            </div>
        ),
    ],
};
export default meta;

type Story = StoryObj<typeof CategoryPills>;

export const Default: Story = {
    args: {
        activeCategory: "",
        onSelect: (slug: string) => console.log("Selected:", slug),
    },
};

export const WithActiveCategory: Story = {
    args: {
        activeCategory: "photography",
        onSelect: (slug: string) => console.log("Selected:", slug),
    },
};

export const RTL: Story = {
    decorators: [
        (Story) => (
            <div dir="rtl" lang="ar" style={{ maxWidth: "800px", background: "#fff", padding: "16px 0" }}>
                <Story />
            </div>
        ),
    ],
    args: {
        activeCategory: "salles",
        onSelect: (slug: string) => console.log("Selected:", slug),
    },
};
