import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "next-i18next";

interface InspirationHeroProps {
    featuredArticle?: {
        title: string;
        excerpt: string;
        slug: string;
        featuredImage: string;
        category: string;
    };
}

export default function InspirationHero({ featuredArticle }: InspirationHeroProps) {
    const { t } = useTranslation("common");

    if (!featuredArticle) return null;

    return (
        <section className="relative w-full min-h-[60vh] md:h-[70vh] flex items-center overflow-hidden bg-neutral-100 pb-12 md:pb-0">
            {/* Background Image / Pattern */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={featuredArticle.featuredImage || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80"}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover opacity-90 brightness-[0.85]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>

            <div className="container relative z-10 mx-auto px-6 py-20 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-2xl space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[12px] font-bold uppercase tracking-widest">
                        <Sparkles size={14} className="text-[#E8472A]" />
                        {featuredArticle.category}
                    </div>

                    <h1 className="font-display text-white text-5xl md:text-[64px] leading-[1.05] tracking-tight">
                        {featuredArticle.title}
                    </h1>

                    <p className="text-white/80 text-[18px] md:text-[20px] leading-relaxed max-w-xl">
                        {featuredArticle.excerpt}
                    </p>

                    <div className="flex items-center gap-6 pt-4">
                        <Button
                            asChild
                            variant="default"
                            size="lg"
                            className="rounded-full px-8 bg-[#E8472A] hover:bg-[#D13C1F] text-white"
                        >
                            <Link href={`/inspiration/articles/${featuredArticle.slug}`}>
                                {t("inspiration.read_story")}
                                <ArrowRight className="ms-2 w-5 h-5 rtl:-scale-x-100" />
                            </Link>
                        </Button>

                        <Link
                            href="/inspiration/articles"
                            className="text-white font-medium hover:text-[#E8472A] transition-colors flex items-center gap-2 underline underline-offset-8"
                        >
                            {t("inspiration.browse_all_trends")}
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator (Visual only) */}
            <div className="absolute bottom-10 end-10 hidden md:flex items-center gap-4 text-white/50 text-[12px] uppercase tracking-widest font-bold rotate-90 origin-right">
                <div className="w-12 h-[1px] bg-white/30" />
                {t("inspiration.scroll_label")}
            </div>
        </section>
    );
}
