import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMAD(amount: number, locale = "fr"): string {
  const fmt = new Intl.NumberFormat(
    locale === "ar" || locale === "ary" ? "ar-MA" : "fr-MA",
    { maximumFractionDigits: 0 }
  );
  return `${fmt.format(amount)} MAD`;
}
