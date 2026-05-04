import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { cn } from '@/lib/utils';
import type { ViewMode } from './types';

interface DemoBannerProps {
  isDemo: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

const MODES: ViewMode[] = ['full', 'senior'];

export function DemoBanner({ isDemo, viewMode, onViewModeChange, className }: DemoBannerProps) {
  const { t } = useTranslation('common');

  return (
    <div className={cn('flex items-center justify-between gap-4 flex-wrap', className)}>
      {/* Left: demo indicator + login CTA */}
      {isDemo ? (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />
            {t('dashboard.couple.view_mode.demo_banner')}
          </div>
          <Link
            href="/auth/login"
            className="text-xs font-black text-primary hover:underline"
          >
            {t('dashboard.couple.view_mode.login_cta')}
          </Link>
        </div>
      ) : (
        <div />
      )}

      {/* Right: view mode toggle (full / senior only) */}
      <div className="flex bg-neutral-100 rounded-full p-1 gap-1">
        {MODES.map((mode) => (
          <button
            key={mode}
            onClick={() => onViewModeChange(mode)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
              viewMode === mode
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            )}
          >
            {t(`dashboard.couple.view_mode.${mode}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
