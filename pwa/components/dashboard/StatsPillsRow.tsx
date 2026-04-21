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
    <div className="flex items-center gap-3 min-w-[150px] snap-start bg-white rounded-2xl shadow-1 px-5 py-4 shrink-0">
      <div className="w-10 h-10 rounded-xl bg-[--color-primary-light] flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xl font-black text-neutral-900 leading-none">{value}</p>
        <p className="text-[11px] font-semibold text-neutral-400 mt-1">{label}</p>
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
    <div className={cn('flex gap-3 overflow-x-auto scrollbar-hide snap-x pb-1', className)}>
      <Pill
        icon={<CalendarDays className="w-5 h-5" />}
        value={daysLeft !== null ? String(daysLeft) : '—'}
        label={t('dashboard.couple.stats.days')}
      />
      <Pill
        icon={<Banknote className="w-5 h-5" />}
        value={budgetFormatted}
        label={t('dashboard.couple.stats.budget')}
      />
      <Pill
        icon={<CheckSquare2 className="w-5 h-5" />}
        value={String(tasksLeft)}
        label={t('dashboard.couple.stats.tasks_left')}
      />
      <Pill
        icon={<Users className="w-5 h-5" />}
        value={String(guestsCount)}
        label={t('dashboard.couple.stats.guests')}
      />
    </div>
  );
}
