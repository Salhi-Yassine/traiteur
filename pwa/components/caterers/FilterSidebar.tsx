interface FilterSidebarProps {
    filters: {
        cuisineTypes: string[];
        serviceStyles: string[];
        priceRanges: string[];
    };
    selected: {
        cuisineTypes: string[];
        serviceStyles: string[];
        priceRanges: string[];
    };
    onChange: (key: string, value: string, checked: boolean) => void;
    onClear: () => void;
}

const ALL_CUISINE_TYPES = [
    "Algerian", "Mediterranean", "French", "Italian", "Oriental",
    "Berber", "Traditional", "International",
];
const ALL_SERVICE_STYLES = ["Buffet", "Plated", "Cocktail", "Family Style", "Food Truck"];
const ALL_PRICE_RANGES = [
    { label: "Budget", value: "$" },
    { label: "Moderate", value: "$$" },
    { label: "Premium", value: "$$$" },
    { label: "Luxury", value: "$$$$" },
];

export default function FilterSidebar({
    selected,
    onChange,
    onClear,
}: FilterSidebarProps) {
    const hasFilters =
        selected.cuisineTypes.length > 0 ||
        selected.serviceStyles.length > 0 ||
        selected.priceRanges.length > 0;

    return (
        <aside className="w-full lg:w-64 shrink-0" aria-label="Filter caterers">
            <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] p-5 sticky top-24">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-display font-semibold text-[var(--color-charcoal-900)]">
                        Filters
                    </h2>
                    {hasFilters && (
                        <button
                            onClick={onClear}
                            className="text-xs text-[var(--color-teal-700)] hover:text-[var(--color-teal-900)] font-medium transition-colors"
                        >
                            Clear all
                        </button>
                    )}
                </div>

                {/* Cuisine types */}
                <FilterSection title="Cuisine Type">
                    {ALL_CUISINE_TYPES.map((c) => (
                        <CheckRow
                            key={c}
                            label={c}
                            checked={selected.cuisineTypes.includes(c)}
                            onChange={(checked) => onChange("cuisineTypes", c, checked)}
                        />
                    ))}
                </FilterSection>

                <div className="h-px bg-[var(--color-sand-200)] my-4" />

                {/* Service styles */}
                <FilterSection title="Service Style">
                    {ALL_SERVICE_STYLES.map((s) => (
                        <CheckRow
                            key={s}
                            label={s}
                            checked={selected.serviceStyles.includes(s)}
                            onChange={(checked) => onChange("serviceStyles", s, checked)}
                        />
                    ))}
                </FilterSection>

                <div className="h-px bg-[var(--color-sand-200)] my-4" />

                {/* Price range */}
                <FilterSection title="Price Range">
                    {ALL_PRICE_RANGES.map(({ label, value }) => (
                        <CheckRow
                            key={value}
                            label={`${value} · ${label}`}
                            checked={selected.priceRanges.includes(value)}
                            onChange={(checked) => onChange("priceRanges", value, checked)}
                        />
                    ))}
                </FilterSection>
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
        <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-charcoal-500)] mb-3">
                {title}
            </h3>
            <div className="space-y-2">{children}</div>
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
        <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--color-charcoal-300)] text-[var(--color-teal-700)] focus:ring-[var(--color-teal-500)]"
            />
            <span className="text-sm text-[var(--color-charcoal-700)] group-hover:text-[var(--color-charcoal-900)] transition-colors">
                {label}
            </span>
        </label>
    );
}
