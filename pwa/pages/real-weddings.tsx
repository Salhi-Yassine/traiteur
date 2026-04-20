import { GetServerSideProps } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { fetchServerSide } from "@/utils/fetchServerSide";
import WeddingStoryCard, { WeddingStory } from "@/components/inspiration/WeddingStoryCard";
import WeddingStoryModal from "@/components/inspiration/WeddingStoryModal";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, SlidersHorizontal, MapPin, Calendar, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RealWeddingsPageProps {
    stories: WeddingStory[];
}

export default function RealWeddingsPage({ stories = [] }: RealWeddingsPageProps) {
    const { t } = useTranslation("common");
    const [selectedStory, setSelectedStory] = useState<WeddingStory | null>(null);
    const [activeStyle, setActiveStyle] = useState("All");
    
    const styles = ["All", "Bohème", "Traditional", "Modern", "Palatial", "Minimalist"];

    const filteredStories = activeStyle === "All" 
        ? stories 
        : stories.filter(s => s.style === activeStyle);

    return (
        <div className="bg-white min-h-screen pt-24 pb-32">
            <Head>
                <title>Real Weddings — Farah.ma</title>
                <meta name="description" content="Glimpse into the magic of real Moroccan weddings." />
            </Head>

            <div className="container mx-auto px-6 max-w-7xl">
                {/* ── Editorial Header ── */}
                <header className="max-w-3xl mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 text-[#E8472A] font-bold text-sm uppercase tracking-widest">
                        <Heart size={16} fill="currentColor" />
                        Love in Full Bloom
                    </div>
                    <h1 className="font-display text-[56px] md:text-[80px] text-[#1A1A1A] leading-[1.05] tracking-tight">
                        Real Weddings
                    </h1>
                    <p className="text-[20px] text-[#717171] leading-relaxed max-w-xl">
                        Discover how other couples celebrated their Farah. Browse real stories, explore stunning themes, and shop the vendors who made the magic happen.
                    </p>
                </header>

                {/* ── Filters & Tools ── */}
                <div className="sticky top-24 z-30 bg-white/80 backdrop-blur-md py-6 mb-16 border-b border-[#EBEBEB] flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
                        {styles.map((style) => (
                            <button
                                key={style}
                                onClick={() => setActiveStyle(style)}
                                className={cn(
                                    "px-6 py-2.5 rounded-full text-[14px] font-bold transition-all whitespace-nowrap border",
                                    activeStyle === style 
                                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg shadow-black/10" 
                                        : "bg-white text-[#484848] border-[#DDDDDD] hover:border-[#1A1A1A]"
                                )}
                            >
                                {style}
                            </button>
                        ))}
                    </div>
                    <Button variant="outline" className="rounded-full gap-2 text-[14px] font-bold">
                        <SlidersHorizontal size={18} />
                        More Filters
                    </Button>
                </div>

                {/* ── Grid ── */}
                <motion.div 
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredStories.map((story) => (
                            <motion.div
                                key={story.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                            >
                                <WeddingStoryCard 
                                    story={story} 
                                    onClick={() => setSelectedStory(story)} 
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredStories.length === 0 && (
                    <div className="py-32 text-center space-y-4">
                        <div className="w-20 h-20 bg-[#F7F7F7] rounded-full flex items-center justify-center mx-auto text-[#B0B0B0]">
                            <Sparkles size={40} />
                        </div>
                        <h3 className="text-2xl font-display text-[#1A1A1A]">No stories found</h3>
                        <p className="text-[#717171]">Try a different filter or check back later for new updates.</p>
                    </div>
                )}
            </div>

            {/* Immersive Viewer */}
            <WeddingStoryModal 
                story={selectedStory} 
                isOpen={!!selectedStory} 
                onClose={() => setSelectedStory(null)} 
            />
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    try {
        const stories = await fetchServerSide("/api/wedding_stories", { locale: locale || "fr" }) as any;

        return {
            props: {
                stories: stories?.['member'] || [],
                ...(await serverSideTranslations(locale || "fr", ["common"])),
            },
        };
    } catch (e) {
        return {
            props: {
                stories: [],
                ...(await serverSideTranslations(locale || "fr", ["common"])),
            },
        };
    }
};
