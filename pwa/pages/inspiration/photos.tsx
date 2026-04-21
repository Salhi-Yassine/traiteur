import { GetServerSideProps } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";
import { ChevronLeft, Filter, Search } from "lucide-react";
import Link from "next/link";
import { fetchServerSide } from "@/utils/fetchServerSide";
import InspirationGrid from "@/components/inspiration/InspirationGrid";
import InspirationCategoryPills from "@/components/inspiration/InspirationCategoryPills";
import InspirationPhotoModal, { InspirationPhoto } from "@/components/inspiration/InspirationPhotoModal";
import { Button } from "@/components/ui/button";

interface InspirationPhotosProps {
    photos: any[];
    categories: any[];
}

export default function InspirationPhotos({ photos = [], categories = [] }: InspirationPhotosProps) {
    const { t } = useTranslation("common");
    const [activeCategory, setActiveCategory] = useState("");
    const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);
    
    // Simple filter logic for demo
    const filteredPhotos = activeCategory 
        ? photos.filter(p => p.category?.slug === activeCategory)
        : photos;

    return (
        <div className="bg-white min-h-screen pt-24 pb-20">
            <Head>
                <title>Visual Inspiration — Farah.ma</title>
            </Head>

            {/* Header / Sub-nav */}
            <div className="container mx-auto px-6 max-w-7xl mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <Link 
                            href="/inspiration" 
                            className="inline-flex items-center gap-2 text-[13px] font-bold text-[#717171] hover:text-[#1A1A1A] transition-colors"
                        >
                            <ChevronLeft size={16} />
                            Back to Inspiration Hub
                        </Link>
                        <h1 className="font-display text-[40px] md:text-[56px] text-[#1A1A1A] leading-tight">
                            Visual Journey
                        </h1>
                        <p className="text-[16px] text-[#717171] max-w-xl">
                            The best of Moroccan wedding details. Browse by category, style, and save what inspires you.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-[#717171] w-4 h-4" />
                            <input
                                type="text"
                                placeholder={t("common.search")}
                                className="ps-12 pe-6 py-3 bg-[#F7F7F7] border-none rounded-full text-[14px] focus:ring-2 focus:ring-[#E8472A]/20 transition-all w-full md:w-[240px]"
                            />
                        </div>
                        <Button variant="outline" className="rounded-full gap-2">
                            <Filter size={16} />
                            Filters
                        </Button>
                    </div>
                </div>
            </div>

            {/* Sticky Categories */}
            <InspirationCategoryPills 
                categories={categories} 
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
            />

            {/* Masonry Grid */}
            <section className="py-12">
                <div className="container mx-auto px-6 max-w-7xl">
                    {filteredPhotos.length > 0 ? (
                        <InspirationGrid 
                            photos={filteredPhotos} 
                            onPhotoClick={(p: any) => setSelectedPhoto(p)} 
                        />
                    ) : (
                        <div className="py-32 text-center space-y-4">
                            <div className="text-4xl">📸</div>
                            <h3 className="font-display text-2xl">No photos found in this category</h3>
                            <p className="text-[#717171]">Try exploring another category or check back later.</p>
                            <Button onClick={() => setActiveCategory("")} variant="outline" className="rounded-full">
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>
            <InspirationPhotoModal 
                photo={selectedPhoto} 
                isOpen={!!selectedPhoto} 
                onClose={() => setSelectedPhoto(null)} 
            />
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    try {
        const [photos, categories] = await Promise.all([
            fetchServerSide("/api/inspiration_photos", { locale: locale || "fr" }),
            fetchServerSide("/api/categories", { locale: locale || "fr" }),
        ]) as [any, any];

        return {
            props: {
                photos: photos?.['member'] || [],
                categories: categories?.['member'] || [],
                ...(await serverSideTranslations(locale || "fr", ["common"])),
            },
        };
    } catch (e) {
        return {
            props: {
                photos: [],
                categories: [],
                ...(await serverSideTranslations(locale || "fr", ["common"])),
            },
        };
    }
};
