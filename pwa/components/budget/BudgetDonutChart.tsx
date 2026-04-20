import { useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatMAD } from "@/lib/utils";

const COLORS = ["#E8472A", "#C43A20", "#A0522D", "#6B7280", "#9CA3AF", "#D1D5DB"];
const UNALLOCATED_COLOR = "rgba(255,255,255,0.08)";

type View = "estimated" | "spent";

interface BudgetDonutChartProps {
  items: { category: string; estimatedAmount: number; spentAmount: number }[];
  totalBudget: number;
  progressPercent: number;
}

interface ChartEntry {
  name: string;
  value: number;
  isUnallocated?: boolean;
}

function groupByCategory(
  items: BudgetDonutChartProps["items"],
  view: View
): ChartEntry[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const val = view === "estimated" ? item.estimatedAmount : item.spentAmount;
    map.set(item.category, (map.get(item.category) ?? 0) + val);
  }
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: ChartEntry }[];
}) {
  if (!active || !payload?.length) return null;
  const entry = payload[0].payload;
  if (entry.isUnallocated) return null;
  return (
    <div className="bg-neutral-800 border border-white/10 rounded-2xl px-4 py-3 shadow-xl">
      <p className="text-white/60 text-[11px] font-black uppercase tracking-widest">
        {entry.name}
      </p>
      <p className="text-white text-lg font-black mt-0.5">
        {formatMAD(entry.value)}
      </p>
    </div>
  );
}

export default function BudgetDonutChart({
  items,
  totalBudget,
  progressPercent,
}: BudgetDonutChartProps) {
  const { t } = useTranslation("common");
  const { locale } = useRouter();
  const [view, setView] = useState<View>("estimated");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const categoryData = groupByCategory(items, view);
  const allocated = categoryData.reduce((s, e) => s + e.value, 0);
  const unallocated = Math.max(0, totalBudget - allocated);

  const chartData: ChartEntry[] =
    categoryData.length > 0
      ? [
          ...categoryData,
          ...(unallocated > 0
            ? [{ name: t("budget.unallocated"), value: unallocated, isUnallocated: true }]
            : []),
        ]
      : [{ name: "", value: 1, isUnallocated: true }];

  return (
    <div className="flex items-center gap-10 bg-white/5 p-8 rounded-[2.5rem] backdrop-blur-md border border-white/10">
      {/* Donut */}
      <div className="flex flex-col items-center gap-4 flex-shrink-0">
        <div className="w-40 h-40 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={72}
                dataKey="value"
                stroke="none"
                startAngle={90}
                endAngle={-270}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      entry.isUnallocated
                        ? UNALLOCATED_COLOR
                        : COLORS[i % COLORS.length]
                    }
                    outerRadius={
                      !entry.isUnallocated && activeIndex === i ? 80 : 72
                    }
                    opacity={
                      activeIndex !== null && activeIndex !== i && !entry.isUnallocated
                        ? 0.45
                        : 1
                    }
                    style={{ transition: "all 0.2s ease", cursor: entry.isUnallocated ? "default" : "pointer" }}
                  />
                ))}
              </Pie>
              {categoryData.length > 0 && <Tooltip content={<CustomTooltip />} />}
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-white leading-none">
              {Math.round(progressPercent)}%
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">
              {t("budget.spent_label")}
            </span>
          </div>
        </div>

        {/* Toggle */}
        <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
          {(["estimated", "spent"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => { setView(v); setActiveIndex(null); }}
              className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                view === v
                  ? "bg-primary text-white shadow-sm"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {t(`budget.view_${v}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3 flex-1 min-w-0">
        <p className="text-[11px] font-black uppercase tracking-widest text-white/40">
          {t("budget.chart_by_category")}
        </p>
        {categoryData.length > 0 ? (
          <div className="space-y-2">
            {categoryData.map((entry, i) => (
              <button
                key={entry.name}
                className="flex items-center gap-3 w-full text-start"
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform duration-150"
                  style={{
                    backgroundColor: COLORS[i % COLORS.length],
                    transform: activeIndex === i ? "scale(1.4)" : "scale(1)",
                  }}
                />
                <span
                  className="text-[13px] font-medium truncate flex-1 transition-colors"
                  style={{ color: activeIndex === i ? "white" : "rgba(255,255,255,0.6)" }}
                >
                  {entry.name}
                </span>
                <span className="text-white text-[13px] font-black flex-shrink-0">
                  {formatMAD(entry.value, locale)}
                </span>
              </button>
            ))}
            {unallocated > 0 && (
              <div className="flex items-center gap-3 pt-1 border-t border-white/10 mt-1">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-white/20" />
                <span className="text-[13px] font-medium text-white/30 flex-1">
                  {t("budget.unallocated")}
                </span>
                <span className="text-white/30 text-[13px] font-black flex-shrink-0">
                  {formatMAD(unallocated, locale)}
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-white/40 text-sm">{t("budget.empty")}</p>
        )}
        <div className="pt-2 border-t border-white/10">
          <p className="text-[11px] font-black uppercase tracking-widest text-white/40">
            {t("budget.total_label")}
          </p>
          <p className="text-xl font-black text-white mt-0.5">
            {formatMAD(totalBudget, locale)}
          </p>
        </div>
      </div>
    </div>
  );
}
