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
      "p-24 bg-white rounded-2xl border border-neutral-100 shadow-1 relative overflow-hidden group",
      className
    )}>
      {/* Background Decorative Pattern (Subtle) */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500">
        <Sparkles className="w-80 h-80 text-primary" />
      </div>

      <div className="relative z-10 space-y-20">
        <div className="flex items-center gap-12">
          <div className="w-40 h-40 rounded-full bg-primary-light flex items-center justify-center text-primary">
            <Users className="w-20 h-20" />
          </div>
          <div>
            <h3 className="font-display text-18 text-neutral-900">{t('dashboard.couple.consensus_match.title')}</h3>
            <p className="text-13 text-neutral-500">{t('dashboard.couple.consensus_match.subtitle')}</p>
          </div>
        </div>

        <div className="flex items-end gap-16">
          <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Circular Progress (SVG) */}
            <svg className="w-full h-full transform -rotate-90">
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
              <span className="text-20 font-black text-neutral-900">{score}%</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 pb-4">
            <p className="text-14 font-bold text-primary italic">
              {getFeedback(score)}
            </p>
            <p className="text-12 text-neutral-500">
              {t('dashboard.couple.consensus_match.match_score', { score })}
            </p>
          </div>
        </div>

        <div className="space-y-10">
          <p className="text-11 font-black uppercase tracking-widest text-neutral-400">
            {t('dashboard.couple.consensus_match.shared_styles')}
          </p>
          <div className="flex flex-wrap gap-8">
            {sharedStyles.map((style, idx) => (
              <motion.span
                key={style}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="px-12 py-6 bg-neutral-100 rounded-full text-12 text-neutral-700 font-medium border border-neutral-200"
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
