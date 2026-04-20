import { GetServerSideProps } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { fetchServerSide } from "@/utils/fetchServerSide";
import WeddingStoryCard from "@/components/inspiration/WeddingStoryCard";
import WeddingStoryModal from "@/components/inspiration/WeddingStoryModal";
import { useState } from "react";
import { ChevronLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface InspirationStoriesProps {
    stories: any[];
}

export default function InspirationStories({ stories = [] }: InspirationStoriesProps) {
    const { t } = useTranslation("common");
    const [selectedStory, setSelectedStory] = useState<any | null>(null);

    return (
        <div className="bg-white min-h-screen pt-24 pb-20">
            <Head>
                <title>Real Weddings — Farah.ma</title>
            </Head>

            <div className="container mx-auto px-6 max-w-7xl mb-12">
                <div className="space-y-4">
                    <Link 
                        href="/inspiration" 
                        className="inline-flex items-center gap-2 text-[13px] font-bold text-[#717171] hover:text-[#1A1A1A] transition-colors"
                    >
                        <ChevronLeft size={16} />
                        Back to Inspiration Hub
                    </Link>
                    <div className="flex items-center gap-2 text-[#E8472A] font-bold text-sm uppercase tracking-widest">
                        <Sparkles size={16} />
                        Real Weddings
                    </div>
                    <h1 className="font-display text-[40px] md:text-[56px] text-[#1A1A1A] leading-tight">
                        Glimpse into the magic
                    </h1>
                    <p className="text-[16px] text-[#717171] max-w-xl">
                        Discover how other couples celebrated their Farah. Browse real wedding stories and find the vendors who made them happen.
                    </p>
                </div>
            </div>

            <section className="py-12">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stories.map((story, i) => (
                            <motion.div
                                key={story.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <WeddingStoryCard 
                                    story={story} 
                                    onClick={() => setSelectedStory(story)} 
                                />
                            </motion.div>
                        ))}
                    </div>

                    {stories.length === 0 && (
                        <div className="py-32 text-center">
                            <h3 className="font-display text-2xl text-[#1A1A1A]">No wedding stories shared yet.</h3>
                            <p className="text-[#717171] mt-2">Become the first to share your magic!</p>
                        </div>
                    )}
                </div>
            </section>

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
