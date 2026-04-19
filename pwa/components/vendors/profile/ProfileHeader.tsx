import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import { useTranslation } from "next-i18next";
import { cn } from "@/lib/utils";
import { VendorProfileData } from "./ProfileTypes";

interface ProfileHeaderProps {
    vendor: VendorProfileData;
    rating: number;
    isSaved: boolean;
    isHeartAnimating: boolean;
    onShare: () => void;
    onSave: () => void;
}

export default function ProfileHeader({
    vendor,
    rating,
    isSaved,
    isHeartAnimating,
    onShare,
    onSave
}: ProfileHeaderProps) {
    const { t } = useTranslation("common");

    return (
        <div className="mb-8">
            <div className="mb-4">
                <Badge variant="category" className="bg-neutral-100 text-[#222222] text-[10px] uppercase tracking-wider font-bold rounded-full px-4 py-1.5 border-0 shadow-sm">
                    {vendor.category}
                </Badge>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black text-neutral-900 mb-4 tracking-tight flex items-center gap-3">
                {vendor.businessName}
                {vendor.isVerified && (
                     <div className="bg-white text-[#0A7A4B] rounded-full p-1 shadow-sm border border-[#0A7A4B]/20 flex items-center justify-center shrink-0">
                        <BadgeCheck className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2.5} />
                     </div>
                )}
            </h1>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6 text-sm font-bold text-neutral-700">
                     <div className="flex items-center gap-1.5 underline decoration-neutral-300">
                        <StarRating rating={rating} showCount={false} size="sm" />
                        <span>{rating} ({vendor.reviewCount} {t("vendor_profile.reviews_count")})</span>
                     </div>
                     <div className="flex items-center gap-1.5 underline decoration-neutral-300">
                        <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span>{vendor.cities.map(c => t(`search_bar.cities.${c.slug}`, c.name)).join(', ')}</span>
                     </div>
                </div>
                <div className="flex items-center gap-2">
                     <Button onClick={onShare} variant="ghost" size="sm" className="rounded-xl flex items-center gap-2 hover:bg-neutral-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="underline font-bold text-xs">{t("nav.share", "Partager")}</span>
                     </Button>
                     <Button onClick={onSave} variant="ghost" size="sm" className="rounded-xl flex items-center gap-2 hover:bg-neutral-100">
                        <svg className={cn("w-4 h-4 transition-all duration-300", isSaved ? "fill-[#FF385C] text-[#FF385C]" : "fill-none text-currentColor", isHeartAnimating && "scale-125")} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isSaved ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="underline font-bold text-xs">{isSaved ? t("common.saved", "Sauvegardé") : t("common.save")}</span>
                     </Button>
                </div>
            </div>
        </div>
    );
}
