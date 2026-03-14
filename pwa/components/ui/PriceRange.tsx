import { cn } from "@/lib/utils";

interface PriceRangeProps {
    value: string; // "MAD", "MADMAD", etc.
    label?: boolean;
    className?: string;
}

const PRICE_LABELS: Record<string, string> = {
    "MAD": "Budget",
    "MADMAD": "Standard",
    "MADMADMAD": "Premium",
    "MADMADMAD+": "Exclusif",
};

export default function PriceRange({ value, label = false, className }: PriceRangeProps) {
    const max = 4;
    // Map the string length to a level, handling '+' suffix
    const active = value.replace("+", "").length / 3; 

    return (
        <div className={cn("inline-flex items-center gap-2", className)} aria-label={`Gamme de prix: ${PRICE_LABELS[value] ?? value}`}>
            <div className="flex gap-0.5">
                {Array.from({ length: max }, (_, i) => (
                    <span
                        key={i}
                        className={cn(
                            "text-[10px] font-black tracking-tighter transition-colors",
                            i < active ? "text-inherit" : "text-white/20"
                        )}
                    >
                        MAD
                    </span>
                ))}
            </div>
            {label && (
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    {PRICE_LABELS[value]}
                </span>
            )}
        </div>
    );
}
