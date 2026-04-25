import { useTranslation } from 'next-i18next';
import { CalendarDays, Banknote, CheckSquare2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsPillsRowProps {
  daysLeft: number | null;
  budgetTotal: number;
  tasksLeft: number;
  guestsCount: number;
  className?: string;
}

interface PillProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

function Pill({ icon, value, label }: PillProps) {
  return (
    <div className="flex items-center gap-2.5 min-w-[120px] sm:min-w-[140px] snap-start bg-white rounded-xl shadow-1 px-3 py-2 sm:px-4 sm:py-3 shrink-0 border border-neutral-100/50">
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[--color-primary-light] flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm sm:text-base font-black text-neutral-900 leading-none truncate">{value}</p>
        <p className="text-[10px] font-bold text-neutral-400 mt-0.5 truncate uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

export function StatsPillsRow({ daysLeft, budgetTotal, tasksLeft, guestsCount, className }: StatsPillsRowProps) {
  const { t } = useTranslation('common');

  const budgetFormatted = budgetTotal > 0
    ? `${budgetTotal.toLocaleString('fr-MA')} MAD`
    : '—';

  return (
    <div className={cn('flex gap-3 overflow-x-auto scrollbar-hide snap-x pb-1 after:content-[\'\'] after:w-4 after:shrink-0', className)}>
      <Pill
        icon={<CalendarDays className="w-4 h-4" />}
        value={daysLeft !== null ? String(daysLeft) : '—'}
        label={t('dashboard.couple.stats.days')}
      />
      <Pill
        icon={<Banknote className="w-4 h-4" />}
        value={budgetFormatted}
        label={t('dashboard.couple.stats.budget')}
      />
      <Pill
        icon={<CheckSquare2 className="w-4 h-4" />}
        value={String(tasksLeft)}
        label={t('dashboard.couple.stats.tasks_left')}
      />
      <Pill
        icon={<Users className="w-4 h-4" />}
        value={String(guestsCount)}
        label={t('dashboard.couple.stats.guests')}
      />
    </div>
  );
}
