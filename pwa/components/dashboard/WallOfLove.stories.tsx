import type { Meta, StoryObj } from '@storybook/react';
import { WallOfLove } from './WallOfLove';
import { MOCK_GREETINGS } from './mock';

const meta: Meta<typeof WallOfLove> = {
  title: 'Dashboard/WallOfLove',
  component: WallOfLove,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof WallOfLove>;

export const WithGreetings: Story = {
  args: {
    greetings: MOCK_GREETINGS,
    onPulse: (id) => console.log('pulse', id),
  },
};

export const Empty: Story = {
  args: {
    greetings: [],
  },
};

export const AllAcknowledged: Story = {
  args: {
    greetings: MOCK_GREETINGS.map((g) => ({ ...g, isAcknowledged: true })),
  },
};
