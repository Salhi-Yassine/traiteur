import Image from 'next/image';
import Link from 'next/link';
import { CalendarHeart } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { cn } from '@/lib/utils';

interface WeddingHeroCardProps {
  brideName: string;
  groomName: string;
  weddingDate?: string;
  weddingCity?: string;
  coverImageUrl?: string;
  budgetTotal: number;
  guestsCount: number;
  completionPercent: number;
  isDemo?: boolean;
  elderMode?: boolean;
  className?: string;
}

function getDaysLeft(weddingDate?: string): number | null {
  if (!weddingDate) return null;
  const days = Math.ceil((new Date(weddingDate).getTime() - Date.now()) / 86_400_000);
  return days >= 0 ? days : null;
}

export function WeddingHeroCard({
  brideName,
  groomName,
  weddingDate,
  weddingCity,
  coverImageUrl,
  budgetTotal,
  guestsCount,
  completionPercent,
  isDemo = false,
  elderMode = false,
  className,
}: WeddingHeroCardProps) {
  const { t } = useTranslation('common');
  const daysLeft = getDaysLeft(weddingDate);
  const hasImage = !!coverImageUrl && !elderMode;
  const textColor = hasImage ? 'text-white' : 'text-neutral-900';
  const subtextColor = hasImage ? 'text-white/70' : 'text-neutral-500';

  const metaParts: string[] = [];
  if (weddingCity) metaParts.push(weddingCity);
  if (guestsCount > 0) metaParts.push(t('dashboard.couple.hero.meta_guests', { count: guestsCount }));
  if (budgetTotal > 0) metaParts.push(`${budgetTotal.toLocaleString('fr-MA')} MAD`);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[--radius-3xl]',
        elderMode
          ? 'min-h-[200px] bg-[--color-primary-light]'
          : 'min-h-[320px] sm:min-h-[400px]',
        !hasImage && !elderMode && 'hero-gradient-fallback',
        className
      )}
    >
      {/* Cover image */}
      {hasImage && (
        <Image
          src={coverImageUrl!}
          alt={`${brideName} & ${groomName}`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 1200px"
        />
      )}

      {/* Gradient overlay (image only) */}
      {hasImage && (
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-neutral-900/20 to-transparent" />
      )}

      {/* Days countdown chip */}
      {daysLeft !== null && !elderMode && (
        <div className="absolute top-6 end-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-neutral-900 rounded-full px-4 py-2 shadow-2">
          <CalendarHeart className="w-4 h-4 text-primary shrink-0" />
          <span className="text-2xl font-black leading-none">{daysLeft}</span>
          <span className="text-xs font-semibold text-neutral-500 leading-tight">
            {t('dashboard.couple.hero.days_label')}
          </span>
        </div>
      )}

      {/* Main content */}
      <div
        className={cn(
          'relative z-10 flex flex-col justify-end h-full p-6 sm:p-10',
          elderMode && 'justify-center items-start'
        )}
        style={{ minHeight: elderMode ? 200 : undefined }}
      >
        {/* Names */}
        <h1
          className={cn(
            'font-display tracking-tight',
            elderMode ? 'text-4xl text-neutral-900' : 'text-3xl sm:text-5xl',
            textColor
          )}
        >
          {brideName} &amp; {groomName}
        </h1>

        {/* Meta row */}
        {metaParts.length > 0 && (
          <p className={cn('mt-2 text-sm sm:text-base font-medium', subtextColor)}>
            {metaParts.join(' · ')}
          </p>
        )}

        {/* Elder mode days */}
        {elderMode && daysLeft !== null && (
          <p className="mt-3 text-lg font-bold text-neutral-700">
            {t('dashboard.couple.hero.days_left', { count: daysLeft })}
          </p>
        )}
      </div>

      {/* Progress bar */}
      {!elderMode && (
        <div className="absolute bottom-0 start-0 end-0">
          <p className="text-[11px] uppercase tracking-widest pb-2 ps-6 font-bold text-white/60">
            {t('dashboard.couple.hero.planning_progress', { percent: completionPercent })}
          </p>
          <div className="h-1.5 bg-white/20">
            <div
              className="h-full bg-primary transition-all duration-700"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* isDemo setup CTA overlay */}
      {isDemo && !elderMode && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-neutral-900/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-[--radius-2xl] p-8 max-w-sm mx-4 text-center shadow-3">
            <p className="text-lg font-black text-neutral-900 mb-2">
              {t('dashboard.couple.hero.setup_cta_title')}
            </p>
            <p className="text-sm text-neutral-500 mb-6">
              {t('dashboard.couple.hero.setup_cta_desc')}
            </p>
            <Link
              href="/mariage/onboarding"
              className="inline-flex items-center justify-center bg-primary text-white font-black text-sm px-6 py-3 rounded-full hover:bg-primary-dark transition-colors"
            >
              {t('dashboard.couple.hero.setup_cta_btn')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
