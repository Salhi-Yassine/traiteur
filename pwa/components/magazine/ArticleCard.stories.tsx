import type { Meta, StoryObj } from "@storybook/react";
import ArticleCard from "./ArticleCard";

const meta = {
    title: "Components/Magazine/ArticleCard",
    component: ArticleCard,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div style={{ width: "360px" }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const BASE = {
    slug: "choisir-la-robe-caftan",
    title: "Comment choisir le bon Caftan pour votre mariage",
    excerpt: "La robe caftan est l'emblème de la mariée marocaine. Voici nos conseils pour trouver celle qui vous ressemble.",
    featuredImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
    category: { name: "Fashion", slug: "fashion" },
    publishedAt: "2026-04-15T10:00:00Z",
    readingTimeMinutes: 5,
};

export const Default: Story = { args: { ...BASE } };

export const Featured: Story = {
    args: { ...BASE, variant: "featured" },
    decorators: [(Story) => <div style={{ width: "900px" }}><Story /></div>],
};

export const NoImage: Story = {
    args: { ...BASE, featuredImage: undefined },
};

export const LongTitle: Story = {
    args: {
        ...BASE,
        title: "Guide complet pour organiser un mariage traditionnel marocain selon les traditions de Fès, Marrakech et Casablanca",
    },
};
