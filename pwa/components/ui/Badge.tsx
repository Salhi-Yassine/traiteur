interface BadgeProps {
    label: string;
    variant?: "cuisine" | "style" | "dietary" | "price" | "verified";
}

const VARIANT_STYLES: Record<string, string> = {
    cuisine: "bg-[var(--color-teal-50)] text-[var(--color-teal-800)] border border-[var(--color-teal-200)]",
    style: "bg-[var(--color-sand-100)] text-[var(--color-charcoal-700)] border border-[var(--color-sand-200)]",
    dietary: "bg-green-50 text-green-700 border border-green-200",
    price: "bg-[var(--color-gold-50)] text-[var(--color-gold-600)] border border-[var(--color-gold-200)] font-semibold",
    verified: "bg-[var(--color-teal-700)] text-white",
};

export default function Badge({ label, variant = "cuisine" }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${VARIANT_STYLES[variant]}`}
        >
            {variant === "verified" && (
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
            )}
            {label}
        </span>
    );
}
