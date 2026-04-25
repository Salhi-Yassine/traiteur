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

interface VendorDiscoveryProps {
  className?: string;
}

export function VendorDiscovery({ className }: VendorDiscoveryProps) {
  const { t } = useTranslation('common');

  const { data, isLoading } = useQuery({
    queryKey: ['featuredVendors'],
    queryFn: () =>
      apiClient.get<HydraCollection<VendorProfile>>(
        '/api/vendor_profiles?isVerified=true&order[averageRating]=desc&itemsPerPage=4'
      ),
    staleTime: 10 * 60 * 1000,
  });

  const apiVendors: VendorProfile[] = (data as HydraCollection<VendorProfile> | undefined)?.['hydra:member'] ?? [];
  const vendors = apiVendors.length > 0 ? apiVendors : MOCK_VENDORS;

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
