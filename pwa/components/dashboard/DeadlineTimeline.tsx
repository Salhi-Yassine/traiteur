import { useTranslation } from 'next-i18next';
import { cn } from '@/lib/utils';
import type { TimelineMilestone } from './types';

interface DeadlineTimelineProps {
  milestones: TimelineMilestone[];
  className?: string;
}

type Urgency = 'overdue' | 'this_week' | 'upcoming' | 'done';

function getUrgency(milestone: TimelineMilestone): Urgency {
  if (milestone.status === 'done') return 'done';
  if (milestone.isOverdue) return 'overdue';
  if (!milestone.dueDate) return 'upcoming';
  const daysUntil = Math.ceil(
    (new Date(milestone.dueDate).getTime() - Date.now()) / 86_400_000
  );
  return daysUntil <= 7 ? 'this_week' : 'upcoming';
}

const URGENCY_BAR: Record<Urgency, string> = {
  overdue: 'bg-[--color-danger]',
  this_week: 'bg-[--color-warning]',
  upcoming: 'bg-neutral-200',
  done: 'bg-[--color-success]',
};

const URGENCY_CHIP: Record<Urgency, string> = {
  overdue: 'bg-[--color-danger-bg] text-[--color-danger]',
  this_week: 'bg-[--color-warning-bg] text-[--color-warning]',
  upcoming: 'bg-neutral-100 text-neutral-500',
  done: 'bg-[--color-success-bg] text-[--color-success]',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-MA', { month: 'short', day: 'numeric' });
}

export function DeadlineTimeline({ milestones, className }: DeadlineTimelineProps) {
  const { t } = useTranslation('common');

  if (milestones.length === 0) return null;

  return (
    <div className={cn('space-y-3', className)}>
      <h2 className="text-sm font-black uppercase tracking-widest text-neutral-400">
        {t('dashboard.couple.timeline.title')}
      </h2>
      <div className="timeline-scroll">
        {milestones.map((milestone) => {
          const urgency = getUrgency(milestone);
          const urgencyLabel = t(`dashboard.couple.timeline.${urgency === 'this_week' ? 'this_week' : urgency}`);

          return (
            <div
              key={milestone.id}
              className="snap-start shrink-0 w-[180px] bg-white rounded-[--radius-xl] p-4 border border-neutral-100 shadow-1 card-hover relative overflow-hidden"
            >
              {/* Left accent bar */}
              <div className={cn('absolute start-0 inset-y-0 w-1', URGENCY_BAR[urgency])} />

              <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 ps-2">
                {milestone.dueDate ? formatDate(milestone.dueDate) : '—'}
              </p>
              <p className="text-sm font-semibold text-neutral-800 mt-1 line-clamp-2 ps-2">
                {milestone.title}
              </p>
              <div className="mt-3 ps-2">
                <span
                  className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full',
                    URGENCY_CHIP[urgency]
                  )}
                >
                  {urgencyLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
