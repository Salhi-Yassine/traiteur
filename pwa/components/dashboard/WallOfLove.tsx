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
      <div className="p-24 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col items-center justify-center text-center">
        <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center mb-16 shadow-1">
          <Heart className="w-24 h-24 text-neutral-300" />
        </div>
        <h3 className="font-display text-18 text-neutral-900 mb-4">{t('dashboard.couple.wall_of_love.title')}</h3>
        <p className="text-14 text-neutral-500 max-w-[280px]">{t('dashboard.couple.wall_of_love.no_greetings')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <div className="flex items-center justify-between px-4">
        <div>
          <h2 className="font-display text-20 text-neutral-900">{t('dashboard.couple.wall_of_love.title')}</h2>
          <p className="text-14 text-neutral-500">{t('dashboard.couple.wall_of_love.subtitle')}</p>
        </div>
        <button className="p-8 hover:bg-neutral-100 rounded-full transition-colors">
          <Share2 className="w-18 h-18 text-neutral-700" />
        </button>
      </div>

      <div className="relative">
        <div className="flex gap-16 overflow-x-auto pb-16 px-4 scrollbar-hide snap-x">
          {greetings.map((greeting) => (
            <motion.div
              key={greeting.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="snap-start min-w-[280px] max-w-[280px] p-20 glass-card rounded-2xl flex flex-col justify-between"
            >
              <div className="space-y-12">
                <div className="flex items-center gap-10">
                  <div className="w-32 h-32 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-12">
                    {greeting.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-14 font-bold text-neutral-900 leading-none">{greeting.author}</p>
                    <p className="text-11 text-neutral-500 mt-2">{greeting.timeAgo}</p>
                  </div>
                </div>
                <p className="text-14 text-neutral-700 italic leading-relaxed">
                  "{greeting.message}"
                </p>
              </div>

              <div className="mt-20 flex items-center justify-between border-t border-white/30 pt-12">
                <button
                  onClick={() => handlePulse(greeting.id)}
                  disabled={greeting.isAcknowledged || pulsing === greeting.id}
                  className={cn(
                    "flex items-center gap-6 px-12 py-6 rounded-full text-12 font-bold transition-all duration-500",
                    greeting.isAcknowledged || pulsing === greeting.id
                      ? "bg-primary text-white"
                      : "bg-white/50 text-neutral-700 hover:bg-white hover:shadow-1"
                  )}
                >
                  <Heart 
                    className={cn(
                      "w-14 h-14", 
                      (greeting.isAcknowledged || pulsing === greeting.id) && "fill-current"
                    )} 
                  />
                  {greeting.isAcknowledged || pulsing === greeting.id ? t('dashboard.couple.wall_of_love.pulse_sent') : t('dashboard.couple.wall_of_love.pulse')}
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
