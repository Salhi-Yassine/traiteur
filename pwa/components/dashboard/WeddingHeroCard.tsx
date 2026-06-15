import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Users, Wallet, Sparkles } from 'lucide-react';
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
  className,
}: WeddingHeroCardProps) {
  const { t } = useTranslation('common');
  const daysLeft = getDaysLeft(weddingDate);
  const hasImage = !!coverImageUrl;


  return (
    <div
      className={cn(
        'relative bg-neutral-900 overflow-hidden text-white shadow-3',
        'rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 lg:p-16 mb-6',
        className
      )}
    >
      {/* Background Layer */}
      {hasImage ? (
        <>
          <Image
            src={coverImageUrl!}
            alt={`${brideName} & ${groomName}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[2px]" />
        </>
      ) : (
        <div className="absolute top-0 end-0 w-96 h-96 bg-primary/20 rounded-full -me-32 -mt-32 blur-3xl opacity-50 pointer-events-none" />
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-8">
        
        {/* Left Side: Names & Metadata */}
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-[13px] uppercase tracking-widest mb-3">
            <Sparkles size={16} />
            {t('dashboard.couple.hero.welcome_badge', 'VOTRE MARIAGE')}
          </div>
          
          <h1 className="font-display text-5xl md:text-6xl mb-6">
            {brideName} &amp; {groomName}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            {weddingCity && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-sm font-semibold">
                <MapPin size={16} className="text-white/70" />
                {weddingCity}
              </div>
            )}
            
            {guestsCount > 0 && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-sm font-semibold">
                <Users size={16} className="text-white/70" />
                {guestsCount}
              </div>
            )}

            {budgetTotal > 0 && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-sm font-semibold">
                <Wallet size={16} className="text-white/70" />
                {budgetTotal.toLocaleString('fr-MA')} MAD
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Countdown Card */}
        {daysLeft !== null && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-5 text-center flex-shrink-0 min-w-[160px]">
            <div className="text-5xl font-black text-primary mb-1">{daysLeft}</div>
            <div className="text-[11px] font-black uppercase tracking-widest text-white/60">
              {t('dashboard.couple.hero.days_label', 'Jours restants')}
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar Container */}
      <div className="relative z-10 mt-10">
        <div className="flex justify-between items-end mb-2">
          <p className="text-[11px] uppercase tracking-widest font-bold text-white/60">
            {t('dashboard.couple.hero.planning_progress', 'Avancement')}
          </p>
          <span className="text-sm font-black text-white">{completionPercent}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-md border border-white/10">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* isDemo setup CTA overlay */}
      {isDemo && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm rounded-[2rem] md:rounded-[3rem]">
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
