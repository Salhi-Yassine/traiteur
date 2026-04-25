import { useTranslation } from 'next-i18next';
import { cn } from '@/lib/utils';
import type { ViewMode } from './types';

interface ViewModeSelectorProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  className?: string;
}

const MODES: ViewMode[] = ['full', 'planning', 'senior'];

export function ViewModeSelector({ value, onChange, className }: ViewModeSelectorProps) {
  const { t } = useTranslation('common');

  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4', className)}>
      <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
        {t('dashboard.couple.view_mode.label')}
      </span>
      <div className="flex bg-neutral-100 rounded-full p-1 gap-1">
        {MODES.map((mode) => (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
              value === mode
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
