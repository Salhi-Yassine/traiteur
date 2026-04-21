import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { cn } from "@/lib/utils";

interface Category {
    id: string | number;
    name: string;
    slug: string;
    icon?: string;
}

interface InspirationCategoryPillsProps {
    categories: Category[];
    activeCategory?: string;
    onCategoryChange: (slug: string) => void;
}

export default function InspirationCategoryPills({
    categories,
    activeCategory,
    onCategoryChange
}: InspirationCategoryPillsProps) {
    const { t } = useTranslation("common");

    return (
        <section className="py-12 bg-white sticky top-[64px] z-20 border-b border-[#EBEBEB]">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex items-center gap-10 overflow-x-auto scrollbar-hide pb-2">
                    <button
                        onClick={() => onCategoryChange("")}
                        className={cn(
                            "relative flex flex-col items-center gap-3 min-w-max pb-4 transition-all duration-300 group",
                            !activeCategory ? "text-[#E8472A]" : "text-[#717171] hover:text-[#1A1A1A]"
                        )}
                    >
                        <span className="text-[14px] font-semibold tracking-tight">{t("inspiration.all_inspiration")}</span>
                        {!activeCategory && (
                            <motion.div
                                layoutId="categoryUnderline"
                                className="absolute bottom-0 inset-x-0 h-[2px] bg-[#E8472A]"
                            />
                        )}
                    </button>

                    {categories.map((category) => {
                        const isActive = activeCategory === category.slug;
                        return (
                            <button
                                key={category.id}
                                onClick={() => onCategoryChange(category.slug)}
                                className={cn(
                                    "relative flex flex-col items-center gap-3 min-w-max pb-4 transition-all duration-300 group",
                                    isActive ? "text-[#E8472A]" : "text-[#717171] hover:text-[#1A1A1A]"
                                )}
                            >
                                <span className="text-[14px] font-semibold tracking-tight">{category.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="categoryUnderline"
                                        className="absolute bottom-0 inset-x-0 h-[2px] bg-[#E8472A]"
                                    />
                                )}
                                {!isActive && (
                                    <div className="absolute bottom-0 inset-x-0 h-[2px] bg-transparent group-hover:bg-[#DDDDDD] transition-colors" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
