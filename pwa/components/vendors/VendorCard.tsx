import Image from "next/image";
import Link from "next/link";
import StarRating from "../ui/StarRating";
import { Badge } from "../ui/badge";
import PriceRange from "../ui/PriceRange";

export interface VendorCardProps {
    id: number;
    slug: string;
    businessName: string;
    tagline?: string;
    serviceArea: string;
    category: string;
    priceRange: string;
    coverImageUrl?: string;
    averageRating?: number;
    reviewCount?: number;
    isVerified?: boolean;
}

export default function VendorCard({
    slug,
    businessName,
    tagline,
    serviceArea,
    category,
    priceRange,
    coverImageUrl,
    averageRating,
    reviewCount,
    isVerified,
}: VendorCardProps) {
    const fallbackImg = `https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80`;

    return (
        <Link
            href={`/vendors/${slug}`}
            className="group block bg-white rounded-[2.5rem] overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-500 border border-border/50 hover:border-secondary/20 hover:-translate-y-2"
        >
            {/* Image */}
            <div className="relative h-72 w-full bg-accent overflow-hidden">
                <Image
                    src={coverImageUrl ?? fallbackImg}
                    alt={businessName}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Verified badge */}
                {isVerified && (
                    <div className="absolute top-6 left-6">
                        <Badge variant="gold" className="px-4 py-1.5 shadow-gold">
                            <span className="flex items-center gap-1.5">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Vérifié
                            </span>
                        </Badge>
                    </div>
                )}

                {/* Price on image */}
                <div className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2 shadow-2xl">
                    <PriceRange value={priceRange} className="text-white font-bold" />
                </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-5">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">
                            {category}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            <svg className="w-3 h-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {serviceArea}
                        </span>
                    </div>
                    <h3 className="font-display font-black text-2xl text-primary leading-tight group-hover:text-secondary transition-colors">
                        {businessName}
                    </h3>
                </div>

                {/* Rating */}
                {averageRating !== undefined && averageRating > 0 && (
                    <div className="flex items-center gap-4">
                        <StarRating
                            rating={averageRating}
                            reviewCount={reviewCount}
                            size="sm"
                        />
                        <span className="h-4 w-px bg-border" />
                        <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">
                            {reviewCount} Avis
                        </span>
                    </div>
                )}

                {/* Tagline */}
                {tagline && (
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 italic font-medium">
                        "{tagline}"
                    </p>
                )}

                {/* CTA */}
                <div className="pt-6 border-t border-border flex items-center justify-between group/cta">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] group-hover:text-secondary transition-colors">
                        Explorer le Profil
                    </span>
                    <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-secondary group-hover:border-secondary transition-all">
                        <svg className="w-4 h-4 text-secondary group-hover:text-white group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}
