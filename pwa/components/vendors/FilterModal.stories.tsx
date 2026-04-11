import type { Meta, StoryObj } from "@storybook/react";
import FilterModal from "./FilterModal";

const meta: Meta<typeof FilterModal> = {
    title: "Vendors/FilterModal",
    component: FilterModal,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
};
export default meta;

type Story = StoryObj<typeof FilterModal>;

export const Default: Story = {
    args: {
        open: true,
        onOpenChange: () => {},
        selectedPriceRanges: [],
        onPriceChange: (value: string, checked: boolean) => console.log("Price:", value, checked),
        onClearAll: () => console.log("Clear all"),
        total: 42,
        sort: "rating",
        onSortChange: (value: string) => console.log("Sort:", value),
    },
};

export const WithFiltersApplied: Story = {
    args: {
        open: true,
        onOpenChange: () => {},
        selectedPriceRanges: ["MADMAD", "MADMADMAD"],
        onPriceChange: (value: string, checked: boolean) => console.log("Price:", value, checked),
        onClearAll: () => console.log("Clear all"),
        total: 18,
        sort: "price_asc",
        onSortChange: (value: string) => console.log("Sort:", value),
    },
};

export const RTL: Story = {
    decorators: [
        (Story) => (
            <div dir="rtl" lang="ar">
                <Story />
            </div>
        ),
    ],
    args: {
        open: true,
        onOpenChange: () => {},
        selectedPriceRanges: ["MAD"],
        onPriceChange: (value: string, checked: boolean) => console.log("Price:", value, checked),
        onClearAll: () => console.log("Clear all"),
        total: 25,
        sort: "rating",
        onSortChange: (value: string) => console.log("Sort:", value),
    },
};
