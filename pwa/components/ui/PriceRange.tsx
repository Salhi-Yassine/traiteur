import { cn } from "@/lib/utils";

// v3.0 — Price symbols in neutral-900 (active) / neutral-300 (dim)
interface PriceRangeProps {
    value: string; // "MAD", "MADMAD", "MADMADMAD", "MADMADMAD+"
    label?: boolean;
    className?: string;
    /** When on a dark/colored bg, use light mode for the dim color */
    lightMode?: boolean;
}

const PRICE_LABELS: Record<string, string> = {
    "MAD":        "Budget",
    "MADMAD":     "Standard",
    "MADMADMAD":  "Premium",
    "MADMADMAD+": "Exclusif",
};

export default function PriceRange({ value, label = false, className, lightMode = false }: PriceRangeProps) {
    const max = 4;
    const active = value.replace("+", "").length / 3;

    return (
        <div
            className={cn("inline-flex items-center gap-1.5", className)}
            aria-label={`Gamme de prix: ${PRICE_LABELS[value] ?? value}`}
        >
            <div className="flex gap-0.5">
                {Array.from({ length: max }, (_, i) => (
                    <span
                        key={i}
                        className={cn(
                            "text-[11px] font-semibold tracking-tight transition-colors",
                            i < active
                                ? "text-[#1A1A1A]"                                    // active — neutral-900
                                : lightMode ? "text-white/25" : "text-[#B0B0B0]"      // dim — neutral-300 or white
                        )}
                    >
                        درهم
                    </span>
                ))}
            </div>
            {label && (
                <span className="text-[11px] font-medium text-[#717171]">
                    {PRICE_LABELS[value]}
                </span>
            )}
        </div>
    );
}
