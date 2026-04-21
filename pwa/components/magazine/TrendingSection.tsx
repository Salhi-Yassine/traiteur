import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const BLUR_PLACEHOLDER = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

interface TrendingItem {
  id: number;
  title: string;
  category: string;
  slug: string;
}

interface TrendingSectionProps {
  items?: TrendingItem[];
  className?: string;
}

const DEFAULT_ITEMS: TrendingItem[] = [
  { id: 1, title: "10 astuces pour un cortège royal sans stress", category: "Planning", slug: "astuces-cortege" },
  { id: 2, title: "L'art du henné : Tendances 2026 au Maroc", category: "Tradition", slug: "tendances-henne" },
  { id: 3, title: "Pourquoi choisir Marrakech pour son mariage ?", category: "Destination", slug: "mariage-marrakech" },
  { id: 4, title: "Le guide du caftan moderne pour les mariées", category: "Fashion", slug: "caftan-moderne" },
];

export default function TrendingSection({ items = DEFAULT_ITEMS, className }: TrendingSectionProps) {
  const { t } = useTranslation('common');

  return (
    <div className={cn("bg-neutral-900 rounded-[3rem] px-8 py-16 md:py-24 relative overflow-hidden", className)}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -mr-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-12 px-4 md:px-0">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-display text-4xl text-white leading-tight">
                {t('magazine.trending_now')}
              </h2>
              <p className="text-white/50 text-15 mt-2">
                {t('magazine.trending_subtitle')}
              </p>
            </div>
          </div>
          <Link 
            href="/magazine" 
            className="hidden md:flex items-center gap-3 text-white/70 hover:text-white transition-colors group"
          >
            <span className="text-14 font-black uppercase tracking-widest">{t('common.view_all')}</span>
            <ArrowRight className="w-16 h-16 group-hover:translate-x-4 transition-transform rtl:rotate-180" />
          </Link>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x-mandatory px-4 md:px-0">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="snap-item min-w-[300px] md:min-w-[400px] bg-white/5 backdrop-blur-sm border border-white/10 p-10 md:p-14 rounded-3xl group hover:bg-white/10 transition-all duration-500"
            >
              <Link href={`/magazine/${item.slug}`} className="flex flex-col justify-between h-full space-y-12">
                <div className="space-y-4">
                  <span className="text-primary text-[10px] font-black uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                  <h3 className="font-display text-24 md:text-28 text-white leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>
                <div className="flex items-center justify-between pt-8 border-t border-white/10">
                  <span className="text-white/40 text-13">Trending • {idx + 1}</span>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
