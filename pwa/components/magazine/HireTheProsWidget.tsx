import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface HireTheProsWidgetProps {
    categorySlug?: string;
    categoryName?: string;
    /** City slug to pre-filter vendors, optional */
    citySlug?: string;
}

export default function HireTheProsWidget({ categorySlug, categoryName, citySlug }: HireTheProsWidgetProps) {
    const { t } = useTranslation("common");
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (dismissed) return;

        function onScroll() {
            const scrolled = window.scrollY;
            const total = document.documentElement.scrollHeight - window.innerHeight;
            if (total > 0 && scrolled / total >= 0.5) {
                setVisible(true);
            }
        }

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [dismissed]);

    const params = new URLSearchParams();
    if (categorySlug) params.set("category.slug", categorySlug);
    if (citySlug) params.set("cities.slug", citySlug);
    const href = `/vendors${params.toString() ? `?${params.toString()}` : ""}`;

    return (
        <div
            className={cn(
                "fixed bottom-6 end-6 z-50 w-[280px] transition-all duration-500 ease-out",
                visible && !dismissed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
            )}
        >
            <div className="bg-white rounded-[20px] shadow-[0_16px_48px_rgba(0,0,0,0.18)] overflow-hidden border border-[#F0F0F0]">
                {/* Header */}
                <div className="bg-primary px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
                        <span className="text-white text-[13px] font-bold">
                            {t("magazine.hire_pros.title")}
                        </span>
                    </div>
                    <button
                        onClick={() => setDismissed(true)}
                        className="text-white/70 hover:text-white transition-colors"
                        aria-label={t("magazine.hire_pros.close")}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-4 py-4 space-y-3">
                    <p className="text-[#5E5E5E] text-[12px] leading-relaxed">
                        {categoryName
                            ? t("magazine.hire_pros.subtitle_category", { category: categoryName })
                            : t("magazine.hire_pros.subtitle")}
                    </p>
                    <Link
                        href={href}
                        className="block w-full text-center bg-primary hover:bg-primary-dark text-white text-[13px] font-bold py-2.5 px-4 rounded-[12px] transition-colors duration-200"
                    >
                        {t("magazine.hire_pros.cta")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
