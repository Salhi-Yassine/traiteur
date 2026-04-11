import type { Meta, StoryObj } from "@storybook/react";
import FilterSidebar from "./FilterSidebar";

const meta: Meta<typeof FilterSidebar> = {
    title: "Vendors/FilterSidebar",
    component: FilterSidebar,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
    },
    decorators: [
        (Story) => (
            <div style={{ maxWidth: "520px", padding: "24px", background: "#fff" }}>
                <Story />
            </div>
        ),
    ],
};
export default meta;

type Story = StoryObj<typeof FilterSidebar>;

export const Default: Story = {
    args: {
        selectedPriceRanges: [],
        onChange: (value: string, checked: boolean) => console.log("Price:", value, checked),
        sort: "rating",
        onSortChange: (value: string) => console.log("Sort:", value),
    },
};

export const WithSelections: Story = {
    args: {
        selectedPriceRanges: ["MADMAD", "MADMADMAD"],
        onChange: (value: string, checked: boolean) => console.log("Price:", value, checked),
        sort: "price_asc",
        onSortChange: (value: string) => console.log("Sort:", value),
    },
};

export const RTL: Story = {
    decorators: [
        (Story) => (
            <div dir="rtl" lang="ar" style={{ maxWidth: "520px", padding: "24px", background: "#fff" }}>
                <Story />
            </div>
        ),
    ],
    args: {
        selectedPriceRanges: ["MAD"],
        onChange: (value: string, checked: boolean) => console.log("Price:", value, checked),
        sort: "rating",
        onSortChange: (value: string) => console.log("Sort:", value),
    },
};
