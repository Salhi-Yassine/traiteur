import type { Meta, StoryObj } from '@storybook/react';
import ReservationWidget from './ReservationWidget';

const meta = {
  title: 'Components/Vendors/ReservationWidget',
  component: ReservationWidget,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '400px', maxWidth: '100vw', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReservationWidget>;

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
    vendorId: 1,
    vendorName: 'Palais des Roses',
    priceRange: 'MADMADMAD',
    bookedDates: mockBookedDates,
  },
};

export const WithPreselectedRange: Story = {
  args: {
    vendorId: 1,
    vendorName: 'Palais des Roses',
    priceRange: 'MADMADMAD',
    bookedDates: mockBookedDates,
    range: {
      from: '2026-04-15',
      to: '2026-04-18',
    },
  },
};

export const RTL: Story = {
  decorators: [
    (Story) => (
      <div dir="rtl" lang="ar" style={{ width: '400px', maxWidth: '100vw', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    vendorId: 1,
    vendorName: 'Palais des Roses',
    priceRange: 'MADMADMAD',
    bookedDates: mockBookedDates,
    range: {
      from: '2026-04-15',
      to: '2026-04-18',
    },
  },
};
