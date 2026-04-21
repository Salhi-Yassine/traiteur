import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const PHOTOS = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    labelKey: 'dashboard.couple.inspiration.photo_1',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
    labelKey: 'dashboard.couple.inspiration.photo_2',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80',
    labelKey: 'dashboard.couple.inspiration.photo_3',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
    labelKey: 'dashboard.couple.inspiration.photo_4',
  },
];

interface InspirationGalleryProps {
  className?: string;
}

export function InspirationGallery({ className }: InspirationGalleryProps) {
  const { t } = useTranslation('common');

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl text-neutral-900">{t('dashboard.couple.inspiration.title')}</h2>
          <p className="text-sm text-neutral-500 mt-1">{t('dashboard.couple.inspiration.subtitle')}</p>
        </div>
        <Link
          href="/inspiration"
          className="flex items-center gap-1 text-sm font-bold text-primary hover:underline shrink-0"
        >
          {t('dashboard.couple.inspiration.view_all')}
          <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
        </Link>
      </div>

      <div className="columns-2 md:columns-3 gap-3 space-y-3">
        {PHOTOS.map((photo) => (
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
              <p className="absolute bottom-3 start-3 end-3 text-white text-xs font-semibold leading-tight drop-shadow-sm">
                {t(photo.labelKey)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
