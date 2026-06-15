import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { cn } from '@/lib/utils';

interface DemoBannerProps {
  isDemo: boolean;
  className?: string;
}

export function DemoBanner({ isDemo, className }: DemoBannerProps) {
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
      ) : null}
    </div>
  );
}
