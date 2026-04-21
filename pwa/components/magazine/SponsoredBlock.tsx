import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Award } from "lucide-react";

const BLUR_PLACEHOLDER =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

export interface SponsorData {
    vendorName: string;
    vendorSlug: string;
    tagline: string;
    logoUrl?: string;
    coverImageUrl: string;
    category: string;
    ctaLabel?: string;
}

interface SponsoredBlockProps {
    sponsor: SponsorData;
}

export default function SponsoredBlock({ sponsor }: SponsoredBlockProps) {
    return (
        <motion.aside
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="my-12 not-prose"
            aria-label="Contenu sponsorisé"
        >
            {/* "Sponsored" label */}
            <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-neutral-100" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Partenaire Officiel
                </span>
                <div className="h-px flex-1 bg-neutral-100" />
            </div>

            <Link
                href={`/vendors/${sponsor.vendorSlug}`}
                className="group block rounded-[2rem] overflow-hidden border border-neutral-100 shadow-sm hover:shadow-lg transition-all duration-400"
            >
                {/* Cover image */}
                <div className="relative h-48 w-full overflow-hidden">
                    <Image
                        src={sponsor.coverImageUrl}
                        alt={sponsor.vendorName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                        sizes="(max-width: 768px) 100vw, 700px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Logo overlay */}
                    {sponsor.logoUrl && (
                        <div className="absolute top-4 start-4 bg-white rounded-xl px-3 py-1.5 shadow-md">
                            <Image
                                src={sponsor.logoUrl}
                                alt={`Logo ${sponsor.vendorName}`}
                                width={80}
                                height={28}
                                className="object-contain"
                            />
                        </div>
                    )}

                    {/* Verified badge */}
                    <div className="absolute top-4 end-4 flex items-center gap-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow">
                        <Award className="w-3 h-3" />
                        Vérifié Farah
                    </div>
                </div>

                {/* Content */}
                <div className="flex items-center justify-between gap-4 px-6 py-5 bg-white">
                    <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">
                            {sponsor.category}
                        </p>
                        <p className="font-semibold text-neutral-900 text-[16px] leading-tight truncate">
                            {sponsor.vendorName}
                        </p>
                        <p className="text-neutral-500 text-[13px] mt-0.5 line-clamp-1">
                            {sponsor.tagline}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-primary text-white text-[12px] font-black uppercase tracking-widest px-4 py-2.5 rounded-full shrink-0 group-hover:scale-105 transition-transform">
                        {sponsor.ctaLabel ?? "Voir le profil"}
                        <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                </div>
            </Link>
        </motion.aside>
    );
}
