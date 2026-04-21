import type { Meta, StoryObj } from "@storybook/react";
import { mockArticleDetailPageProps } from "@/lib/mockMagazineData";
import ArticlePage from "./[slug]";

const meta = {
    title: "Pages/Magazine/Article Detail",
    component: ArticlePage,
    parameters: {
        layout: "fullscreen",
        nextjs: {
            router: {
                pathname: "/magazine/[slug]",
                query: { slug: "le-guide-du-hamlou-parfait" },
                asPath: "/magazine/le-guide-du-hamlou-parfait",
                locale: "fr",
            },
        },
    },
    tags: ["autodocs"],
} satisfies Meta<typeof ArticlePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: mockArticleDetailPageProps,
};

export const WithoutWidgetCalculator: Story = {
    args: {
        article: {
            ...mockArticleDetailPageProps.article,
            widgetType: null,
        },
        relatedArticles: mockArticleDetailPageProps.relatedArticles,
    },
};

export const WithRelatedVendors: Story = {
    args: mockArticleDetailPageProps,
};
