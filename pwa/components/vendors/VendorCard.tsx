import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import StarRating from "../ui/StarRating";
import { Badge } from "../ui/badge";
import PriceRange from "../ui/PriceRange";
import { useTranslation } from "next-i18next";
import { BadgeCheck, MapPin, ChevronRight, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VendorCardProps {
    id: number;
    slug: string;
    businessName: string;
    tagline?: string;
    serviceArea?: string;
    cities?: { name: string; slug: string }[];
    category: { name: string; slug: string };
    priceRange: string;
    startingPrice?: number | null;
    coverImageUrl?: string;
    averageRating?: number;
    reviewCount?: number;
    isVerified?: boolean;
    /** "card" = vertical grid card (default) · "list" = horizontal row */
    variant?: "card" | "list";
}

const FALLBACK_IMG = `https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80`;

// v3.2 — adds list variant for directory view toggle
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
    variant = "card",
}: VendorCardProps) {
    const { t } = useTranslation("common");
    const { locale } = useRouter();

    const cityLabel = cities && cities.length > 0
        ? cities.map(c => c.name).join(", ")
        : serviceArea;

    const formattedPrice = startingPrice
        ? new Intl.NumberFormat(locale === "ar" ? "ar-MA" : "fr-MA").format(startingPrice)
        : null;

    const [isFavorite, setIsFavorite] = useState(false);

    // ─── List variant ──────────────────────────────────────────────────────────
    if (variant === "list") {
        return (
            <div className="relative group">
                <Link
                    href={`/vendors/${slug}`}
                    className="flex gap-5 bg-white rounded-[24px] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out p-4"
                >
                    {/* Thumbnail */}
                    <div className="relative shrink-0 w-40 sm:w-52 aspect-[4/3] rounded-[16px] overflow-hidden bg-[#F7F7F7]">
                        <Image
                            src={coverImageUrl ?? FALLBACK_IMG}
                            alt={businessName}
                            fill
                            className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                            sizes="(max-width: 640px) 160px, 208px"
                        />
                        {isVerified && (
                            <div className="absolute top-2 start-2 bg-white/95 backdrop-blur-md text-[#0A7A4B] rounded-full p-1 shadow-sm border border-[#0A7A4B]/20">
                                <BadgeCheck className="w-3.5 h-3.5" strokeWidth={2.5} />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 min-w-0 py-1 gap-2">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <Badge
                                    variant="category"
                                    className="bg-primary/5 text-primary text-[10px] uppercase tracking-widest font-bold rounded-full px-2.5 py-0.5 border-0 mb-1.5"
                                >
                                    {category.name}
                                </Badge>
                                <h3 className="font-semibold text-[17px] text-[#222222] leading-tight group-hover:text-primary transition-colors line-clamp-1">
                                    {businessName}
                                </h3>
                                <div className="flex items-center gap-1 text-[#717171] text-[12px] mt-0.5">
                                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                                    <span className="truncate">{cityLabel}</span>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#B0B0B0] group-hover:text-primary transition-colors shrink-0 mt-1 rtl:-scale-x-100" />
                        </div>

                        {tagline && (
                            <p className="text-[#5E5E5E] text-[13px] leading-relaxed line-clamp-2 hidden sm:block">
                                {tagline}
                            </p>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#F3F3F3]">
                            {averageRating !== undefined && averageRating > 0 ? (
                                <StarRating rating={averageRating} reviewCount={reviewCount} size="sm" />
                            ) : (
                                <span className="text-[12px] text-[#B0B0B0]">{t("vendor_card.no_reviews")}</span>
                            )}

                            {startingPrice ? (
                                <div className="text-end">
                                    <span className="text-[10px] text-[#717171] block leading-none uppercase tracking-tighter">
                                        {t("vendor_card.starting_at")}
                                    </span>
                                    <span className="text-[15px] font-bold text-[#222222]">
                                        {formattedPrice}{" "}
                                        <span className="text-[11px] font-medium">{t("common.currency")}</span>
                                    </span>
                                </div>
                            ) : (
                                <PriceRange value={priceRange} />
                            )}
                        </div>
                    </div>
                </Link>
                {/* Heart Button for List */}
                <button
                    onClick={(e) => { e.preventDefault(); setIsFavorite(!isFavorite); }}
                    className="absolute top-6 end-6 z-10 p-2 rounded-full hover:bg-neutral-100/10 transition-colors"
                >
                    <Heart className={cn("w-5 h-5 transition-all duration-300", isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-white fill-black/10")} />
                </button>
            </div>
        );
    }

    // ─── Card variant (default) ────────────────────────────────────────────────
    return (
        <div className="group relative">
            <Link
                href={`/vendors/${slug}`}
                className="block bg-white rounded-[28px] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all duration-500 ease-out"
            >
                {/* ── Photo ── */}
                <div className="relative aspect-[4/3] w-full bg-[#F7F7F7] overflow-hidden">
                    <Image
                        src={coverImageUrl ?? FALLBACK_IMG}
                        alt={businessName}
                        fill
                        className="object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 via-transparent to-transparent opacity-60" />

                    <div className="absolute top-4 start-4 flex items-center gap-2">
                        <Badge variant="category" className="bg-white/95 backdrop-blur-md text-[#222222] text-[10px] uppercase tracking-wider font-bold rounded-full px-3 py-1 border-0 shadow-sm">
                            {category.name}
                        </Badge>
                    </div>

                    {isVerified && (
                        <div className="absolute bottom-4 start-4">
                            <div className="bg-white/95 backdrop-blur-md text-[#0A7A4B] rounded-full px-2 py-1 shadow-sm border border-[#0A7A4B]/20 flex items-center gap-1.5">
                                <BadgeCheck className="w-3.5 h-3.5" strokeWidth={2.5} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{t("vendor_card.verified")}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Content ── */}
                <div className="p-5 space-y-3">
                    <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-[18px] text-[#222222] leading-tight group-hover:text-primary transition-colors line-clamp-1 italic font-display">
                                {businessName}
                            </h3>
                        </div>
                        <div className="flex items-center gap-1 text-[#717171] text-[13px]">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span>{cityLabel}</span>
                        </div>
                    </div>

                    {averageRating !== undefined && averageRating > 0 ? (
                        <StarRating rating={averageRating} reviewCount={reviewCount} size="sm" />
                    ) : (
                        <div className="h-4" /> // spacing spacer
                    )}

                    {tagline && (
                        <p className="text-[#5E5E5E] text-[13px] leading-relaxed line-clamp-2 min-h-[40px]">
                            {tagline}
                        </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-[#F3F3F3]">
                        {startingPrice ? (
                            <div className="flex flex-col">
                                <span className="text-[10px] text-[#717171] uppercase tracking-tighter font-bold">
                                    {t("vendor_card.starting_at")}
                                </span>
                                <div className="text-[16px] font-black text-[#222222]">
                                    {formattedPrice}{" "}
                                    <span className="text-[12px] font-medium ms-0.5">{t("common.currency")}</span>
                                </div>
                            </div>
                        ) : (
                            <PriceRange value={priceRange} />
                        )}

                        <div className="p-2 rounded-full border border-neutral-100 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
                            <ChevronRight className="w-4 h-4 rtl:-scale-x-100" />
                        </div>
                    </div>
                </div>
            </Link>

            {/* Floating Heart Button */}
            <button
                onClick={(e) => { e.preventDefault(); setIsFavorite(!isFavorite); }}
                className="absolute top-4 end-4 z-10 p-2 rounded-full hover:scale-110 active:scale-95 transition-all duration-200"
            >
                <Heart 
                    className={cn(
                        "w-7 h-7 transition-all duration-300", 
                        isFavorite 
                            ? "fill-red-500 text-red-500" 
                            : "text-white fill-black/20 hover:fill-black/40"
                    )} 
                    strokeWidth={1.5}
                />
            </button>
        </div>
    );
}
