import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "next-i18next";

export interface WeddingStory {
    id: string;
    slug: string;
    coupleNames: string;
    location: string;
    vibe: string;
    coverImage: string;
    style?: string;
    season?: string;
    colorPalette?: string[];
    gallery: string[];
    description: string;
    celebrationTimeline?: Array<{ time: string; event: string; description: string }>;
    vendorCredits: Array<{
        role: string;
        name: string;
        slug?: string;
    }>;
}

interface WeddingStoryCardProps {
    story: WeddingStory;
    onClick: () => void;
}

export default function WeddingStoryCard({ story, onClick }: WeddingStoryCardProps) {
    const { t } = useTranslation("common");

    return (
        <motion.button
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={onClick}
            className="group relative flex flex-col w-full text-start focus:outline-none"
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-neutral-100 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                <Image
                    src={story.coverImage.startsWith('http') ? story.coverImage : `/images/inspiration/${story.coverImage}.png`}
                    alt={`${story.coupleNames}'s Wedding`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                {/* Info Overlay (Bottom) */}
                <div className="absolute bottom-0 inset-x-0 p-8 space-y-2">
                    <div className="flex items-center gap-2 text-white/80 text-[13px] font-medium uppercase tracking-wider">
                        <MapPin size={14} className="text-[#E8472A]" />
                        {story.location}
                    </div>
                    <h3 className="font-display text-white text-3xl leading-tight">
                        {story.coupleNames}
                    </h3>
                </div>

                {/* Quick Badge (Top End) */}
                <div className="absolute top-6 end-6 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[12px] font-bold uppercase tracking-widest shadow-xl">
                    {story.vibe}
                </div>
            </div>

            {/* Sub-info (optional visual cue) */}
            <div className="mt-4 flex items-center gap-3 px-2">
                <div className="flex -space-x-2">
                    {story.vendorCredits.slice(0, 3).map((_, i) => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-[#FEF0ED] flex items-center justify-center text-[10px] font-bold text-primary">
                            <Users size={10} />
                        </div>
                    ))}
                </div>
                <span className="text-[13px] text-[#717171] font-medium">
                    {t("inspiration.vendors_featured", { count: story.vendorCredits.length })}
                </span>
            </div>
        </motion.button>
    );
}
