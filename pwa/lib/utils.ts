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

export function formatMADK(amount: number, locale = "fr"): string {
  if (amount >= 1000) {
    const kAmount = amount / 1000;
    const fmt = new Intl.NumberFormat(
      locale === "ar" || locale === "ary" ? "ar-MA" : "fr-MA",
      { maximumFractionDigits: 1 }
    );
    return `${fmt.format(kAmount)}k MAD`;
  }
  return formatMAD(amount, locale);
}

export function getInspirationImageUrl(imageName: string, width = 800, quality = 80): string {
  // For UI/UX testing, use placeholder images when local images don't exist
  const placeholderImages: Record<string, string> = {
    'moroccan_wedding_centerpiece': 'https://images.unsplash.com/photo-1519741497674-611481863552',
    'moroccan_bride_negafa': 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65',
    'moroccan_table_setting': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b',
    'moroccan_caftan_detail': 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65',
    'riad_sunset_wedding': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3',
    'moroccan_wedding_cake': 'https://images.unsplash.com/photo-1535254973040-607b474cb50d',
  };

  const baseUrl = placeholderImages[imageName] || placeholderImages['moroccan_wedding_centerpiece'];
  return `${baseUrl}?w=${width}&q=${quality}&auto=format&fit=crop`;
}
