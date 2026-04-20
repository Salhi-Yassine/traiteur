import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ArticleCardProps {
    slug: string;
    title: string;
    excerpt?: string;
    featuredImage?: string;
    category: { name: string; slug: string };
    publishedAt?: string;
    tags?: string[];
    /** "default" = vertical card · "featured" = large horizontal hero card */
    variant?: "default" | "featured";
    readingTimeMinutes?: number;
}

const FALLBACK_IMG = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80";

function formatDate(iso: string, locale: string): string {
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-MA" : locale === "ary" ? "fr-MA" : locale + "-MA", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(iso));
}

export default function ArticleCard({
    slug,
    title,
    excerpt,
    featuredImage,
    category,
    publishedAt,
    variant = "default",
    readingTimeMinutes,
}: ArticleCardProps) {
    const { t } = useTranslation("common");
    const { locale } = useRouter();

    const dateLabel = publishedAt ? formatDate(publishedAt, locale ?? "fr") : null;

    if (variant === "featured") {
        return (
            <Link href={`/magazine/${slug}`} className="group block relative rounded-[28px] overflow-hidden">
                <div className="relative h-[70vh] min-h-[420px] w-full bg-neutral-900">
                    <Image
                        src={featuredImage ?? FALLBACK_IMG}
                        alt={title}
                        fill
                        priority
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out opacity-80"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                    <div className="max-w-3xl space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="bg-primary text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                {category.name}
                            </span>
                            {readingTimeMinutes && (
                                <span className="flex items-center gap-1 text-white/70 text-[12px]">
                                    <Clock className="w-3.5 h-3.5" />
                                    {readingTimeMinutes} {t("magazine.min_read")}
                                </span>
                            )}
                        </div>
                        <h2 className="font-display text-white text-3xl md:text-5xl leading-tight line-clamp-3">
                            {title}
                        </h2>
                        {excerpt && (
                            <p className="text-white/70 text-[15px] leading-relaxed line-clamp-2 hidden md:block">
                                {excerpt}
                            </p>
                        )}
                        <span className="inline-flex items-center gap-2 text-white font-semibold text-[14px] group-hover:gap-3 transition-all duration-300">
                            {t("magazine.read_more")}
                            <span className="text-primary">→</span>
                        </span>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/magazine/${slug}`} className="group flex flex-col bg-white rounded-[24px] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.10)] transition-all duration-400 ease-out h-full">
            <div className="relative aspect-[16/9] w-full bg-neutral-100 overflow-hidden">
                <Image
                    src={featuredImage ?? FALLBACK_IMG}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-[1.05] transition-transform duration-600 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <span className="absolute top-3 start-3 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                    {category.name}
                </span>
            </div>

            <div className="flex flex-col flex-1 p-5 gap-3">
                <h3 className={cn(
                    "font-display text-[#1A1A1A] leading-snug group-hover:text-primary transition-colors line-clamp-2",
                    "text-[18px] md:text-[20px]"
                )}>
                    {title}
                </h3>
                {excerpt && (
                    <p className="text-[#5E5E5E] text-[13px] leading-relaxed line-clamp-2 flex-1">
                        {excerpt}
                    </p>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-[#F3F3F3] mt-auto">
                    {dateLabel && (
                        <span className="text-[#B0B0B0] text-[11px]">{dateLabel}</span>
                    )}
                    {readingTimeMinutes && (
                        <span className="flex items-center gap-1 text-[#B0B0B0] text-[11px]">
                            <Clock className="w-3 h-3" />
                            {readingTimeMinutes} {t("magazine.min_read")}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
