interface PriceRangeProps {
    value: string; // "$" | "$$" | "$$$" | "$$$$"
    label?: boolean;
}

const PRICE_LABELS: Record<string, string> = {
    "$": "Budget",
    "$$": "Moderate",
    "$$$": "Premium",
    "$$$$": "Luxury",
};

export default function PriceRange({ value, label = false }: PriceRangeProps) {
    const max = 4;
    const active = value.length;

    return (
        <span className="inline-flex items-center gap-1" aria-label={`Price range: ${PRICE_LABELS[value] ?? value}`}>
            <span className="font-semibold text-sm tracking-tight">
                {Array.from({ length: max }, (_, i) => (
                    <span
                        key={i}
                        className={i < active ? "price-active" : "price-dim"}
                    >
                        $
                    </span>
                ))}
            </span>
            {label && (
                <span className="text-xs text-[var(--color-charcoal-500)] ml-1">
                    {PRICE_LABELS[value]}
                </span>
            )}
        </span>
    );
}
