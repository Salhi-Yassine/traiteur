export type ViewMode = 'full' | 'planning' | 'senior';

export interface BudgetItemSummary {
  spentAmount: number;
}

export interface ChecklistTaskSummary {
  id: number;
  name: string;
  status: 'todo' | 'in_progress' | 'done';
  dueDate?: string;
}

export interface GreetingSummary {
  id: number;
  author: string;
  message: string;
  avatar?: string;
  isAcknowledged: boolean;
  timeAgo: string;
}

export interface WeddingDashboardProfile {
  id?: number;
  brideName?: string;
  groomName?: string;
  weddingDate?: string;
  coverImage?: string;
  totalBudgetMad?: number;
  stylePersona?: string;
  quizResults?: Record<string, unknown> | null;
  budgetItems?: BudgetItemSummary[];
  guests?: unknown[];
  checklistTasks?: ChecklistTaskSummary[];
}

export interface ConsensusData {
  score: number;
  sharedStyles: string[];
}
