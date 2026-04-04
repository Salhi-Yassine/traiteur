import type { Meta, StoryObj } from '@storybook/react';
import AvailabilityCalendar from './AvailabilityCalendar';

const meta = {
  title: 'Components/Vendors/AvailabilityCalendar',
  component: AvailabilityCalendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '800px', maxWidth: '100vw', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AvailabilityCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockBookedDates = [
  '2026-04-12',
  '2026-04-13',
  '2026-04-25',
  '2026-05-02',
  '2026-05-15',
];

export const Default: Story = {
  args: {
    bookedDates: mockBookedDates,
    variant: 'default',
  },
};

export const Compact: Story = {
  args: {
    bookedDates: mockBookedDates,
    variant: 'compact',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '380px' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithPreselectedRange: Story = {
  args: {
    bookedDates: mockBookedDates,
    variant: 'default',
    range: {
      from: '2026-04-15',
      to: '2026-04-18',
    },
  },
};

export const RTL: Story = {
  decorators: [
    (Story) => (
      <div dir="rtl" lang="ar" style={{ width: '800px', maxWidth: '100vw', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    bookedDates: mockBookedDates,
    variant: 'default',
    range: {
      from: '2026-04-15',
      to: '2026-04-18',
    },
  },
};
