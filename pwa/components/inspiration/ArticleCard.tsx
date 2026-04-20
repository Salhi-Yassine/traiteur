import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "next-i18next";

interface ArticleCardProps {
    article: {
        id: number;
        title: string;
        slug: string;
        excerpt: string;
        featuredImage: string;
        publishedAt: string;
        category: { name: string; slug: string };
    };
}

export default function ArticleCard({ article }: ArticleCardProps) {
    const { t } = useTranslation("common");

    return (
        <Link href={`/inspiration/articles/${article.slug}`} className="group block">
            <motion.div
                whileHover={{ y: -8 }}
                className="space-y-5"
            >
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-neutral-100">
                    <Image
                        src={article.featuredImage.startsWith('http') ? article.featuredImage : `/images/inspiration/${article.featuredImage}.png`}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Category Overlay */}
                    <div className="absolute top-6 start-6">
                        <span className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A] shadow-sm">
                            {article.category.name}
                        </span>
                    </div>

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                {/* Content */}
                <div className="space-y-3 px-2">
                    <div className="flex items-center gap-3 text-[12px] text-[#717171] font-medium">
                        <Clock size={14} />
                        {format(new Date(article.publishedAt), 'MMM dd, yyyy')}
                    </div>

                    <h3 className="font-display text-[24px] text-[#1A1A1A] leading-[1.2] group-hover:text-[#E8472A] transition-colors">
                        {article.title}
                    </h3>

                    <p className="text-[15px] text-[#717171] leading-relaxed line-clamp-2">
                        {article.excerpt}
                    </p>

                    <div className="pt-2 flex items-center gap-2 text-[14px] font-bold text-[#1A1A1A]">
                        {t("inspiration.read_article")}
                        <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 rtl:-scale-x-100" />
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
