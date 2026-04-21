import type { Meta, StoryObj } from '@storybook/react';
import { WeddingPlanWidget } from './WeddingPlanWidget';

const meta: Meta<typeof WeddingPlanWidget> = {
  title: 'Dashboard/WeddingPlanWidget',
  component: WeddingPlanWidget,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof WeddingPlanWidget>;

const futureDue = (days: number) =>
  new Date(Date.now() + days * 86_400_000).toISOString().split('T')[0];

const mockTasks = [
  { id: 1, name: 'Réserver la salle de mariage', status: 'todo', dueDate: futureDue(10) },
  { id: 2, name: 'Choisir le traiteur', status: 'todo', dueDate: futureDue(20) },
  { id: 3, name: 'Envoyer les invitations', status: 'todo', dueDate: futureDue(30) },
  { id: 4, name: 'Essayage robe', status: 'in_progress', dueDate: futureDue(45) },
  { id: 5, name: 'Confirmer le photographe', status: 'todo', dueDate: futureDue(55) },
  { id: 6, name: 'Régler le DJ', status: 'done' },
  { id: 7, name: 'Choisir le menu', status: 'done' },
];

export const WithTasks: Story = {
  args: {
    tasks: mockTasks,
    isLoading: false,
  },
};

export const AllDone: Story = {
  args: {
    tasks: mockTasks.map((t) => ({ ...t, status: 'done' })),
    isLoading: false,
  },
};

export const Empty: Story = {
  args: {
    tasks: [],
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    tasks: [],
    isLoading: true,
  },
};

export const ElderMode: Story = {
  args: {
    tasks: mockTasks,
    isLoading: false,
    elderMode: true,
  },
};
