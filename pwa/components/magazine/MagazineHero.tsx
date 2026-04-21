import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const BLUR_PLACEHOLDER = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

interface MagazineHeroProps {
  article: {
    title: string;
    excerpt?: string;
    slug: string;
    featuredImage?: string;
    category: { name: string; slug: string };
    publishedAt?: string;
    readingTimeMinutes?: number;
  };
  className?: string;
}

export default function MagazineHero({ article, className }: MagazineHeroProps) {
  const { t } = useTranslation('common');

  return (
    <section className={cn("relative h-[70vh] md:h-[85vh] w-full overflow-hidden rounded-[3rem] shadow-3", className)}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={article.featuredImage || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=2000'} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-1000 scale-105"
        />
        <div className="absolute inset-0 bg-black/40 editorial-gradient" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-24 lg:p-32 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="max-w-3xl space-y-8"
        >
          <div className="flex flex-wrap items-center gap-6">
            <span className="px-5 py-2 bg-primary text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-full">
              {article.category.name}
            </span>
            <div className="flex items-center gap-2 text-white/80 text-[13px] font-medium">
              <Calendar className="w-16 h-16" />
              {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Nouveauté'}
            </div>
            <div className="flex items-center gap-2 text-white/80 text-[13px] font-medium">
              <Clock className="w-16 h-16" />
              {article.readingTimeMinutes || 5} min read
            </div>
          </div>

          <h1 className="font-display text-48 md:text-64 lg:text-84 text-white leading-[1.05] tracking-tight text-balance">
            {article.title}
          </h1>

          <p className="text-white/80 text-18 md:text-20 leading-relaxed max-w-2xl line-clamp-3 md:line-clamp-none">
            {article.excerpt}
          </p>

          <div className="pt-6">
            <Link 
              href={`/magazine/${article.slug}`}
              className="inline-flex items-center justify-center px-10 h-20 bg-white text-neutral-900 rounded-full text-[16px] font-black hover:scale-105 transition-all shadow-xl shadow-black/20 group"
            >
              {t('magazine.read_article')}
              <ArrowRight className="ml-8 w-20 h-20 group-hover:translate-x-4 transition-transform rtl:rotate-180" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Aesthetic Decoration */}
      <div className="absolute top-12 right-12 hidden md:block">
        <div className="w-100 h-100 border border-white/20 rounded-full flex items-center justify-center rotate-12">
            <span className="text-white/20 text-[10px] font-black uppercase tracking-widest leading-none text-center">
                Farah<br/>Magazine<br/>2026
            </span>
        </div>
      </div>
    </section>
  );
}
