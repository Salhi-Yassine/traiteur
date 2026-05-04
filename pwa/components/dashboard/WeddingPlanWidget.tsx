import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { CheckSquare2, Square, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { ChecklistTaskSummary } from './types';

interface WeddingPlanWidgetProps {
  tasks: ChecklistTaskSummary[];
  isLoading: boolean;
  onToggleTask?: (id: number) => void;
  elderMode?: boolean;
  className?: string;
}

type UrgencyLevel = 'overdue' | 'this_week' | 'upcoming';

function getUrgency(dueDate?: string): UrgencyLevel {
  if (!dueDate) return 'upcoming';
  const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / 86_400_000);
  return days < 0 ? 'overdue' : days <= 7 ? 'this_week' : 'upcoming';
}

function formatDue(dueDate: string): string {
  return new Date(dueDate).toLocaleDateString('fr-MA', { day: 'numeric', month: 'short' });
}

const BORDER_COLOR: Record<UrgencyLevel, string> = {
  overdue: 'border-s-[--color-danger]',
  this_week: 'border-s-[--color-warning]',
  upcoming: 'border-s-neutral-200',
};

const CHIP_COLOR: Record<UrgencyLevel, string> = {
  overdue: 'bg-[--color-danger-bg] text-[--color-danger]',
  this_week: 'bg-[--color-warning-bg] text-[--color-warning]',
  upcoming: 'bg-neutral-100 text-neutral-500',
};

export function WeddingPlanWidget({ tasks, isLoading, onToggleTask, elderMode, className }: WeddingPlanWidgetProps) {
  const { t } = useTranslation('common');

  const incomplete = tasks
    .filter((task) => task.status !== 'done')
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 3);

  const overdueCount = incomplete.filter((task) => task.dueDate && getUrgency(task.dueDate) === 'overdue').length;
  const tasksLeft = tasks.filter((task) => task.status !== 'done').length;

  return (
    <div className={cn('bg-white rounded-3xl shadow-1 p-6 space-y-5 border border-neutral-100/50', className)}>
      <div>
        <h3 className="font-display text-xl text-neutral-900">{t('dashboard.couple.plan_widget.title_new')}</h3>
        <p className="text-xs text-neutral-400 mt-1 font-semibold">
          {t('dashboard.couple.plan_widget.summary', { left: tasksLeft, overdue: overdueCount })}
        </p>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))
        ) : incomplete.length === 0 ? (
          <p className="text-sm text-neutral-400 text-center py-4">
            {t('dashboard.couple.plan_widget.no_tasks')}
          </p>
        ) : (
          incomplete.map((task) => {
            const urgency = getUrgency(task.dueDate);
            const urgencyLabelKey =
              urgency === 'overdue' ? 'dashboard.couple.plan_widget.overdue_label'
              : urgency === 'this_week' ? 'dashboard.couple.plan_widget.this_week_label'
              : 'dashboard.couple.plan_widget.upcoming_label';

            return (
              <div
                key={task.id}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-xl border-s-2 hover:bg-neutral-50 transition-colors',
                  BORDER_COLOR[urgency]
                )}
              >
                {onToggleTask ? (
                  <button
                    onClick={() => onToggleTask(task.id)}
                    aria-label={t('dashboard.couple.plan_widget.mark_done')}
                    className="shrink-0 mt-0.5 text-neutral-300 hover:text-primary transition-colors"
                  >
                    <Square className={cn('w-5 h-5', elderMode && 'w-6 h-6')} />
                  </button>
                ) : (
                  <CheckSquare2 className={cn('w-5 h-5 text-neutral-300 shrink-0 mt-0.5', elderMode && 'w-6 h-6')} />
                )}
                <div className="flex-1 min-w-0">
                  <p className={cn('font-semibold text-neutral-800 line-clamp-1', elderMode ? 'text-base' : 'text-sm')}>
                    {task.name}
                  </p>
                  {task.dueDate && (
                    <span className={cn('mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full', CHIP_COLOR[urgency])}>
                      {urgency !== 'upcoming'
                        ? t(urgencyLabelKey)
                        : formatDue(task.dueDate)}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <Link
        href="/mariage/checklist"
        className="flex items-center justify-between w-full pt-4 border-t border-neutral-100 text-sm font-bold text-primary hover:underline"
      >
        {t('dashboard.couple.plan_widget.see_all')}
        <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
      </Link>
    </div>
  );
}
