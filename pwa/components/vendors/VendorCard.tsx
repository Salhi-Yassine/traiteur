import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import StarRating from "../ui/StarRating";
import { Badge } from "../ui/badge";
import PriceRange from "../ui/PriceRange";
import { useTranslation } from "next-i18next";
import { BadgeCheck, MapPin, ChevronRight } from "lucide-react";

export interface VendorCardProps {
    id: number;
    slug: string;
    businessName: string;
    tagline?: string;
    serviceArea?: string; // Keep for backward compatibility or transition
    cities?: {
        name: string;
        slug: string;
    }[];
    category: {
        name: string;
        slug: string;
    };
    priceRange: string;
    startingPrice?: number | null;
    coverImageUrl?: string;
    averageRating?: number;
    reviewCount?: number;
    isVerified?: boolean;
}

const FALLBACK_IMG = `https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80`;

// v3.1 — 24px radius, localized starting price, premium hover effects
export default function VendorCard({
    slug,
    businessName,
    tagline,
    serviceArea,
    cities,
    category,
    priceRange,
    startingPrice,
    coverImageUrl,
    averageRating,
    reviewCount,
    isVerified,
}: VendorCardProps) {
    const { t } = useTranslation("common");
    const { locale } = useRouter();

    const formattedPrice = startingPrice 
        ? new Intl.NumberFormat(locale === "ar" ? "ar-MA" : "fr-MA").format(startingPrice)
        : null;

    return (
        <Link
            href={`/vendors/${slug}`}
            className="group block bg-white rounded-[24px] overflow-hidden border border-[#DDDDDD] shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:-translate-y-[2px] transition-all duration-300 ease-out"
        >
            {/* ── Photo ── */}
            <div className="relative aspect-[4/3] w-full bg-[#F7F7F7] overflow-hidden">
                <Image
                    src={coverImageUrl ?? FALLBACK_IMG}
                    alt={businessName}
                    fill
                    className="object-cover group-hover:scale-[1.05] transition-transform duration-500 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Overlays for better contrast on white badges */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent opacity-60" />

                <div className="absolute top-3 start-3 flex items-center gap-2">
                    <Badge variant="category" className="bg-white/95 backdrop-blur-md text-[#222222] text-[10px] uppercase tracking-wider font-bold rounded-full px-3 py-1 border-0 shadow-sm">
                        {category.name}
                    </Badge>
                </div>

                {/* Verified badge — top-right */}
                {isVerified && (
                    <div className="absolute top-3 end-3">
                        <div className="bg-white/90 backdrop-blur-md text-[#0A7A4B] rounded-full p-1 shadow-sm border border-[#0A7A4B]/20">
                            <BadgeCheck className="w-4.5 h-4.5" strokeWidth={2.5} />
                        </div>
                    </div>
                )}
            </div>

            {/* ── Content ── */}
            <div className="p-5 space-y-3">
                {/* Name + city */}
                <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-[17px] text-[#222222] leading-tight group-hover:text-[#E8472A] transition-colors line-clamp-1">
                            {businessName}
                        </h3>
                    </div>
                    <div className="flex items-center gap-1 text-[#717171] text-[12px]">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{cities && cities.length > 0 ? cities.map(c => c.name).join(', ') : serviceArea}</span>
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
                    <p className="text-[#5E5E5E] text-[13px] leading-relaxed line-clamp-2 min-h-[40px]">
                        {tagline}
                    </p>
                )}

                {/* Bottom row: price + CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-[#F3F3F3]">
                    {startingPrice ? (
                        <div className="flex flex-col">
                            <span className="text-[10px] text-[#717171] uppercase tracking-tighter">
                                {t("vendor_card.starting_at")}
                            </span>
                            <div className="text-[15px] font-bold text-[#222222]">
                                {formattedPrice} <span className="text-[12px] font-medium ms-0.5">{t("common.currency")}</span>
                            </div>
                        </div>
                    ) : (
                        <PriceRange value={priceRange} />
                    )}
                    
                    <div className="flex items-center gap-1 text-[13px] font-semibold text-[#222222] group-hover:text-[#E8472A] transition-colors">
                        {t("vendor_card.view_profile")}
                        <ChevronRight className="w-4 h-4 rtl:-scale-x-100" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
