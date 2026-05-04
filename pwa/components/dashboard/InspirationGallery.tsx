import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Heart, Wand2 } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { cn } from '@/lib/utils';
import { PERSONA_PHOTO_MAP } from './mock';

interface InspirationGalleryProps {
  stylePersona?: string;
  isDemo?: boolean;
  className?: string;
}

export function InspirationGallery({ stylePersona, isDemo: _isDemo = false, className }: InspirationGalleryProps) {
  const { t } = useTranslation('common');
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());

  const photos = stylePersona
    ? (PERSONA_PHOTO_MAP[stylePersona] ?? PERSONA_PHOTO_MAP['default'])
    : PERSONA_PHOTO_MAP['default'];

  const toggleLike = (id: number) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const titleKey = stylePersona
    ? 'dashboard.couple.style_board.title_with_persona'
    : 'dashboard.couple.style_board.title';

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl text-neutral-900">
            {stylePersona
              ? t(titleKey, { persona: stylePersona })
              : t(titleKey)}
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            {t('dashboard.couple.inspiration.subtitle')}
          </p>
        </div>
        <Link
          href="/inspiration"
          className="flex items-center gap-1 text-sm font-bold text-primary hover:underline shrink-0"
        >
          {t('dashboard.couple.style_board.view_all')}
          <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
        </Link>
      </div>

      {/* Quiz CTA card — shown when no persona set */}
      {!stylePersona && (
        <div className="bg-neutral-900 text-white rounded-[--radius-2xl] p-6 flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Wand2 className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base">
              {t('dashboard.couple.style_board.quiz_cta_title')}
            </p>
            <p className="text-sm text-neutral-400 mt-1 mb-4">
              {t('dashboard.couple.style_board.quiz_cta_desc')}
            </p>
            <Link
              href="/inspiration/quiz"
              className="inline-flex items-center gap-2 text-sm font-black text-white bg-primary px-4 py-2 rounded-full hover:bg-primary-dark transition-colors"
            >
              {t('dashboard.couple.style_board.quiz_cta_btn')}
            </Link>
          </div>
        </div>
      )}

      {/* Photo grid */}
      <div className="columns-2 md:columns-3 gap-3 space-y-3">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="break-inside-avoid relative rounded-[--radius-lg] overflow-hidden group cursor-pointer"
          >
            <div className="relative w-full" style={{ paddingBottom: photo.id % 2 === 0 ? '130%' : '80%' }}>
              <Image
                src={photo.url}
                alt={t(photo.labelKey)}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              {/* Label */}
              <p className="absolute bottom-3 start-3 end-10 text-white text-xs font-semibold leading-tight drop-shadow-sm">
                {t(photo.labelKey)}
              </p>
              {/* Heart button */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleLike(photo.id); }}
                aria-label={likedIds.has(photo.id) ? 'Unlike' : 'Like'}
                className={cn(
                  'absolute top-2 end-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all duration-200',
                  'opacity-0 group-hover:opacity-100',
                  likedIds.has(photo.id) && 'opacity-100'
                )}
              >
                <Heart
                  className={cn(
                    'w-4 h-4 transition-colors',
                    likedIds.has(photo.id) ? 'text-primary fill-primary' : 'text-neutral-600'
                  )}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
