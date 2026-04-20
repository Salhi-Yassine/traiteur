import Link from "next/link";
import { useTranslation } from "next-i18next";
import { BadgeCheck, ChevronRight } from "lucide-react";

export interface InlineVendorCardProps {
    slug: string;
    businessName: string;
    category: { name: string; slug: string };
    coverImageUrl?: string;
    isVerified?: boolean;
    averageRating?: number;
}

export default function InlineVendorCard({
    slug,
    businessName,
    category,
    coverImageUrl,
    isVerified,
    averageRating,
}: InlineVendorCardProps) {
    const { t } = useTranslation("common");

    return (
        <Link
            href={`/vendors/${slug}`}
            className="group flex items-center gap-4 bg-[#FEF0ED] hover:bg-primary/10 border border-primary/15 rounded-[16px] px-4 py-3 transition-colors duration-200"
        >
            {coverImageUrl && (
                <div
                    className="w-12 h-12 shrink-0 rounded-[10px] bg-cover bg-center"
                    style={{ backgroundImage: `url(${coverImageUrl})` }}
                />
            )}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-primary text-[10px] font-bold uppercase tracking-widest">
                        {category.name}
                    </span>
                    {isVerified && (
                        <BadgeCheck className="w-3.5 h-3.5 text-[#0A7A4B] shrink-0" strokeWidth={2.5} />
                    )}
                </div>
                <p className="font-semibold text-[#1A1A1A] text-[15px] truncate group-hover:text-primary transition-colors">
                    {businessName}
                </p>
                {averageRating !== undefined && averageRating > 0 && (
                    <p className="text-[#717171] text-[12px]">
                        ★ {averageRating.toFixed(1)}
                    </p>
                )}
            </div>
            <ChevronRight className="w-4 h-4 text-primary shrink-0 rtl:-scale-x-100 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
        </Link>
    );
}

interface ShopTheLookProps {
    vendors: InlineVendorCardProps[];
}

export function ShopTheLook({ vendors }: ShopTheLookProps) {
    const { t } = useTranslation("common");

    if (!vendors.length) return null;

    return (
        <div className="my-8 p-5 bg-white border border-[#F0F0F0] rounded-[20px] shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">
                {t("magazine.shop_the_look.title")}
            </p>
            <div className="flex flex-col gap-2">
                {vendors.map((vendor) => (
                    <InlineVendorCard key={vendor.slug} {...vendor} />
                ))}
            </div>
        </div>
    );
}
