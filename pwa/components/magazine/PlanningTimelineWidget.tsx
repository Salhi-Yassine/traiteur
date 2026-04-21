import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CalendarClock, ArrowRight, Clock } from "lucide-react";
import { PlanningTimeline } from "@/hooks/usePlanningTimeline";

// A lightweight base64 blurDataURL for image placeholders (neutral grey)
const BLUR_PLACEHOLDER =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

interface PlanningTimelineWidgetProps {
    timeline: PlanningTimeline;
}

export default function PlanningTimelineWidget({ timeline }: PlanningTimelineWidgetProps) {
    const { monthsLeft, label, badge, relevantArticles } = timeline;

    return (
        <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full max-w-7xl mx-auto px-4 md:px-8"
        >
            <div className="bg-gradient-to-br from-primary/5 via-white to-primary/5 border border-primary/15 rounded-[3rem] overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-8 md:px-12 pt-10 pb-0">
                    {/* Left: context */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <CalendarClock className="w-4 h-4 text-primary" />
                            <span className="text-primary text-[11px] font-black uppercase tracking-widest">
                                Votre planning
                            </span>
                            <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                                {badge}
                            </span>
                        </div>
                        <h2 className="font-display text-3xl md:text-4xl text-neutral-900">
                            {label} — <span className="text-primary">lisez ceci maintenant</span>
                        </h2>
                        <p className="text-neutral-500 text-[15px]">
                            {monthsLeft <= 3
                                ? "Les décisions critiques ne peuvent plus attendre."
                                : "Préparez-vous avec les bons conseils, au bon moment."}
                        </p>
                    </div>

                    {/* Right: month countdown badge */}
                    <div className="shrink-0 w-24 h-24 rounded-full bg-primary flex flex-col items-center justify-center text-white shadow-lg shadow-primary/30">
                        <span className="font-display text-3xl leading-none">{monthsLeft}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">mois</span>
                    </div>
                </div>

                {/* Articles row */}
                {relevantArticles.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8 md:p-12 pt-8">
                        {relevantArticles.map((article) => (
                            <Link
                                key={article.id}
                                href={`/magazine/${article.slug}`}
                                className="group flex gap-4 items-start p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300"
                            >
                                {article.featuredImage && (
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                                        <Image
                                            src={article.featuredImage}
                                            alt={article.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            placeholder="blur"
                                            blurDataURL={BLUR_PLACEHOLDER}
                                            sizes="64px"
                                        />
                                    </div>
                                )}
                                <div className="min-w-0 space-y-1">
                                    <p className="text-[11px] font-black uppercase tracking-widest text-primary">
                                        {article.category.name}
                                    </p>
                                    <p className="text-[14px] font-semibold text-neutral-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                        {article.title}
                                    </p>
                                    <div className="flex items-center gap-1 text-neutral-400 text-[12px]">
                                        <Clock className="w-3 h-3" />
                                        <span>{article.readingTimeMinutes} min</span>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </motion.section>
    );
}
