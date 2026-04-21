import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import VendorCard from '@/components/vendors/VendorCard';
import apiClient from '@/utils/apiClient';
import { cn } from '@/lib/utils';
import type { VendorProfile } from '@/types/api';

function isValidUrl(url?: string): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
}

interface VendorDiscoveryProps {
  className?: string;
}

export function VendorDiscovery({ className }: VendorDiscoveryProps) {
  const { t } = useTranslation('common');

  const { data, isLoading } = useQuery({
    queryKey: ['featuredVendors'],
    queryFn: () => apiClient.get<{ 'hydra:member': VendorProfile[] }>(
      '/api/vendor_profiles?isVerified=true&order[averageRating]=desc&itemsPerPage=4'
    ),
    staleTime: 10 * 60 * 1000,
  });

  const vendors: VendorProfile[] = (data as any)?.['hydra:member'] ?? [];

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl text-neutral-900">
            {t('dashboard.couple.vendors_section.title')}
          </h2>
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

      <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="min-w-[260px] h-[360px] rounded-[--radius-xl] shrink-0 snap-start" />
          ))
        ) : vendors.length > 0 ? (
          vendors.map((vendor) => (
            <div key={vendor.id} className="min-w-[260px] shrink-0 snap-start">
              <VendorCard
                id={vendor.id}
                slug={vendor.slug}
                businessName={vendor.businessName}
                tagline={vendor.tagline}
                cities={vendor.cities?.map((c) => ({ name: c.name, slug: c.slug }))}
                category={vendor.category ? { name: vendor.category.name, slug: vendor.category.slug } : { name: '', slug: '' }}
                priceRange={vendor.priceRange}
                startingPrice={vendor.startingPrice}
                coverImageUrl={isValidUrl(vendor.coverImageUrl) ? vendor.coverImageUrl : undefined}
                averageRating={vendor.averageRating ? parseFloat(String(vendor.averageRating)) : undefined}
                reviewCount={vendor.reviewCount}
                isVerified={vendor.isVerified}
                variant="card"
              />
            </div>
          ))
        ) : (
          /* Empty state CTA card */
          <Link
            href="/vendors"
            className="min-w-[260px] h-[360px] shrink-0 snap-start flex flex-col items-center justify-center gap-4 rounded-[--radius-xl] border-2 border-dashed border-neutral-200 bg-neutral-50 hover:border-primary hover:bg-[--color-primary-light] transition-colors group"
          >
            <div className="w-14 h-14 rounded-full bg-white shadow-1 flex items-center justify-center text-neutral-400 group-hover:text-primary transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-neutral-500 group-hover:text-primary transition-colors text-center px-6">
              {t('dashboard.couple.vendors_section.explore')}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
