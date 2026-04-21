import { GetServerSideProps } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen, PenTool, CheckCircle2, Star, Wand2 } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchServerSide } from "@/utils/fetchServerSide";
import InspirationHero from "@/components/inspiration/InspirationHero";
import InspirationCategoryPills from "@/components/inspiration/InspirationCategoryPills";
import ArticleCard from "@/components/inspiration/ArticleCard";
import InspirationGrid from "@/components/inspiration/InspirationGrid";
import { Button } from "@/components/ui/button";
import { cn, getInspirationImageUrl } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/utils/apiClient";
import { mockArticles, mockArticleCategories, mockInspirationPhotos } from "@/lib/mockInspirationData";

interface InspirationHubProps {
    articles: any[];
    articleCategories: any[];
    photos: any[];
}

export default function InspirationHub({ 
    articles = [], 
    articleCategories = [], 
    photos = [],
}: InspirationHubProps) {
    const { t } = useTranslation("common");
    const { user } = useAuth();
    const [activeCategory, setActiveCategory] = useState("");
    const [userPersona, setUserPersona] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            apiClient.get<any>("/api/me").then(res => {
                if (res.weddingProfile?.stylePersona) {
                    setUserPersona(res.weddingProfile.stylePersona);
                }
            });
        }
    }, [user]);

    const featuredArticle = articles.find((a: any) => a.isFeatured) || articles[0];
    const latestArticles = articles.filter((a: any) => a.id !== featuredArticle?.id).slice(0, 3);
    const photoTeaser = photos.slice(0, 6);

    return (
        <div className="bg-white min-h-screen pt-20">
            <Head>
                <title>Inspiration & Ideas — Farah.ma</title>
                <meta name="description" content="Discover trends, planning tips, and real Moroccan wedding stories." />
            </Head>

            {/* 1. Hero Hub */}
            <InspirationHero featuredArticle={featuredArticle} />

            {/* 2. Category Pills */}
            <div className="container mx-auto px-6 max-w-7xl mt-12">
                {userPersona ? (
                    <div className="bg-[#1A1A1A] rounded-[2rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 mb-16 overflow-hidden relative">
                         <div className="absolute inset-0 opacity-10 pointer-events-none"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/xml' width='60' height='60'%3E%3Cpath d='M30 5l4 11h11l-9 7 3.5 11L30 27l-9.5 7L24 23 15 16h11z' fill='%23FFFFFF' /%3E%3C/svg%3E")`,
                                backgroundRepeat: "repeat",
                            }}
                        />
                        <div className="space-y-4 relative z-10 text-center md:text-start">
                            <span className="text-[#E8472A] font-bold text-[12px] uppercase tracking-widest flex items-center gap-2 justify-center md:justify-start">
                                <Sparkles size={14} />
                                Personalized for your vision
                            </span>
                            <h2 className="font-display text-[40px] text-white">Your {userPersona} Journey</h2>
                            <p className="text-white/60 max-w-md">We've curated the hub with tips and inspiration that match your unique style signature.</p>
                        </div>
                        <Button asChild size="lg" className="rounded-full bg-white text-black hover:bg-neutral-200 relative z-10">
                            <Link href="/inspiration/photos">View Styled Gallery</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="bg-[#F7F7F7] rounded-[2rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 mb-16 border border-[#EBEBEB]">
                        <div className="space-y-2">
                            <h2 className="font-display text-3xl text-[#1A1A1A]">Discover Your Style</h2>
                            <p className="text-[#717171]">Not sure where to start? Take our 2-minute discovery quiz.</p>
                        </div>
                        <Button asChild className="rounded-full bg-[#E8472A] text-white hover:bg-[#D63D22] gap-2">
                            <Link href="/inspiration/quiz">
                                <Wand2 size={18} />
                                Start Style Discovery Quiz
                            </Link>
                        </Button>
                    </div>
                )}
            </div>

            <InspirationCategoryPills 
                categories={articleCategories} 
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
            />

            {/* 3. Editor's Picks (High Impact) */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-3 mb-10">
                        <Star className="text-[#E8472A]" size={24} fill="currentColor" />
                        <h2 className="font-display text-[32px] md:text-[44px] text-[#1A1A1A]">Editor's Picks</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Main Featured */}
                        {featuredArticle && (
                            <Link href={`/inspiration/articles/${featuredArticle.slug}`} className="group relative block aspect-[16/10] overflow-hidden rounded-[3rem] bg-neutral-100 shadow-xl">
                                <Image 
                                    src={featuredArticle.featuredImage?.startsWith('http') ? featuredArticle.featuredImage : getInspirationImageUrl(featuredArticle.featuredImage)}
                                    alt={featuredArticle.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-12 flex flex-col justify-end">
                                    <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-widest self-start mb-6">
                                        Must Read
                                    </span>
                                    <h3 className="text-white font-display text-4xl md:text-5xl leading-tight mb-4 group-hover:underline">
                                        {featuredArticle.title}
                                    </h3>
                                    <p className="text-white/80 text-lg max-w-xl line-clamp-2">
                                        {featuredArticle.excerpt}
                                    </p>
                                </div>
                            </Link>
                        )}

                        {/* Side List */}
                        <div className="space-y-8 flex flex-col justify-center">
                            {latestArticles.map((article: any) => (
                                <Link 
                                    key={article.id} 
                                    href={`/inspiration/articles/${article.slug}`}
                                    className="group flex gap-6 items-start"
                                >
                                    <div className="relative w-32 h-32 rounded-3xl overflow-hidden shrink-0">
                                        <Image 
                                            src={article.featuredImage?.startsWith('http') ? article.featuredImage : getInspirationImageUrl(article.featuredImage)}
                                            alt=""
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[#E8472A] text-[11px] font-bold uppercase tracking-widest">
                                            {article.category?.name}
                                        </span>
                                        <h4 className="font-display text-2xl text-[#1A1A1A] group-hover:text-[#E8472A] transition-colors">
                                            {article.title}
                                        </h4>
                                        <p className="text-[14px] text-[#717171] line-clamp-2">
                                            {article.excerpt}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Planning Essentials (Iconic Links) */}
            <section className="py-24 bg-[#F7F7F7] border-y border-[#EBEBEB]">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="font-display text-[40px] text-[#1A1A1A]">Planning Essentials</h2>
                        <p className="text-[#717171]">Everything you need to orchestrate a flawless celebration.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { title: "Budget & Costs", icon: <PenTool size={32} />, color: "bg-blue-50 text-blue-600" },
                            { title: "Legal Checklist", icon: <CheckCircle2 size={32} />, color: "bg-green-50 text-green-600" },
                            { title: "Venue Scouting", icon: <BookOpen size={32} />, color: "bg-orange-50 text-orange-600" },
                            { title: "Tradition Guide", icon: <Sparkles size={32} />, color: "bg-purple-50 text-purple-600" },
                        ].map((item, i) => (
                            <Link 
                                key={i} 
                                href="/inspiration/articles"
                                className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-[#E8472A]/10 text-center flex flex-col items-center gap-6 group"
                            >
                                <div className={cn("w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110", item.color)}>
                                    {item.icon}
                                </div>
                                <span className="font-display text-xl text-[#1A1A1A]">{item.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Visual Journey (Gallery Teaser) */}
            <section className="py-24 bg-[#F7F7F7]">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center space-y-6 mb-16">
                        <div className="inline-flex items-center gap-2 text-[#E8472A] font-bold text-[12px] uppercase tracking-widest">
                            <Sparkles size={16} />
                            Infinite Inspiration
                        </div>
                        <h2 className="font-display text-[40px] md:text-[56px] text-[#1A1A1A] leading-[1.05]">
                            A Visual Journey
                        </h2>
                        <p className="text-[18px] text-[#717171] max-w-2xl mx-auto">
                            Browse thousands of photos from real Moroccan weddings. Save your favorites to your moodboard.
                        </p>
                    </div>

                    <div className="relative overflow-hidden min-h-[500px]">
                        <InspirationGrid 
                            photos={photoTeaser} 
                            onPhotoClick={() => {}} 
                        />
                        
                        {/* Gradient Fade to CTA */}
                        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#F7F7F7] via-[#F7F7F7]/80 to-transparent flex items-end justify-center pb-12">
                            <Button 
                                asChild
                                size="lg" 
                                className="rounded-full bg-[#1A1A1A] text-white px-10 py-7 text-[16px] hover:bg-[#2A2A2A] shadow-xl"
                            >
                                <Link href="/inspiration/photos" className="flex items-center gap-3">
                                    Explore the full gallery
                                    <ArrowRight size={20} />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 5.5  Farah Magazine — Editorial Bridge ──────────────────────────── */}
            <section className="py-24 bg-[#1A1A1A] relative overflow-hidden">
                {/* Subtle dot pattern */}
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Ccircle cx='20' cy='20' r='1.5' fill='%23FFFFFF'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "repeat",
                    }}
                />
                <div className="container mx-auto px-6 max-w-7xl relative z-10">
                    {/* Header row */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <BookOpen size={16} className="text-[#E8472A]" />
                                <span className="text-[#E8472A] font-bold text-[11px] uppercase tracking-widest">
                                    Farah Magazine
                                </span>
                            </div>
                            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] text-white leading-[1.05]">
                                Conseils d&apos;experts.<br />
                                <span className="italic text-white/50">Lus par 40 000 futures mariées.</span>
                            </h2>
                            <p className="text-white/50 text-[16px] max-w-md">
                                Guides, tendances et histoires vraies pour vous aider à organiser le mariage de vos rêves.
                            </p>
                        </div>
                        <Link
                            href="/magazine"
                            className="group inline-flex items-center gap-3 bg-[#E8472A] text-white font-bold text-[14px] uppercase tracking-widest px-8 py-4 rounded-full hover:bg-[#D63D22] transition-colors shrink-0"
                        >
                            Lire le Magazine
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Article cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.slice(0, 3).map((article: any, i: number) => (
                            <motion.div
                                key={article.id ?? i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.4, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                            >
                                <Link
                                    href={`/magazine/${article.slug}`}
                                    className="group flex flex-col bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:bg-white/10 hover:border-[#E8472A]/30 transition-all duration-300 h-full"
                                >
                                    {/* Cover */}
                                    <div className="relative aspect-[16/9] overflow-hidden shrink-0">
                                        <Image
                                            src={
                                                article.featuredImage?.startsWith("http")
                                                    ? article.featuredImage
                                                    : getInspirationImageUrl(article.featuredImage)
                                            }
                                            alt={article.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        {article.category?.name && (
                                            <span className="absolute top-4 start-4 bg-[#E8472A] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                                                {article.category.name}
                                            </span>
                                        )}
                                    </div>
                                    {/* Text */}
                                    <div className="p-6 space-y-3 flex-1 flex flex-col">
                                        <h3 className="text-white font-display text-[18px] leading-snug group-hover:text-[#E8472A] transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>
                                        {article.excerpt && (
                                            <p className="text-white/40 text-[13px] leading-relaxed line-clamp-2 flex-1">
                                                {article.excerpt}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                            <span className="text-white/30 text-[12px]">
                                                {(article.readTime ?? article.readingTimeMinutes) ? `${article.readTime ?? article.readingTimeMinutes} min` : "Lire l'article"}
                                            </span>
                                            <span className="text-[#E8472A] text-[12px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                                                Lire <ArrowRight size={12} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <p className="text-center text-white/25 text-[13px] mt-12 tracking-wide">
                        Nouveaux articles chaque semaine · Gratuit · Sans inscription
                    </p>
                </div>
            </section>

            {/* 6. Submit Story CTA */}
            <section className="py-32 bg-[#1A1A1A] relative overflow-hidden">
                 <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/xml' width='60' height='60'%3E%3Cpath d='M30 5l4 11h11l-9 7 3.5 11L30 27l-9.5 7L24 23 15 16h11z' fill='%23FFFFFF' /%3E%3C/svg%3E")`,
                        backgroundRepeat: "repeat",
                    }}
                />
                <div className="container mx-auto px-6 max-w-4xl text-center relative z-10 space-y-10">
                    <h2 className="font-display text-[32px] md:text-[56px] text-white leading-tight">
                        Did you have a dream Farah?<br />
                        <span className="italic opacity-70">Share your story.</span>
                    </h2>
                    <p className="text-[18px] text-white/60 max-w-2xl mx-auto">
                        Inspire future couples by sharing your wedding day secrets and the vendors who made it happen.
                    </p>
                    <Button variant="outline" size="lg" className="rounded-full border-white text-white hover:bg-white hover:text-black">
                        Submit your wedding
                    </Button>
                </div>
            </section>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    try {
        const [articles, articleCategories, photos] = await Promise.all([
            fetchServerSide("/api/articles", { locale: locale || "fr" }),
            fetchServerSide("/api/article_categories", { locale: locale || "fr" }),
            fetchServerSide("/api/inspiration_photos", { locale: locale || "fr" }),
        ]) as [any, any, any];

        // Use API data if available, otherwise fall back to mock data for UI/UX testing
        const articlesData = articles?.['hydra:member']?.length > 0 ? articles['hydra:member'] : mockArticles;
        const categoriesData = articleCategories?.['hydra:member']?.length > 0 ? articleCategories['hydra:member'] : mockArticleCategories;
        const photosData = photos?.['hydra:member']?.length > 0 ? photos['hydra:member'] : mockInspirationPhotos;

        return {
            props: {
                articles: articlesData,
                articleCategories: categoriesData,
                photos: photosData,
                ...(await serverSideTranslations(locale || "fr", ["common"])),
            },
        };
    } catch (e) {
        console.error("Error fetching inspiration data:", e);
        // Fall back to mock data for UI/UX testing when API is not available
        return {
            props: {
                articles: mockArticles,
                articleCategories: mockArticleCategories,
                photos: mockInspirationPhotos,
                ...(await serverSideTranslations(locale || "fr", ["common"])),
            },
        };
    }
};
