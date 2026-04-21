import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  {
    slug: 'decoration',
    labelKey: 'dashboard.couple.milestones.decoration',
    imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80',
  },
  {
    slug: 'photographe',
    labelKey: 'dashboard.couple.milestones.photographe',
    imageUrl: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80',
  },
  {
    slug: 'traiteur',
    labelKey: 'dashboard.couple.milestones.traiteur',
    imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80',
  },
  {
    slug: 'negafa',
    labelKey: 'dashboard.couple.milestones.negafa',
    imageUrl: 'https://images.unsplash.com/photo-1535266818359-e11da8b3a1bb?w=600&q=80',
  },
  {
    slug: 'musique',
    labelKey: 'dashboard.couple.milestones.musique',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
  },
  {
    slug: 'voiture',
    labelKey: 'dashboard.couple.milestones.voiture',
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80',
  },
];

interface MilestoneCategoriesProps {
  className?: string;
}

export function MilestoneCategories({ className }: MilestoneCategoriesProps) {
  const { t } = useTranslation('common');

  return (
    <div className={cn('space-y-6', className)}>
      <h2 className="font-display text-2xl text-neutral-900">
        {t('dashboard.couple.milestones.title')}
      </h2>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x pb-1">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/vendors?category.slug=${cat.slug}`}
            className="min-w-[160px] snap-start relative rounded-[--radius-xl] overflow-hidden shrink-0 group"
            style={{ aspectRatio: '2/3' }}
          >
            <Image
              src={cat.imageUrl}
              alt={t(cat.labelKey)}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              sizes="160px"
            />
            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            {/* Label */}
            <p className="absolute bottom-4 start-0 end-0 text-center text-white text-sm font-display font-bold drop-shadow-sm px-2">
              {t(cat.labelKey)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
