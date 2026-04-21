import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const BLUR_PLACEHOLDER = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

export interface ArticleCardProps {
    slug: string;
    title: string;
    excerpt?: string;
    featuredImage?: string;
    category: { name: string; slug: string };
    publishedAt?: string;
    tags?: string[];
    /** 
     * "default" = vertical grid card
     * "featured" = large horizontal hero (used in MagazineHero now)
     * "landscape" = horizontal editorial pick
     * "compact" = minimal sidebar item 
     */
    variant?: "default" | "featured" | "landscape" | "compact";
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

    const animProps = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" },
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }
    };

    // Landscape Variant (Editorial Pick)
    if (variant === "landscape") {
        return (
            <motion.div {...animProps}>
                <Link href={`/magazine/${slug}`} className="group block bg-white rounded-[2rem] overflow-hidden shadow-1 hover:shadow-3 transition-all duration-500">
                    <div className="flex flex-col md:flex-row h-full">
                        <div className="relative md:w-1/2 aspect-[16/9] md:aspect-auto overflow-hidden">
                            <Image
                                src={featuredImage ?? FALLBACK_IMG}
                                alt={title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                    />
                            <div className="absolute top-6 start-6">
                                <span className="bg-white/90 backdrop-blur-md text-neutral-900 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full">
                                    {category.name}
                                </span>
                            </div>
                        </div>
                        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-neutral-400 text-12">
                                    {dateLabel && <span>{dateLabel}</span>}
                                    {readingTimeMinutes && (
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-14 h-14" />
                                            {readingTimeMinutes} min
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-display text-28 md:text-36 text-neutral-900 group-hover:text-primary transition-colors leading-tight">
                                    {title}
                                </h3>
                                {excerpt && (
                                    <p className="text-neutral-500 text-15 leading-relaxed line-clamp-3">
                                        {excerpt}
                                    </p>
                                )}
                            </div>
                            <div className="mt-4">
                                <span className="inline-flex items-center gap-3 text-14 font-black uppercase tracking-widest text-primary">
                                    {t('magazine.read_article')}
                                    <ArrowRight className="w-16 h-16 group-hover:translate-x-4 transition-transform rtl:rotate-180" />
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>
        );
    }

    // Compact Variant (Sidebar / Related)
    if (variant === "compact") {
        return (
            <motion.div {...animProps} transition={{ duration: 0.4 }}>
                <Link href={`/magazine/${slug}`} className="group flex gap-6 items-center">
                    <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden">
                        <Image src={featuredImage ?? FALLBACK_IMG} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500"
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                    />
                    </div>
                    <div className="space-y-1">
                        <p className="text-primary text-[10px] font-black uppercase tracking-widest">{category.name}</p>
                        <h4 className="font-display text-15 text-neutral-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                            {title}
                        </h4>
                    </div>
                </Link>
            </motion.div>
        );
    }

    // Featured Hero Variant (Note: MagazineHero is preferred for the main landing hero)
    if (variant === "featured") {
        return (
            <motion.div {...animProps}>
                <Link href={`/magazine/${slug}`} className="group block relative rounded-[3rem] overflow-hidden shadow-3">
                    <div className="relative h-[65vh] min-h-[400px] w-full">
                        <Image
                            src={featuredImage ?? FALLBACK_IMG}
                            alt={title}
                            fill
                            priority
                            className="object-cover group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                            sizes="100vw"
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                    />
                        <div className="absolute inset-0 bg-black/40 editorial-gradient" />
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-16 lg:p-20">
                        <div className="max-w-3xl space-y-6">
                            <div className="flex items-center gap-4">
                                <span className="bg-primary text-white text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                                    {category.name}
                                </span>
                                {readingTimeMinutes && (
                                    <span className="flex items-center gap-1 text-white/80 text-[13px] font-medium">
                                        <Clock className="w-16 h-16" />
                                        {readingTimeMinutes} min
                                    </span>
                                )}
                            </div>
                            <h2 className="font-display text-white text-36 md:text-56 leading-[1.1] text-balance">
                                {title}
                            </h2>
                            {excerpt && (
                                <p className="text-white/80 text-[16px] md:text-[18px] leading-relaxed line-clamp-2 hidden md:block max-w-xl">
                                    {excerpt}
                                </p>
                            )}
                            <span className="inline-flex items-center gap-3 text-white font-black text-[15px] uppercase tracking-widest group-hover:gap-5 transition-all duration-300 pt-4">
                                {t("magazine.read_article")}
                                <span className="text-primary text-20">→</span>
                            </span>
                        </div>
                    </div>
                </Link>
            </motion.div>
        );
    }

    // Default Variant (Grid Card)
    return (
        <motion.div {...animProps} className="h-full">
            <Link href={`/magazine/${slug}`} className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-neutral-100 hover:shadow-3 transition-all duration-500 h-full">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                        src={featuredImage ?? FALLBACK_IMG}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                    />
                    <div className="absolute top-4 start-4">
                        <span className="bg-white/90 backdrop-blur-md text-neutral-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                            {category.name}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col flex-1 p-8 pt-6 gap-4">
                    <div className="flex items-center justify-between text-neutral-400 text-[11px] font-bold uppercase tracking-widest">
                        {dateLabel && <span>{dateLabel}</span>}
                        {readingTimeMinutes && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-14 h-14" />
                                {readingTimeMinutes} min
                            </span>
                        )}
                    </div>
                    <h3 className={cn(
                        "font-display text-neutral-900 leading-snug group-hover:text-primary transition-colors line-clamp-2",
                        "text-[20px] md:text-[22px]"
                    )}>
                        {title}
                    </h3>
                    {excerpt && (
                        <p className="text-neutral-500 text-[14px] leading-relaxed line-clamp-3">
                            {excerpt}
                        </p>
                    )}
                    <div className="mt-auto pt-6 flex items-center gap-2 text-primary text-13 font-black uppercase tracking-widest">
                        {t('magazine.read_article')}
                        <ArrowRight className="w-14 h-14 group-hover:translate-x-3 transition-transform rtl:rotate-180" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
