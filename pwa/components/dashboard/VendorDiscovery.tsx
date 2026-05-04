import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import VendorCard from '@/components/vendors/VendorCard';
import apiClient from '@/utils/apiClient';
import { cn } from '@/lib/utils';
import type { VendorProfile, HydraCollection } from '@/types/api';
import { MOCK_VENDORS } from './mock';

function isValidUrl(url?: string): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
}

const CATEGORY_FILTERS = ['Tous', 'Salle', 'Photo', 'Traiteur', 'Décoration', 'Musique'] as const;
type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

const CATEGORY_SLUG_MAP: Record<CategoryFilter, string | null> = {
  'Tous': null,
  'Salle': 'salle',
  'Photo': 'photographe',
  'Traiteur': 'traiteur',
  'Décoration': 'decoration',
  'Musique': 'musique',
};

interface VendorDiscoveryProps {
  weddingCity?: string;
  stylePersona?: string;
  className?: string;
}

export function VendorDiscovery({ weddingCity, stylePersona: _stylePersona, className }: VendorDiscoveryProps) {
  const { t } = useTranslation('common');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('Tous');

  const { data, isLoading } = useQuery({
    queryKey: ['recommendedVendors', weddingCity, activeCategory],
    queryFn: () => {
      const params = new URLSearchParams({
        isVerified: 'true',
        'order[averageRating]': 'desc',
        itemsPerPage: '4',
      });
      if (weddingCity) params.set('cities.slug', weddingCity.toLowerCase());
      const categorySlug = CATEGORY_SLUG_MAP[activeCategory];
      if (categorySlug) params.set('category.slug', categorySlug);
      return apiClient.get<HydraCollection<VendorProfile>>(`/api/vendor_profiles?${params.toString()}`);
    },
    staleTime: 10 * 60 * 1000,
  });

  const apiVendors: VendorProfile[] = (data as HydraCollection<VendorProfile> | undefined)?.['hydra:member'] ?? [];
  const vendors = apiVendors.length > 0 ? apiVendors : MOCK_VENDORS;

  const sectionTitle = weddingCity
    ? t('dashboard.couple.vendors_section.recommended_title') + ` · ${weddingCity}`
    : t('dashboard.couple.vendors_section.title');

  return (
    <div className={cn('space-y-5', className)}>
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl text-neutral-900">{sectionTitle}</h2>
          <p className="text-sm text-neutral-500 mt-1">
            {t('dashboard.couple.vendors_section.subtitle')}
          </p>
        </div>
        <Link
          href="/vendors"
          className="flex items-center gap-1 text-sm font-bold text-primary hover:underline shrink-0"
        >
          {t('dashboard.couple.vendors_section.see_all')}
          <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
        </Link>
      </div>

      {/* Category filter chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'shrink-0 px-4 py-1.5 rounded-full text-sm font-bold border transition-all duration-200 whitespace-nowrap',
              activeCategory === cat
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
            )}
          >
            {cat === 'Tous' ? t('dashboard.couple.vendors_section.filter_all') : cat}
          </button>
        ))}
      </div>

      <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="min-w-[260px] h-[360px] rounded-[--radius-xl] shrink-0 snap-start" />
          ))
        ) : (
          vendors.map((vendor) => (
            <div key={vendor.id} className="min-w-[260px] shrink-0 snap-start">
              <VendorCard
                id={vendor.id}
                slug={vendor.slug}
                businessName={vendor.businessName}
                tagline={vendor.tagline}
                cities={vendor.cities?.map((c) => ({ name: c.name, slug: c.slug }))}
                category={
                  vendor.category
                    ? { name: vendor.category.name, slug: vendor.category.slug }
                    : { name: '', slug: '' }
                }
                priceRange={vendor.priceRange}
                startingPrice={vendor.startingPrice}
                coverImageUrl={isValidUrl(vendor.coverImageUrl) ? vendor.coverImageUrl : undefined}
                averageRating={
                  vendor.averageRating ? parseFloat(String(vendor.averageRating)) : undefined
                }
                reviewCount={vendor.reviewCount}
                isVerified={vendor.isVerified}
                variant="card"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
