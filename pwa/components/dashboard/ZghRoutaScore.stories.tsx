import type { Meta, StoryObj } from '@storybook/react';
import { ZghRoutaScore } from './ZghRoutaScore';

const meta: Meta<typeof ZghRoutaScore> = {
  title: 'Dashboard/ZghRoutaScore',
  component: ZghRoutaScore,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 380, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ZghRoutaScore>;

export const Starting: Story = {
  args: { completionPercent: 10, brideName: 'Yasmine' },
};

export const Momentum: Story = {
  args: { completionPercent: 30, brideName: 'Sara' },
};

export const Cruising: Story = {
  args: { completionPercent: 55, brideName: 'Yasmine' },
};

export const FinalStretch: Story = {
  args: { completionPercent: 75, brideName: 'Leila' },
};

export const Ready: Story = {
  args: { completionPercent: 95, brideName: 'Nadia' },
};
