import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export interface Hotspot {
    /** Left position in percentage (0–100) */
    x: number;
    /** Top position in percentage (0–100) */
    y: number;
    label: string;
    vendorSlug: string;
    vendorName: string;
    category?: string;
}

interface ImageHotspotProps {
    imageUrl: string;
    alt: string;
    hotspots: Hotspot[];
}

export default function ImageHotspot({ imageUrl, alt, hotspots }: ImageHotspotProps) {
    const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

    return (
        <div className="relative w-full aspect-[16/9] rounded-[2rem] overflow-hidden group select-none my-10">
            <Image
                src={imageUrl}
                alt={alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 900px"
            />

            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />

            {/* Hotspot pins */}
            {hotspots.map((hotspot, idx) => (
                <div
                    key={idx}
                    className="absolute"
                    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, transform: "translate(-50%, -50%)" }}
                >
                    {/* Pulsing rings */}
                    <span className="absolute inset-0 rounded-full bg-white/60 animate-ping scale-150 pointer-events-none" />
                    <span className="absolute inset-0 rounded-full bg-white/30 animate-ping scale-125 delay-300 pointer-events-none" />

                    {/* Pin button */}
                    <button
                        onMouseEnter={() => setActiveHotspot(idx)}
                        onMouseLeave={() => setActiveHotspot(null)}
                        onFocus={() => setActiveHotspot(idx)}
                        onBlur={() => setActiveHotspot(null)}
                        className="relative w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-primary hover:scale-110 transition-transform z-10"
                        aria-label={hotspot.label}
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-primary block" />
                    </button>

                    {/* Tooltip card */}
                    <AnimatePresence>
                        {activeHotspot === idx && (
                            <motion.div
                                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                                transition={{ duration: 0.18 }}
                                className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 w-52 pointer-events-auto"
                            >
                                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-100">
                                    <div className="px-4 py-3 space-y-1">
                                        {hotspot.category && (
                                            <p className="text-[9px] font-black uppercase tracking-widest text-primary">
                                                {hotspot.category}
                                            </p>
                                        )}
                                        <p className="font-semibold text-[13px] text-neutral-900 leading-tight">
                                            {hotspot.vendorName}
                                        </p>
                                        <p className="text-[11px] text-neutral-400">{hotspot.label}</p>
                                    </div>
                                    <Link
                                        href={`/vendors/${hotspot.vendorSlug}`}
                                        className="flex items-center justify-between px-4 py-2.5 bg-neutral-50 hover:bg-primary/5 text-primary text-[12px] font-black uppercase tracking-wider transition-colors border-t border-neutral-100"
                                    >
                                        Voir le profil
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                                {/* Tooltip arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white drop-shadow-sm" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}

            {/* "Shop this look" badge */}
            <div className="absolute bottom-4 start-4 bg-white/90 backdrop-blur-md text-neutral-900 text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                ✦ Survolez pour découvrir
            </div>
        </div>
    );
}
