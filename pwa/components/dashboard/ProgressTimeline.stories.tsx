import type { Meta, StoryObj } from '@storybook/react';
import { ProgressTimeline } from './ProgressTimeline';
import type { TimelineMilestone } from './types';

const MOCK_MILESTONES: TimelineMilestone[] = [
  { id: 3, title: 'Envoyer les faire-parts', dueDate: '2026-05-01', status: 'in_progress', isOverdue: false, relatedVendorCategory: 'faire-part' },
  { id: 4, title: 'Confirmer le photographe', dueDate: '2026-05-10', status: 'todo', isOverdue: false, relatedVendorCategory: 'photographe' },
  { id: 5, title: 'Essayage de la robe', dueDate: '2026-06-01', status: 'todo', isOverdue: false, relatedVendorCategory: 'robe' },
  { id: 6, title: 'Choisir le DJ', dueDate: '2026-06-15', status: 'todo', isOverdue: false, relatedVendorCategory: 'musique' },
  { id: 7, title: 'Organiser le transport', dueDate: '2026-07-01', status: 'todo', isOverdue: false, relatedVendorCategory: 'transport' },
];
const meta: Meta<typeof ProgressTimeline> = {
  title: 'Dashboard/ProgressTimeline',
  component: ProgressTimeline,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 900, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProgressTimeline>;

export const AllUpcoming: Story = {
  args: { milestones: MOCK_MILESTONES, completionPercent: 42 },
};

export const WithOverdue: Story = {
  args: {
    milestones: [
      {
        id: 1,
        title: 'Envoyer les faire-parts',
        dueDate: new Date(Date.now() - 5 * 86_400_000).toISOString().split('T')[0],
        status: 'in_progress',
        isOverdue: true,
      },
      {
        id: 2,
        title: 'Confirmer le photographe',
        dueDate: new Date(Date.now() + 3 * 86_400_000).toISOString().split('T')[0],
        status: 'todo',
        isOverdue: false,
      },
      ...MOCK_MILESTONES.slice(2),
    ],
    completionPercent: 42,
  },
};

export const Empty: Story = {
  args: { milestones: [], completionPercent: 0 },
};
