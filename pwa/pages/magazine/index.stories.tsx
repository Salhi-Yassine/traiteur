import type { Meta, StoryObj } from "@storybook/react";
import { mockMagazinePageProps } from "@/lib/mockMagazineData";
import MagazinePage from "./index";

const meta = {
    title: "Pages/Magazine/Landing",
    component: MagazinePage,
    parameters: {
        layout: "fullscreen",
        nextjs: { router: { pathname: "/magazine", query: {} } },
    },
    tags: ["autodocs"],
} satisfies Meta<typeof MagazinePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: mockMagazinePageProps,
};

export const EmptyState: Story = {
    args: {
        featuredArticle: null,
        initialArticles: [],
    },
};
