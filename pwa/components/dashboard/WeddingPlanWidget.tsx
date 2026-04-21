import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { CheckSquare2, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface Task {
  id: number;
  name: string;
  status: string;
  dueDate?: string;
}

interface WeddingPlanWidgetProps {
  tasks: Task[];
  isLoading: boolean;
  elderMode?: boolean;
  className?: string;
}

function formatDue(dueDate: string): string {
  const d = new Date(dueDate);
  return d.toLocaleDateString('fr-MA', { day: 'numeric', month: 'short' });
}

export function WeddingPlanWidget({ tasks, isLoading, elderMode, className }: WeddingPlanWidgetProps) {
  const { t } = useTranslation('common');

  const incomplete = tasks
    .filter((t) => t.status !== 'done')
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 5);

  const totalDone = tasks.filter((t) => t.status === 'done').length;
  const total = tasks.length;
  const percent = total > 0 ? Math.round((totalDone / total) * 100) : 0;

  return (
    <div className={cn('bg-white rounded-[--radius-2xl] shadow-1 p-8 space-y-6', className)}>
      <div className="space-y-3">
        <h3 className="font-display text-xl text-neutral-900">{t('dashboard.couple.plan_widget.title')}</h3>

        {!elderMode && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-neutral-500">
                {t('dashboard.couple.plan_widget.progress', { done: totalDone, total })}
              </span>
              <span className="text-xs font-black text-primary">{percent}%</span>
            </div>
            <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
              {/* Dynamic width — inline style is correct here */}
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
          ))
        ) : incomplete.length === 0 ? (
          <p className="text-sm text-neutral-400 text-center py-4">
            {t('dashboard.couple.plan_widget.no_tasks')}
          </p>
        ) : (
          incomplete.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              <CheckSquare2 className="w-5 h-5 text-neutral-300 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-800 line-clamp-1">{task.name}</p>
                {task.dueDate && (
                  <p className="text-xs text-neutral-400 mt-0.5">{formatDue(task.dueDate)}</p>
                )}
              </div>
            </div>
          ))
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
