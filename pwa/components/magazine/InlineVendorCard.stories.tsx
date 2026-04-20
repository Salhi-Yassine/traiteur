import type { Meta, StoryObj } from "@storybook/react";
import InlineVendorCard, { ShopTheLook } from "./InlineVendorCard";

const meta = {
    title: "Components/Magazine/InlineVendorCard",
    component: InlineVendorCard,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    decorators: [(Story) => <div style={{ width: "520px" }}><Story /></div>],
} satisfies Meta<typeof InlineVendorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const VENDOR = {
    slug: "negafa-dar-el-makhzen",
    businessName: "Négafa Dar El Makhzen",
    category: { name: "Négafa", slug: "negafa" },
    coverImageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=200&q=60",
    isVerified: true,
    averageRating: 4.9,
};

export const Single: Story = { args: VENDOR };

export const Group: StoryObj = {
    render: () => (
        <ShopTheLook vendors={[
            VENDOR,
            { ...VENDOR, slug: "negafa-fassia", businessName: "Négafa Fassia Tradition", isVerified: false, averageRating: 4.7 },
        ]} />
    ),
};
