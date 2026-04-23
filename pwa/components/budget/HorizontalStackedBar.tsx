import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { formatMAD } from "@/lib/utils";

const COLORS = ["#E8472A", "#C43A20", "#A0522D", "#8B4513", "#CD853F", "#D2691E", "#F4A460", "#DAA520", "#B8860B", "#A0522D"];
const UNALLOCATED_COLOR = "rgba(255,255,255,0.08)";

interface BudgetItem {
    category: string;
    estimatedAmount: number;
    quotedAmount?: number;
}

interface HorizontalStackedBarProps {
    items: BudgetItem[];
    totalBudget: number;
    totalSpent: number;
}

export default function HorizontalStackedBar({ items, totalBudget, totalSpent }: HorizontalStackedBarProps) {
    const { t } = useTranslation("common");
    const { locale } = useRouter();

    const isOverBudget = totalBudget > 0 && totalSpent > totalBudget;

    // Helper: get committed amount (quoted or estimated)
    const getCommitted = (item: BudgetItem) => item.quotedAmount ?? item.estimatedAmount;

    // Group by category, calculating committed amounts
    const categoryMap = new Map<string, number>();
    for (const item of items) {
        categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + getCommitted(item));
    }

    // Sort categories by amount descending
    const categoryData = Array.from(categoryMap.entries())
        .map(([name, value]) => ({ name, value }))
        .filter(c => c.value > 0)
        .sort((a, b) => b.value - a.value);

    const allocated = categoryData.reduce((acc, curr) => acc + curr.value, 0);
    const unallocated = Math.max(0, totalBudget - allocated);

    // If totalBudget is 0 or less than what we've allocated, the base is the total allocated to show correct proportions.
    const baseTotal = totalBudget > 0 ? Math.max(totalBudget, allocated) : (allocated || 1);

    return (
        <div className="w-full mt-8 pt-8 border-t border-white/10">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-1">
                        {t("budget.allocation_title", "RÉPARTITION DU BUDGET")}
                    </h4>
                    <p className="text-sm font-medium text-white/70">
                        {t("budget.allocation_desc", "Répartition des dépenses par catégorie")}
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-1 block">
                        {t("budget.total_spent", "Total Engagé")}
                    </span>
                    <span className={`text-2xl font-black ${isOverBudget ? "text-red-400" : "text-white"}`}>
                        {formatMAD(totalSpent, locale)}
                    </span>
                </div>
            </div>

            {/* The Bar */}
            <div className="w-full h-8 bg-white/5 rounded-full overflow-hidden flex shadow-inner">
                {categoryData.map((entry, i) => {
                    const widthPercent = (entry.value / baseTotal) * 100;
                    if (widthPercent <= 0) return null;
                    return (
                        <div
                            key={entry.name}
                            className="h-full group relative transition-all duration-300 hover:opacity-90 border-r border-neutral-900/20 last:border-0"
                            style={{ 
                                width: `${widthPercent}%`,
                                backgroundColor: COLORS[i % COLORS.length] 
                            }}
                        >
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-xl border border-white/10">
                                <p className="font-bold mb-0.5">{t(`budget.categories.${entry.name}`, { defaultValue: entry.name })}</p>
                                <p className="text-white/70">{formatMAD(entry.value, locale)} ({Math.round(widthPercent)}%)</p>
                            </div>
                        </div>
                    );
                })}
                {unallocated > 0 && (
                    <div 
                        className="h-full group relative transition-all duration-300 hover:opacity-90"
                        style={{ 
                            width: `${(unallocated / baseTotal) * 100}%`,
                            backgroundColor: UNALLOCATED_COLOR 
                        }}
                    >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-xl border border-white/10">
                            <p className="font-bold mb-0.5">{t("budget.unallocated", "Non alloué")}</p>
                            <p className="text-white/70">{formatMAD(unallocated, locale)} ({Math.round((unallocated / baseTotal) * 100)}%)</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Legend (compact) */}
            <div className="mt-4 flex flex-wrap gap-4">
                {categoryData.slice(0, 5).map((entry, i) => (
                    <div key={entry.name} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                            {t(`budget.categories.${entry.name}`, { defaultValue: entry.name })}
                        </span>
                    </div>
                ))}
                {categoryData.length > 5 && (
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                            +{categoryData.length - 5} {t("budget.others", "Autres")}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
