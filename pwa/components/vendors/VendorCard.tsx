import Image from "next/image";
import Link from "next/link";
import StarRating from "../ui/StarRating";
import { Badge } from "../ui/badge";
import PriceRange from "../ui/PriceRange";
import { useTranslation } from "next-i18next";

export interface VendorCardProps {
    id: number;
    slug: string;
    businessName: string;
    tagline?: string;
    serviceArea: string;
    category: string;
    priceRange: string;
    coverImageUrl?: string;
    averageRating?: number;
    reviewCount?: number;
    isVerified?: boolean;
}

const FALLBACK_IMG = `https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80`;

// v3.0 — 24px radius, Airbnb-style hover lift, terracotta stars
export default function VendorCard({
    slug,
    businessName,
    tagline,
    serviceArea,
    category,
    priceRange,
    coverImageUrl,
    averageRating,
    reviewCount,
    isVerified,
}: VendorCardProps) {
    const { t } = useTranslation("common");

    return (
        <Link
            href={`/vendors/${slug}`}
            className="group block bg-white rounded-[24px] overflow-hidden border border-[#DDDDDD] shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_12px_rgba(0,0,0,0.10)] hover:-translate-y-[2px] transition-all duration-200 ease-out"
        >
            {/* ── Photo ── */}
            <div className="relative aspect-[4/3] w-full bg-[#F7F7F7] overflow-hidden">
                <Image
                    src={coverImageUrl ?? FALLBACK_IMG}
                    alt={businessName}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-300 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Dark gradient for badges legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                {/* Category badge — top-left */}
                <div className="absolute top-3 left-3">
                    <Badge variant="category" className="bg-white/90 backdrop-blur-sm text-[#484848] text-[11px] font-medium rounded-full px-2.5 py-1 border-0 shadow-sm">
                        {t(`search_bar.categories.${category.toLowerCase()}`, { defaultValue: category })}
                    </Badge>
                </div>

                {/* Verified badge — top-right */}
                {isVerified && (
                    <div className="absolute top-3 right-3">
                        <Badge variant="verified" className="text-[11px] font-medium rounded-full px-2.5 py-1 border-0 shadow-sm bg-white/90 backdrop-blur-sm">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {t("vendor_card.verified")}
                        </Badge>
                    </div>
                )}
            </div>

            {/* ── Content ── */}
            <div className="p-5 space-y-3">
                {/* Name + city */}
                <div className="space-y-1">
                    <h3 className="font-semibold text-[16px] text-[#1A1A1A] leading-tight group-hover:text-[#E8472A] transition-colors line-clamp-1">
                        {businessName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[#717171] text-[12px]">
                        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{serviceArea}</span>
                    </div>
                </div>

                {/* Rating */}
                {averageRating !== undefined && averageRating > 0 && (
                    <StarRating
                        rating={averageRating}
                        reviewCount={reviewCount}
                        size="sm"
                    />
                )}

                {/* Tagline — 2 lines */}
                {tagline && (
                    <p className="text-[#717171] text-[13px] leading-relaxed line-clamp-2">
                        {tagline}
                    </p>
                )}

                {/* Bottom row: price + CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-[#DDDDDD]">
                    <PriceRange value={priceRange} />
                    <button
                        aria-label={t("vendor_card.whatsapp_aria", { name: businessName })}
                        onClick={(e) => {
                            e.preventDefault();
                            // WhatsApp link opens on vendor detail page
                        }}
                        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#484848] hover:text-[#E8472A] transition-colors"
                    >
                        {t("vendor_card.view_profile")}
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </Link>
    );
}
