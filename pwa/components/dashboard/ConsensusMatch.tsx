import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { cn } from '@/lib/utils';

interface ConsensusMatchProps {
  score: number;
  sharedStyles: string[];
  className?: string;
}

export const ConsensusMatch: React.FC<ConsensusMatchProps> = ({ score, sharedStyles, className }) => {
  const { t } = useTranslation('common');

  // Logic to determine feedback text based on score
  const getFeedback = (s: number) => {
    if (s >= 90) return t('dashboard.couple.consensus_match.perfect_match');
    return t('dashboard.couple.consensus_match.complementary');
  };

  return (
    <div className={cn(
      "p-6 sm:p-8 bg-white rounded-[2.5rem] border border-neutral-100 shadow-1 relative overflow-hidden group",
      className
    )}>
      {/* Background Decorative Pattern (Subtle) */}
      <div className="absolute top-0 right-0 p-4 sm:p-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500">
        <Sparkles className="w-24 h-24 sm:w-48 sm:h-48 text-primary" />
      </div>

      <div className="relative z-10 space-y-6 sm:space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary-light flex items-center justify-center text-primary shadow-sm">
            <Users className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h3 className="font-display text-lg text-neutral-900">{t('dashboard.couple.consensus_match.title')}</h3>
            <p className="text-sm text-neutral-500">{t('dashboard.couple.consensus_match.subtitle')}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
            {/* Circular Progress (SVG) */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-neutral-100"
              />
              <motion.circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="6"
                strokeDasharray={226}
                initial={{ strokeDashoffset: 226 }}
                animate={{ strokeDashoffset: 226 - (226 * score) / 100 }}
                fill="transparent"
                strokeLinecap="round"
                className="text-primary"
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base sm:text-xl font-black text-neutral-900">{score}%</span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <p className="text-sm font-bold text-primary italic">
              {getFeedback(score)}
            </p>
            <p className="text-xs text-neutral-500">
              {t('dashboard.couple.consensus_match.match_score', { score })}
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
            {t('dashboard.couple.consensus_match.shared_styles')}
          </p>
          <div className="flex flex-wrap gap-2">
            {sharedStyles.map((style, idx) => (
              <motion.span
                key={style}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="px-3 py-1 bg-neutral-100 rounded-full text-xs text-neutral-700 font-medium border border-neutral-200"
              >
                {style}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
