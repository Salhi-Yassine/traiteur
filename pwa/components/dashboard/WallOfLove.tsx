import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { cn } from '@/lib/utils';

interface Greeting {
  id: number;
  author: string;
  message: string;
  avatar?: string;
  isAcknowledged: boolean;
  timeAgo: string;
}

interface WallOfLoveProps {
  greetings: Greeting[];
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
      <div className="p-8 sm:p-12 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-1">
          <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-neutral-300" />
        </div>
        <h3 className="font-display text-lg sm:text-xl text-neutral-900 mb-2">{t('dashboard.couple.wall_of_love.title')}</h3>
        <p className="text-sm text-neutral-500 max-w-[280px]">{t('dashboard.couple.wall_of_love.no_greetings')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2 sm:px-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl text-neutral-900">{t('dashboard.couple.wall_of_love.title')}</h2>
          <p className="text-sm text-neutral-500">{t('dashboard.couple.wall_of_love.subtitle')}</p>
        </div>
        <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500 hover:text-neutral-900">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-6 px-2 sm:px-4 scrollbar-hide snap-x">
          {greetings.map((greeting) => (
            <motion.div
              key={greeting.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="snap-start min-w-[280px] max-w-[280px] p-5 glass-card rounded-2xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-sm">
                    {greeting.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-neutral-900 leading-none">{greeting.author}</p>
                    <p className="text-xs text-neutral-500 mt-1">{greeting.timeAgo}</p>
                  </div>
                </div>
                <p className="text-[15px] text-neutral-700 italic leading-relaxed">
                  "{greeting.message}"
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
                  <button
                    onClick={() => handlePulse(greeting.id)}
                    disabled={greeting.isAcknowledged || pulsing === greeting.id}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black transition-all duration-300",
                      greeting.isAcknowledged || pulsing === greeting.id
                        ? "bg-primary text-white shadow-lg shadow-primary/25"
                        : "bg-neutral-100 text-neutral-600 hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    <Heart 
                      className={cn(
                        "w-3 h-3", 
                        (greeting.isAcknowledged || pulsing === greeting.id) && "fill-current"
                      )} 
                    />
                    {greeting.isAcknowledged || pulsing === greeting.id ? t('dashboard.couple.wall_of_love.pulse_sent') : t('dashboard.couple.wall_of_love.send_pulse')}
                  </button>
                
                {pulsing === greeting.id && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    className="absolute pointer-events-none"
                  >
                    <Heart className="w-48 h-48 text-primary fill-primary opacity-30" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
