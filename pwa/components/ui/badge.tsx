import { cn } from "@/lib/utils";

// v3.0 — removed gold variant, added verified/primary/neutral
const badgeVariants = {
  default:  "bg-[#1A1A1A] text-white border-transparent",
  primary:  "bg-[#FEF0ED] text-[#E8472A] border-transparent",       // terracotta tint
  neutral:  "bg-[#F7F7F7] text-[#484848] border-[#DDDDDD]",         // neutral pill
  accent:   "bg-[#FEF0ED] text-[#C43A20] border-transparent",        // alias for primary
  verified: "bg-[#E8F5EE] text-[#0A7A4B] border-transparent",        // success green
  warning:  "bg-[#FFF8E7] text-[#8A5700] border-transparent",
  danger:   "bg-[#FEECEC] text-[#C13030] border-transparent",
  outline:  "bg-transparent text-[#484848] border-[#DDDDDD]",
  category: "bg-[#F7F7F7] text-[#484848] border-transparent text-[10px]",  // category pill on cards
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
