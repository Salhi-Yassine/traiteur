import { cn } from "@/lib/utils";

interface FilterSidebarProps {
    selected: {
        category: string[];
        priceRanges: string[];
    };
    onChange: (key: string, value: string, checked: boolean) => void;
    onClear: () => void;
}

const ALL_CATEGORIES = [
    "Salles", "Catering", "Negrafa", "Photography", "Music", "Decoration", "Beauty", "Transport"
];

const ALL_PRICE_RANGES = [
    { label: "Budget", value: "MAD" },
    { label: "Standard", value: "MADMAD" },
    { label: "Premium", value: "MADMADMAD" },
    { label: "Exclusif", value: "MADMADMAD+" },
];

export default function FilterSidebar({
    selected,
    onChange,
    onClear,
}: FilterSidebarProps) {
    const hasFilters =
        selected.category.length > 0 ||
        selected.priceRanges.length > 0;

    return (
        <aside className="w-full space-y-8" aria-label="Filtrer les prestataires">
            <div className="bg-white rounded-[2.5rem] shadow-premium p-8 sticky top-32 border border-border/50">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <h2 className="font-display font-black text-2xl text-primary">
                        Filtres
                    </h2>
                    {hasFilters && (
                        <button
                            onClick={onClear}
                            className="text-[10px] font-black text-secondary hover:text-primary uppercase tracking-[0.2em] transition-colors"
                        >
                            Réinitialiser
                        </button>
                    )}
                </div>

                <div className="space-y-12">
                    {/* Categories */}
                    <FilterSection title="Catégories">
                        {ALL_CATEGORIES.map((c) => (
                            <CheckRow
                                key={c}
                                label={c}
                                checked={selected.category.includes(c)}
                                onChange={(checked) => onChange("category", c, checked)}
                            />
                        ))}
                    </FilterSection>

                    <div className="h-px bg-border/60" />

                    {/* Price range */}
                    <FilterSection title="Budget & Standing">
                        {ALL_PRICE_RANGES.map(({ label, value }) => (
                            <CheckRow
                                key={value}
                                label={label}
                                subLabel={value}
                                checked={selected.priceRanges.includes(value)}
                                onChange={(checked) => onChange("priceRanges", value, checked)}
                            />
                        ))}
                    </FilterSection>
                </div>

                {/* Inspiration CTA */}
                <div className="mt-12 p-6 bg-accent/5 rounded-3xl border border-secondary/10 relative overflow-hidden group">
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-colors" />
                    <p className="text-[10px] font-black text-primary mb-3 uppercase tracking-widest relative z-10">Assistance Express</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4 relative z-10">
                        Besoin d'une recommandation personnalisée ? Nos experts sont là.
                    </p>
                    <button className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] hover:text-primary transition-colors relative z-10 flex items-center gap-2">
                        Contactez-nous
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </aside>
    );
}

function FilterSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">
                {title}
            </h3>
            <div className="space-y-4">{children}</div>
        </div>
    );
}

function CheckRow({
    label,
    subLabel,
    checked,
    onChange,
}: {
    label: string;
    subLabel?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <label className="flex items-center justify-between group cursor-pointer">
            <div className="flex flex-col">
                <span className={cn(
                    "text-xs font-bold transition-colors uppercase tracking-widest",
                    checked ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                )}>
                    {label}
                </span>
                {subLabel && (
                    <span className="text-[10px] font-black text-secondary/60 tracking-tighter">
                        {subLabel}
                    </span>
                )}
            </div>
            <div className="relative flex items-center">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="peer w-6 h-6 rounded-lg border-2 border-border text-secondary focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer hover:border-secondary/50 checked:border-secondary checked:bg-secondary"
                />
                <svg className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-1 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                </svg>
            </div>
        </label>
    );
}
