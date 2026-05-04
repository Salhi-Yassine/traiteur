import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { cn } from '@/lib/utils';
import type { GreetingSummary } from './types';

interface WallOfLoveProps {
  greetings: GreetingSummary[];
  totalCount?: number;
  unreadCount?: number;
  rsvpLink?: string;
  onPulse?: (id: number) => void;
}

export const WallOfLove: React.FC<WallOfLoveProps> = ({
  greetings,
  totalCount,
  unreadCount,
  rsvpLink,
  onPulse,
}) => {
  const { t } = useTranslation('common');
  const [pulsing, setPulsing] = useState<number | null>(null);

  const handlePulse = (id: number) => {
    setPulsing(id);
    onPulse?.(id);
    setTimeout(() => setPulsing(null), 1000);
  };

  if (greetings.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-[--color-primary-light] rounded-full flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-primary" />
        </div>
        <h3 className="font-display text-lg sm:text-xl text-neutral-900 mb-2">
          {t('dashboard.couple.wall_of_love.empty_title')}
        </h3>
        <p className="text-sm text-neutral-500 max-w-[260px] mb-6">
          {t('dashboard.couple.wall_of_love.empty_desc')}
        </p>
        <Link
          href={rsvpLink ?? '/mariage/site'}
          className="inline-flex items-center gap-2 bg-primary text-white font-black text-sm px-6 py-3 rounded-full hover:bg-primary-dark transition-colors"
        >
          {t('dashboard.couple.wall_of_love.share_rsvp')}
        </Link>
      </div>
    );
  }

  const displayTotal = totalCount ?? greetings.length;
  const displayUnread = unreadCount ?? greetings.filter((g) => !g.isAcknowledged).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl sm:text-2xl text-neutral-900">
            {t('dashboard.couple.wall_of_love.title')}
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            {t('dashboard.couple.wall_of_love.stats', {
              total: displayTotal,
              unread: displayUnread,
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {greetings.map((greeting) => (
          <motion.div
            key={greeting.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 glass-card rounded-2xl flex flex-col justify-between"
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
              <p className="text-[15px] text-neutral-700 italic leading-relaxed">
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
