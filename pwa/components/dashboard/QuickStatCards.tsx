import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { cn } from '@/lib/utils';
import type { ChecklistTaskSummary } from './types';

// ─── Shared sub-components ────────────────────────────────────────────────────

interface ProgressBarProps {
  percent: number;
  className?: string;
}

function ProgressBar({ percent, className }: ProgressBarProps) {
  return (
    <div className={cn('h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden', className)}>
      <div
        className="h-full bg-primary rounded-full transition-all duration-700"
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  );
}

interface CardIconProps {
  children: React.ReactNode;
  variant?: 'primary' | 'neutral';
}

function CardIcon({ children, variant = 'primary' }: CardIconProps) {
  return (
    <div
      className={cn(
        'w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300',
        variant === 'primary'
          ? 'bg-[--color-primary-light] text-primary group-hover:bg-primary group-hover:text-white'
          : 'bg-neutral-100 text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white'
      )}
    >
      {children}
    </div>
  );
}

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'neutral';
}

function Badge({ label, variant = 'primary' }: BadgeProps) {
  return (
    <span
      className={cn(
        'text-[10px] font-black uppercase tracking-[0.18em] px-3 py-1 rounded-full shrink-0',
        variant === 'primary' ? 'text-primary bg-primary/10' : 'text-neutral-500 bg-neutral-100'
      )}
    >
      {label}
    </span>
  );
}

// ─── Budget Card ──────────────────────────────────────────────────────────────

interface BudgetCardProps {
  spent: number;
  total: number;
  elderMode?: boolean;
}

export function BudgetCard({ spent, total, elderMode }: BudgetCardProps) {
  const { t } = useTranslation('common');
  const percent = total > 0 ? (spent / total) * 100 : 0;

  return (
    <Link
      href="/mariage/budget"
      className="group card-hover bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8 flex flex-col gap-5 overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <CardIcon variant="primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </CardIcon>
        <Badge label={t('dashboard.couple.manage')} variant="primary" />
      </div>

      <div>
        <p className={cn(
          'font-display font-bold text-neutral-900 mb-3',
          elderMode ? 'text-2xl' : 'text-xl'
        )}>
          {t('nav.budget')}
        </p>
        <div className="flex items-baseline gap-1.5 flex-wrap mb-3">
          <span className={cn(
            'font-black text-neutral-900',
            elderMode ? 'text-3xl' : 'text-2xl sm:text-3xl'
          )}>
            {spent.toLocaleString('fr-MA')}
          </span>
          <span className="text-sm font-semibold text-neutral-500">
            / {total.toLocaleString('fr-MA')} MAD
          </span>
        </div>
        <ProgressBar percent={percent} />
      </div>
    </Link>
  );
}

// ─── Guests Card ──────────────────────────────────────────────────────────────

interface GuestsCardProps {
  count: number;
  elderMode?: boolean;
}

export function GuestsCard({ count, elderMode }: GuestsCardProps) {
  const { t } = useTranslation('common');

  return (
    <Link
      href="/mariage/invites"
      className="group card-hover bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8 flex flex-col gap-5 overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <CardIcon variant="primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </CardIcon>
        <Badge label={t('dashboard.couple.list')} variant="primary" />
      </div>

      <div>
        <p className={cn(
          'font-display font-bold text-neutral-900 mb-3',
          elderMode ? 'text-2xl' : 'text-xl'
        )}>
          {t('nav.guests')}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className={cn(
            'font-black text-neutral-900',
            elderMode ? 'text-3xl' : 'text-2xl sm:text-3xl'
          )}>
            {count}
          </span>
          <span className="text-sm font-semibold text-neutral-500">
            {t('dashboard.couple.guests_unit')}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Checklist Card ───────────────────────────────────────────────────────────

interface ChecklistCardProps {
  done: number;
  total: number;
  elderMode?: boolean;
}

export function ChecklistCard({ done, total, elderMode }: ChecklistCardProps) {
  const { t } = useTranslation('common');
  const percent = total > 0 ? (done / total) * 100 : 0;

  return (
    <Link
      href="/mariage/checklist"
      className="group card-hover bg-white rounded-3xl border border-neutral-100 p-6 lg:p-8 flex flex-col gap-5 overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <CardIcon variant="neutral">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </CardIcon>
        <Badge label={t('dashboard.couple.tasks')} variant="neutral" />
      </div>

      <div>
        <p className={cn(
          'font-display font-bold text-neutral-900 mb-3',
          elderMode ? 'text-2xl' : 'text-xl'
        )}>
          {t('nav.checklist')}
        </p>
        <div className="flex items-baseline gap-1.5 flex-wrap mb-3">
          <span className={cn(
            'font-black text-neutral-900',
            elderMode ? 'text-3xl' : 'text-2xl sm:text-3xl'
          )}>
            {done}
          </span>
          <span className="text-sm font-semibold text-neutral-500">
            {t('dashboard.couple.tasks_done', { count: total })}
          </span>
        </div>
        <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-neutral-900 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
      </div>
    </Link>
  );
}

// ─── Planning Overview Card ───────────────────────────────────────────────────

const DONUT_R = 36;
const DONUT_STROKE = 6;
const DONUT_CIRC = 2 * Math.PI * DONUT_R;

interface PlanningOverviewCardProps {
  tasksDone: number;
  tasksTotal: number;
  daysLeft: number | null;
  guestsCount: number;
  budgetSpent: number;
  budgetTotal: number;
  nextTask?: ChecklistTaskSummary;
  elderMode?: boolean;
}

export function PlanningOverviewCard({
  tasksDone,
  tasksTotal,
  daysLeft,
  guestsCount,
  budgetSpent,
  budgetTotal,
  nextTask,
  elderMode = false,
}: PlanningOverviewCardProps) {
  const { t } = useTranslation('common');
  const percent = tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 100) : 0;
  const dashOffset = DONUT_CIRC * (1 - percent / 100);

  return (
    <div className="bg-white rounded-[--radius-2xl] p-6 sm:p-8 border border-neutral-100 shadow-1">
      <p className="text-sm font-black text-neutral-900 mb-5">
        {t('dashboard.couple.planning_overview.title')}
      </p>

      <div className="flex items-start gap-6">
        {/* Donut ring */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          className="shrink-0 -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="40" cy="40" r={DONUT_R}
            fill="none" stroke="currentColor" strokeWidth={DONUT_STROKE}
            className="text-neutral-100"
          />
          <circle
            cx="40" cy="40" r={DONUT_R}
            fill="none" stroke="currentColor" strokeWidth={DONUT_STROKE}
            strokeLinecap="round"
            strokeDasharray={DONUT_CIRC}
            strokeDashoffset={dashOffset}
            className="text-primary transition-all duration-700"
          />
          <text
            x="40" y="40"
            textAnchor="middle"
            dominantBaseline="central"
            style={{ transform: 'rotate(90deg)', transformOrigin: '40px 40px' }}
          >
            <tspan fontSize="15" fontWeight="900" fill="#E8472A" x="40" y="39">{percent}%</tspan>
          </text>
        </svg>

        {/* Metric pills */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-full">
              {daysLeft !== null ? daysLeft : '—'}
              <span className="font-normal">{t('dashboard.couple.planning_overview.metric_days')}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-full">
              {guestsCount}
              <span className="font-normal">{t('dashboard.couple.planning_overview.metric_guests')}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-full">
              {budgetSpent.toLocaleString('fr-MA')}
              <span className="font-normal">/ {budgetTotal.toLocaleString('fr-MA')} MAD</span>
            </span>
          </div>

          {/* Next task */}
          {nextTask ? (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
                {t('dashboard.couple.planning_overview.next_task')}
              </p>
              <p className={cn('font-semibold text-neutral-800 truncate', elderMode ? 'text-base' : 'text-sm')}>
                {nextTask.name}
              </p>
              {nextTask.dueDate && (
                <span className="mt-1 inline-block text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                  {new Date(nextTask.dueDate).toLocaleDateString('fr-MA', { month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-neutral-500 italic">
              {t('dashboard.couple.planning_overview.no_next')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Quick Action Row ─────────────────────────────────────────────────────────

export function QuickActionRow() {
  const { t } = useTranslation('common');

  const actions = [
    { href: '/mariage/budget', label: t('nav.budget'), icon: '💰' },
    { href: '/mariage/invites', label: t('nav.guests'), icon: '👥' },
    { href: '/mariage/checklist', label: t('nav.checklist'), icon: '✅' },
  ] as const;

  return (
    <div className="grid grid-cols-3 gap-4">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="group card-hover bg-white rounded-[--radius-2xl] p-5 border border-neutral-100 flex flex-col items-center gap-2 text-center"
        >
          <span className="text-2xl">{action.icon}</span>
          <span className="text-xs font-bold text-neutral-700 group-hover:text-neutral-900 transition-colors">
            {action.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
