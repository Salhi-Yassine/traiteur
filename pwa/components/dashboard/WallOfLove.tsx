import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2 } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { cn } from '@/lib/utils';
import type { GreetingSummary } from './types';

interface WallOfLoveProps {
  greetings: GreetingSummary[];
  onPulse?: (id: number) => void;
}

export const WallOfLove: React.FC<WallOfLoveProps> = ({ greetings, onPulse }) => {
  const { t } = useTranslation('common');
  const [pulsing, setPulsing] = useState<number | null>(null);

  const handlePulse = (id: number) => {
    setPulsing(id);
    onPulse?.(id);
    setTimeout(() => setPulsing(null), 1000);
  };

  if (greetings.length === 0) {
    return (
      <div className="p-10 sm:p-14 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-1">
          <Heart className="w-10 h-10 text-neutral-300" />
        </div>
        <h3 className="font-display text-lg sm:text-xl text-neutral-900 mb-2">
          {t('dashboard.couple.wall_of_love.title')}
        </h3>
        <p className="text-sm text-neutral-500 max-w-[260px]">
          {t('dashboard.couple.wall_of_love.no_greetings')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl sm:text-2xl text-neutral-900">
            {t('dashboard.couple.wall_of_love.title')}
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            {t('dashboard.couple.wall_of_love.subtitle')}
          </p>
        </div>
        <button
          className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400 hover:text-neutral-700"
          aria-label="Share"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {greetings.map((greeting) => (
          <motion.div
            key={greeting.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="snap-start shrink-0 w-[280px] p-5 glass-card rounded-2xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Author row */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[--color-primary-light] flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {greeting.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={greeting.avatar} alt={greeting.author} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    greeting.author.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-neutral-900 leading-none truncate">
                    {greeting.author}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">{greeting.timeAgo}</p>
                </div>
              </div>

              {/* Message */}
              <p className="text-[15px] text-neutral-700 italic leading-relaxed line-clamp-4">
                &ldquo;{greeting.message}&rdquo;
              </p>
            </div>

            {/* Pulse action */}
            <div className="mt-5 pt-4 border-t border-neutral-100 relative">
              <button
                onClick={() => handlePulse(greeting.id)}
                disabled={greeting.isAcknowledged || pulsing === greeting.id}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black transition-all duration-300',
                  greeting.isAcknowledged || pulsing === greeting.id
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-primary/10 hover:text-primary'
                )}
              >
                <Heart
                  className={cn(
                    'w-3 h-3',
                    (greeting.isAcknowledged || pulsing === greeting.id) && 'fill-current'
                  )}
                />
                {greeting.isAcknowledged || pulsing === greeting.id
                  ? t('dashboard.couple.wall_of_love.pulse_sent')
                  : t('dashboard.couple.wall_of_love.pulse')}
              </button>

              {pulsing === greeting.id && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0.4 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <Heart className="w-12 h-12 text-primary fill-primary" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
