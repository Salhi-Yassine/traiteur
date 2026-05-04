import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { cn } from '@/lib/utils';

interface ZghRoutaScoreProps {
  completionPercent: number;
  brideName: string;
  className?: string;
}

function getMessageKey(percent: number): string {
  if (percent <= 20) return 'msg_starting';
  if (percent <= 40) return 'msg_momentum';
  if (percent <= 60) return 'msg_cruising';
  if (percent <= 80) return 'msg_final';
  return 'msg_ready';
}

const RADIUS = 36;
const STROKE = 6;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ZghRoutaScore({ completionPercent, brideName, className }: ZghRoutaScoreProps) {
  const { t } = useTranslation('common');
  const msgKey = getMessageKey(completionPercent);
  const dashOffset = CIRCUMFERENCE * (1 - completionPercent / 100);

  return (
    <div
      className={cn(
        'bg-gradient-to-br from-primary/5 to-primary/10 rounded-[--radius-2xl] p-6 border border-primary/20',
        className
      )}
    >
      {/* Eyebrow */}
      <p className="text-[11px] font-black uppercase tracking-widest text-primary mb-4">
        {t('dashboard.couple.zghr.eyebrow')}
      </p>

      <div className="flex items-center gap-5">
        {/* Donut ring */}
        <svg width="80" height="80" viewBox="0 0 80 80" className="shrink-0 -rotate-90">
          {/* Track */}
          <circle
            cx="40"
            cy="40"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            className="text-primary/15"
          />
          {/* Progress */}
          <circle
            cx="40"
            cy="40"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className="text-primary transition-all duration-700"
          />
          {/* Center text — rotate back to upright */}
          <text
            x="40"
            y="40"
            textAnchor="middle"
            dominantBaseline="central"
            className="rotate-90"
            style={{ transform: 'rotate(90deg)', transformOrigin: '40px 40px' }}
            fill="currentColor"
          >
            <tspan
              fontSize="16"
              fontWeight="900"
              fill="#E8472A"
              dy="0"
              x="40"
              y="36"
            >
              {completionPercent}%
            </tspan>
          </text>
        </svg>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-neutral-900 leading-snug">
            {brideName
              ? t('dashboard.couple.zghr.greeting', { name: brideName })
              : null}
          </p>
          <p className="text-base font-bold text-primary mt-1">
            {t(`dashboard.couple.zghr.${msgKey}`)}
          </p>
        </div>
      </div>

      {/* Footer link */}
      <Link
        href="/mariage/checklist"
        className="mt-4 flex items-center text-xs font-bold text-primary hover:underline"
      >
        {t('dashboard.couple.zghr.celebrate_link')}
      </Link>
    </div>
  );
}
