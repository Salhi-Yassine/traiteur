import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { CalendarHeart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroBannerProps {
  brideName: string;
  groomName: string;
  weddingDate?: string;
  coverImageUrl?: string;
  elderMode?: boolean;
  className?: string;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80';

function getDaysLeft(weddingDate: string): number {
  return Math.max(0, Math.ceil((new Date(weddingDate).getTime() - Date.now()) / 86_400_000));
}

function isValidUrl(url?: string): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
}

export function HeroBanner({ brideName, groomName, weddingDate, coverImageUrl, elderMode, className }: HeroBannerProps) {
  const { t } = useTranslation('common');
  const daysLeft = weddingDate ? getDaysLeft(weddingDate) : null;
  const resolvedImage = isValidUrl(coverImageUrl) ? coverImageUrl! : FALLBACK_IMAGE;

  return (
    <div className={cn('bg-[--color-primary-light] rounded-[--radius-2xl] overflow-hidden', className)}>
      <div className={cn(
        'grid gap-0',
        elderMode ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
      )}>
        {/* Text column */}
        <div className={cn(
          'flex flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-12 space-y-3 sm:space-y-4',
          elderMode && 'items-center text-center'
        )}>
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">
            {t('dashboard.couple.hero.eyebrow')}
          </span>

          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl text-neutral-900 leading-[1.1] tracking-tight">
            {brideName && groomName
              ? `${brideName} & ${groomName}`
              : brideName || groomName || '—'}
          </h1>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-1 border border-white/20">
              <CalendarHeart className="w-4 h-4 text-primary shrink-0" />
              {daysLeft !== null ? (
                <span className="text-sm font-black text-neutral-900">
                  {daysLeft}{' '}
                  <span className="text-xs font-semibold text-neutral-500">
                    {t('dashboard.couple.hero.days_to_go')}
                  </span>
                </span>
              ) : (
                <span className="text-xs font-semibold text-neutral-400">
                  {t('dashboard.couple.hero.no_date_set')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Image column — hidden in elder mode */}
        {!elderMode && (
          <div className="relative aspect-[16/9] md:aspect-auto md:min-h-[280px]">
            <Image
              src={resolvedImage}
              alt={`${brideName} & ${groomName}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {/* Subtle gradient to blend with text column */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[--color-primary-light] to-transparent md:inset-y-0 md:start-0 md:h-auto md:w-16 md:bg-gradient-to-r md:from-[--color-primary-light] md:to-transparent" />
          </div>
        )}
      </div>
    </div>
  );
}
