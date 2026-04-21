import type { Meta, StoryObj } from '@storybook/react';
import InspirationHero from '@/components/inspiration/InspirationHero';
import { mockArticles } from '@/lib/mockInspirationData';

const meta: Meta<typeof InspirationHero> = {
  title: 'Inspiration/InspirationHero',
  component: InspirationHero,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Hero section for the inspiration hub featuring a prominent article.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InspirationHero>;

export const Default: Story = {
  args: {
    featuredArticle: mockArticles[0],
  },
};

export const WithLongTitle: Story = {
  args: {
    featuredArticle: {
      ...mockArticles[0],
      title: 'An Extremely Long Title That Tests How the Component Handles Very Long Headlines and Wrapping',
      excerpt: 'This is a much longer excerpt that demonstrates how the component handles text overflow and line clamping in the hero section.',
    },
  },
};

export const Loading: Story = {
  args: {
    featuredArticle: undefined,
  },
};

export const NoImage: Story = {
  args: {
    featuredArticle: {
      ...mockArticles[0],
      featuredImage: '',
    },
  },
};