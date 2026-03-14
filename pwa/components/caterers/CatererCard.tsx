import Image from "next/image";
import Link from "next/link";
import StarRating from "../ui/StarRating";
import Badge from "../ui/Badge";
import PriceRange from "../ui/PriceRange";

export interface CatererCardProps {
    id: number;
    slug: string;
    businessName: string;
    tagline?: string;
    serviceArea: string;
    cuisineTypes: string[];
    priceRange: string;
    coverImageUrl?: string;
    averageRating?: number;
    reviewCount?: number;
    isVerified?: boolean;
}

export default function CatererCard({
    slug,
    businessName,
    tagline,
    serviceArea,
    cuisineTypes,
    priceRange,
    coverImageUrl,
    averageRating,
    reviewCount,
    isVerified,
}: CatererCardProps) {
    const fallbackImg = `https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80`;

    return (
        <Link
            href={`/caterers/${slug}`}
            className="group block bg-white rounded-2xl overflow-hidden card-hover shadow-[var(--shadow-card)] focus-visible:outline-2 focus-visible:outline-[var(--color-teal-600)]"
        >
            {/* Image */}
            <div className="img-zoom relative h-52 w-full bg-[var(--color-sand-200)]">
                <Image
                    src={coverImageUrl ?? fallbackImg}
                    alt={businessName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 card-gradient" />

                {/* Verified badge */}
                {isVerified && (
                    <div className="absolute top-3 left-3">
                        <Badge label="Verified" variant="verified" />
                    </div>
                )}

                {/* Price on image */}
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1">
                    <PriceRange value={priceRange} />
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-display font-semibold text-lg text-[var(--color-charcoal-900)] group-hover:text-[var(--color-teal-700)] transition-colors leading-tight">
                        {businessName}
                    </h3>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 text-[var(--color-charcoal-500)] text-sm mb-2">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{serviceArea}</span>
                </div>

                {/* Rating */}
                {averageRating !== undefined && averageRating > 0 && (
                    <div className="mb-3">
                        <StarRating
                            rating={averageRating}
                            reviewCount={reviewCount}
                            size="sm"
                        />
                    </div>
                )}

                {/* Tagline */}
                {tagline && (
                    <p className="text-[var(--color-charcoal-500)] text-sm leading-snug mb-3 line-clamp-2">
                        {tagline}
                    </p>
                )}

                {/* Cuisine tags */}
                <div className="flex flex-wrap gap-1.5">
                    {cuisineTypes.slice(0, 3).map((cuisine) => (
                        <Badge key={cuisine} label={cuisine} variant="cuisine" />
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-4 pt-3 border-t border-[var(--color-sand-100)]">
                    <span className="text-sm font-semibold text-[var(--color-teal-700)] group-hover:text-[var(--color-teal-800)] transition-colors">
                        View Profile & Request Quote →
                    </span>
                </div>
            </div>
        </Link>
    );
}
