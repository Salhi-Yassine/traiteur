
export interface BudgetItemSummary {
  spentAmount: number;
}

export interface ChecklistTaskSummary {
  id: number;
  name: string;
  status: 'todo' | 'in_progress' | 'done';
  dueDate?: string;
  relatedVendorCategory?: string;
}


export interface WeddingDashboardProfile {
  id?: number;
  brideName?: string;
  groomName?: string;
  weddingDate?: string;
  weddingCity?: string;
  coverImage?: string;
  totalBudgetMad?: number;
  stylePersona?: string;
  quizResults?: Record<string, unknown> | null;
  budgetItems?: BudgetItemSummary[];
  guests?: unknown[];
  checklistTasks?: ChecklistTaskSummary[];
}

export interface TimelineMilestone {
  id: number;
  title: string;
  dueDate: string;
  status: 'todo' | 'in_progress' | 'done';
  isOverdue: boolean;
  relatedVendorCategory?: string;
}

export interface InspirationPhoto {
  id: number;
  url: string;
  labelKey: string;
  persona?: string;
}
