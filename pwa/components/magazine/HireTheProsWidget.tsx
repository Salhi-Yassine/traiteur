import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface HireTheProsWidgetProps {
    categorySlug?: string;
    categoryName?: string;
    /** City slug to pre-filter vendors, optional */
    citySlug?: string;
    /** "floating" (default) or "sidebar" */
    variant?: "floating" | "sidebar";
    /** Scroll progress threshold to show the floating variant (0–1). Default 0.5 */
    triggerAt?: number;
}

export default function HireTheProsWidget({ 
    categorySlug, 
    categoryName, 
    citySlug, 
    variant = "floating",
    triggerAt = 0.5
}: HireTheProsWidgetProps) {
    const { t } = useTranslation("common");
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (dismissed || variant === "sidebar") return;

        function onScroll() {
            const scrolled = window.scrollY;
            const total = document.documentElement.scrollHeight - window.innerHeight;
            if (total > 0 && scrolled / total >= triggerAt) {
                setVisible(true);
            }
        }

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [dismissed, variant, triggerAt]);

    const params = new URLSearchParams();
    if (categorySlug) params.set("category.slug", categorySlug);
    if (citySlug) params.set("cities.slug", citySlug);
    const href = `/vendors${params.toString() ? `?${params.toString()}` : ""}`;

    const content = (
        <div className={cn(
            "group overflow-hidden border border-neutral-100 transition-all duration-500",
            variant === "floating" 
                ? "bg-white rounded-[20px] shadow-[0_16px_48px_rgba(0,0,0,0.18)]" 
                : "bg-white rounded-[2.5rem] shadow-1 hover:shadow-2"
        )}>
            {/* Header / Accent */}
            <div className={cn(
                "px-6 py-5 flex items-center justify-between",
                variant === "floating" ? "bg-primary" : "bg-neutral-50"
            )}>
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shadow-sm",
                        variant === "floating" ? "bg-white/20 text-white" : "bg-primary text-white"
                    )}>
                        <Sparkles className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div>
                        {variant === "floating" && (
                            <div className="flex items-center gap-2 mb-0.5">
                                {/* Pulsing live indicator */}
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                                </span>
                                <span className="text-white/70 text-[9px] font-bold uppercase tracking-widest">
                                    Étape suivante →
                                </span>
                            </div>
                        )}
                        <span className={cn(
                            "text-[14px] font-black uppercase tracking-widest",
                            variant === "floating" ? "text-white" : "text-neutral-900"
                        )}>
                            {t("magazine.hire_pros.title")}
                        </span>
                    </div>
                </div>
                {variant === "floating" && (
                    <button
                        onClick={() => setDismissed(true)}
                        className="text-white/70 hover:text-white transition-colors"
                        aria-label={t("magazine.hire_pros.close")}
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Body */}
            <div className="p-8 space-y-6">
                <p className="text-neutral-500 text-[14px] leading-relaxed">
                    {categoryName
                        ? t("magazine.hire_pros.subtitle_category", { category: categoryName })
                        : t("magazine.hire_pros.subtitle")}
                </p>
                <Link
                    href={href}
                    className="flex items-center justify-center gap-3 w-full bg-primary hover:bg-primary-dark text-white text-[14px] font-black uppercase tracking-widest py-4 px-6 rounded-full shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
                >
                    {t("magazine.hire_pros.cta")}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );

    if (variant === "sidebar") {
        return content;
    }

    return (
        <AnimatePresence>
            {visible && !dismissed && (
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 28 }}
                    className="fixed bottom-6 end-6 z-50 w-[300px]"
                >
                    {content}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
