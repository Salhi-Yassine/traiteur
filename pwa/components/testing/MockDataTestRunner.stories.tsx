import type { Meta, StoryObj } from '@storybook/react';
import { MockDataTestRunner } from './MockDataTestRunner';

const meta: Meta<typeof MockDataTestRunner> = {
  title: 'Testing/MockDataTestRunner',
  component: MockDataTestRunner,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive test runner for validating the mock data system. Use this component to ensure all mock data functionality is working correctly.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MockDataTestRunner>;

export const Default: Story = {
  args: {
    autoRun: false,
    showHealthCheck: true,
  },
};

export const AutoRun: Story = {
  args: {
    autoRun: true,
    showHealthCheck: true,
  },
};

export const HealthCheckOnly: Story = {
  args: {
    autoRun: false,
    showHealthCheck: true,
  },
  render: (args) => (
    <div className="p-4">
      <MockDataTestRunner {...args} />
    </div>
  ),
};