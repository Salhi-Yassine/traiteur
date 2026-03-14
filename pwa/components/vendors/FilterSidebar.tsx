import { cn } from "@/lib/utils";
import { useTranslation } from "next-i18next";
import { Checkbox } from "../ui/checkbox";

interface FilterSidebarProps {
    selected: {
        category: string[];
        priceRanges: string[];
    };
    onChange: (key: string, value: string, checked: boolean) => void;
    onClear: () => void;
}

const ALL_CATEGORIES = [
    { value: "Salles",      label: "Salles de Fête" },
    { value: "Catering",    label: "Traiteurs" },
    { value: "Negrafa",     label: "Négafas" },
    { value: "Photography", label: "Photographes" },
    { value: "Music",       label: "DJs & Orchestres" },
    { value: "Decoration",  label: "Décoration" },
    { value: "Beauty",      label: "Beauté" },
    { value: "Transport",   label: "Transport" },
];

const ALL_PRICE_RANGES = [
    { label: "Budget",   value: "MAD" },
    { label: "Standard", value: "MADMAD" },
    { label: "Premium",  value: "MADMADMAD" },
    { label: "Exclusif", value: "MADMADMAD+" },
];

// v3.0 — neutral-first filter sidebar with terracotta active states
export default function FilterSidebar({ selected, onChange, onClear }: FilterSidebarProps) {
    const { t } = useTranslation("common");
    const hasFilters =
        selected.category.length > 0 ||
        selected.priceRanges.length > 0;

    return (
        <aside className="w-full" aria-label={t("filters.title")}>
            <div className="bg-white rounded-[24px] border border-[#DDDDDD] shadow-[0_1px_2px_rgba(0,0,0,0.08)] p-6 sticky top-28">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold text-[16px] text-[#1A1A1A]">{t("filters.title")}</h2>
                    {hasFilters && (
                        <button
                            onClick={onClear}
                            className="text-[13px] font-medium text-[#E8472A] hover:text-[#C43A20] transition-colors underline underline-offset-2"
                        >
                            {t("filters.clear")}
                        </button>
                    )}
                </div>

                <div className="space-y-8">
                    {/* Categories */}
                    <FilterSection title={t("filters.categories")}>
                        {ALL_CATEGORIES.map((c) => (
                            <CheckRow
                                key={c.value}
                                label={t(`search_bar.categories.${c.value.toLowerCase()}`)}
                                checked={selected.category.includes(c.value)}
                                onChange={(checked) => onChange("category", c.value, checked)}
                            />
                        ))}
                    </FilterSection>

                    <div className="h-px bg-[#DDDDDD]" />

                    {/* Price ranges */}
                    <FilterSection title={t("filters.price_range")}>
                        {ALL_PRICE_RANGES.map(({ label, value }) => (
                            <CheckRow
                                key={value}
                                label={t(`filters.price_labels.${label.toLowerCase()}`)}
                                checked={selected.priceRanges.includes(value)}
                                onChange={(checked) => onChange("priceRanges", value, checked)}
                            />
                        ))}
                    </FilterSection>

                    <div className="h-px bg-[#DDDDDD]" />

                    {/* Assistance CTA */}
                    <div className="p-4 bg-[#FEF0ED] rounded-[16px]">
                        <p className="text-[13px] font-medium text-[#1A1A1A] mb-1">{t("filters.help_title")}</p>
                        <p className="text-[12px] text-[#717171] leading-relaxed mb-3">
                            {t("filters.help_desc")}
                        </p>
                        <button className="text-[13px] font-semibold text-[#E8472A] hover:text-[#C43A20] transition-colors flex items-center gap-1">
                            {t("filters.contact_us")}
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#B0B0B0]">
                {title}
            </h3>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

function CheckRow({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <label className="flex items-center justify-between gap-3 cursor-pointer group">
            <span className={cn(
                "text-[14px] transition-colors",
                checked ? "text-[#1A1A1A] font-medium" : "text-[#484848] group-hover:text-[#1A1A1A]"
            )}>
                {label}
            </span>
            <div className="relative flex items-center shrink-0">
                <Checkbox
                    checked={checked}
                    onCheckedChange={(checked) => onChange(checked as boolean)}
                    className="w-5 h-5 rounded-md border-[1.5px] border-[#DDDDDD] text-[#E8472A] 
                        data-[state=checked]:bg-[#E8472A] data-[state=checked]:border-[#E8472A] data-[state=checked]:text-white
                        focus-visible:ring-0 focus-visible:ring-offset-0
                        hover:border-[#B0B0B0] transition-colors"
                />
            </div>
        </label>
    );
}
