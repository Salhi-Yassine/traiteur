import { useState } from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import WeddingStoryCard, { WeddingStory } from "./WeddingStoryCard";
import WeddingStoryModal from "./WeddingStoryModal";
import { motion } from "framer-motion";

const MOCK_STORIES: WeddingStory[] = [
    {
        id: "1",
        slug: "yassine-sarah-casablanca",
        coupleNames: "Sarah & Yassine",
        location: "Casablanca",
        vibe: "Palatial Elegance",
        coverImageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80",
        description: "A breathtaking celebration in the heart of Casablanca, blending traditional Moroccan hospitality with modern luxury. From the custom-designed Negafa sets to the 5-course gourmet catering, every detail was a testament to their love story.",
        gallery: [
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80",
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80",
            "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80",
        ],
        vendorCredits: [
            { role: "Venue", name: "Palais des Roses", slug: "palais-des-roses-casablanca" },
            { role: "Negafa", name: "Dar El Makhzen", slug: "negafa-dar-el-makhzen-fes" },
            { role: "Photo", name: "Zeryab Studios" },
            { role: "Catering", name: "Gourmet Morocco" },
        ]
    },
    {
        id: "2",
        slug: "anass-leila-marrakech",
        coupleNames: "Leila & Anass",
        location: "Marrakech",
        vibe: "Boho Desert",
        coverImageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80",
        description: "A sunset ceremony in the Agafay desert. Leila and Anass wanted a celebration that felt raw, intimate, and deeply connected to the Moroccan landscape. Warm earth tones, hundreds of candles, and the sound of the Gnaoua.",
        gallery: [
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80",
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80",
        ],
        vendorCredits: [
            { role: "Venue", name: "Desert Dream Camp" },
            { role: "Decor", name: "Agafay Events" },
            { role: "Music", name: "Gnaoua Spirit" },
        ]
    },
    {
        id: "3",
        slug: "mehdi-kenza-tangier",
        coupleNames: "Kenza & Mehdi",
        location: "Tangier",
        vibe: "Mediterranean Glow",
        coverImageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80",
        description: "A sophisticated garden wedding overlooking the Strait of Gibraltar. Clean lines, white florals, and a focus on the stunning Tangier sunset.",
        gallery: [
            "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80",
        ],
        vendorCredits: [
            { role: "Venue", name: "Villa de France" },
            { role: "Photo", name: "Nordic Frames" },
        ]
    }
];

export default function WeddingStoriesSection() {
    const { t } = useTranslation("common");
    const [selectedStory, setSelectedStory] = useState<WeddingStory | null>(null);

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[#E8472A] font-bold text-sm uppercase tracking-widest">
                            <Sparkles size={16} />
                            {t("inspiration.eyebrow", "Real Weddings")}
                        </div>
                        <h2 className="font-display text-[36px] md:text-[48px] text-[#1A1A1A] leading-[1.1]">
                            {t("inspiration.title", "Glimpse into the magic")}
                        </h2>
                        <p className="text-[16px] text-[#717171] max-w-xl leading-relaxed">
                            {t("inspiration.subtitle", "Discover how other couples celebrated their Farah. Browse real wedding stories and shop the vendors who made them happen.")}
                        </p>
                    </div>
                    <Link 
                        href="/stories" 
                        className="group flex items-center gap-2 text-[15px] font-bold text-[#1A1A1A] hover:text-[#E8472A] transition-all"
                    >
                        {t("inspiration.view_all", "Explore all stories")}
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Horizontal Scrolling Grid */}
                <div className="flex gap-8 overflow-x-auto scrollbar-hide pb-12 px-1 snap-x snap-mandatory">
                    {MOCK_STORIES.map((story, i) => (
                        <div key={story.id} className="min-w-[280px] sm:min-w-[340px] md:min-w-[400px] snap-start">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <WeddingStoryCard 
                                    story={story} 
                                    onClick={() => setSelectedStory(story)} 
                                />
                            </motion.div>
                        </div>
                    ))}

                    {/* Final "Explore More" Card */}
                    <Link 
                        href="/stories"
                        className="min-w-[280px] sm:min-w-[340px] md:min-w-[400px] snap-start group"
                    >
                        <div className="relative aspect-[3/4] w-full rounded-[2rem] border-2 border-dashed border-[#DDDDDD] flex flex-col items-center justify-center text-center p-8 transition-colors hover:border-[#E8472A]/30 hover:bg-[#FEF0ED]/10">
                            <div className="w-16 h-16 rounded-full bg-[#F7F7F7] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <ChevronRight className="w-8 h-8 text-[#717171]" />
                            </div>
                            <span className="font-display text-2xl text-[#1A1A1A]">Your wedding could be here</span>
                            <span className="text-[14px] text-[#717171] mt-2">Submit your story to inspire others</span>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Immersive Viewer Modal */}
            <WeddingStoryModal 
                story={selectedStory} 
                isOpen={!!selectedStory} 
                onClose={() => setSelectedStory(null)} 
            />
        </section>
    );
}
