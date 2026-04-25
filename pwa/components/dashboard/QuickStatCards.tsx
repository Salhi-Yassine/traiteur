import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { cn } from '@/lib/utils';

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
          <span className="text-sm font-semibold text-[#717171]">
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
          <span className="text-sm font-semibold text-[#717171]">
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
          <span className="text-sm font-semibold text-[#717171]">
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

// ─── Website Card ─────────────────────────────────────────────────────────────

interface WebsiteCardProps {
  elderMode?: boolean;
  className?: string;
}

export function WebsiteCard({ elderMode, className }: WebsiteCardProps) {
  const { t } = useTranslation('common');

  return (
    <Link
      href="/mariage/site"
      className={cn(
        'group card-hover bg-neutral-900 text-white rounded-3xl border border-neutral-800 p-6 lg:p-8 relative overflow-hidden',
        className
      )}
    >
      {/* Decorative glow */}
      <div className="absolute top-0 end-0 w-48 h-48 bg-primary/15 rounded-full -me-16 -mt-16 blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-2 max-w-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">
              {t('dashboard.couple.website')}
            </span>
          </div>
          <p className={cn(
            'font-display font-bold leading-tight',
            elderMode ? 'text-2xl' : 'text-xl sm:text-2xl'
          )}>
            {t('dashboard.couple.my_website')}
          </p>
          <p className="text-neutral-400 text-sm leading-relaxed">
            {t('dashboard.couple.website_desc')}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ─── Composite grid ───────────────────────────────────────────────────────────

interface QuickStatGridProps {
  budgetSpent: number;
  budgetTotal: number;
  guestsCount: number;
  tasksDone: number;
  tasksTotal: number;
  elderMode?: boolean;
}

export function QuickStatGrid({
  budgetSpent,
  budgetTotal,
  guestsCount,
  tasksDone,
  tasksTotal,
  elderMode = false,
}: QuickStatGridProps) {
  return (
    <div className={cn(
      'grid gap-4',
      elderMode
        ? 'grid-cols-1 sm:grid-cols-2'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    )}>
      <BudgetCard spent={budgetSpent} total={budgetTotal} elderMode={elderMode} />
      <GuestsCard count={guestsCount} elderMode={elderMode} />
      <ChecklistCard done={tasksDone} total={tasksTotal} elderMode={elderMode} />
      <WebsiteCard
        elderMode={elderMode}
        className={elderMode ? 'sm:col-span-2' : 'sm:col-span-2 lg:col-span-3'}
      />
    </div>
  );
}
