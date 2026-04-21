import { useState } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { fetchServerSide } from "@/utils/fetchServerSide";
import apiClient from "@/utils/apiClient";

// Components
import ArticleCard from "@/components/magazine/ArticleCard";
import MagazineCategoryBar from "@/components/magazine/MagazineCategoryBar";
import MagazineHero from "@/components/magazine/MagazineHero";
import TopicGrid from "@/components/magazine/TopicGrid";
import TrendingSection from "@/components/magazine/TrendingSection";
import NewsletterBlock from "@/components/magazine/NewsletterBlock";

// Types
import { Article, HydraCollection } from "@/types/magazine";
import { mockArticles, mockMagazinePageProps } from "@/lib/mockMagazineData";

// Hooks
import { usePersonalizedFeed } from "@/hooks/usePersonalizedFeed";
import { usePlanningTimeline } from "@/hooks/usePlanningTimeline";

// Phase 4 Components
import PlanningTimelineWidget from "@/components/magazine/PlanningTimelineWidget";

interface MagazinePageProps {
    featuredArticle: Article | null;
    initialArticles: Article[];
}

export default function MagazinePage({ featuredArticle, initialArticles }: MagazinePageProps) {
    const { t } = useTranslation("common");
    const { locale } = useRouter();
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Personalized "For You" feed based on bookmarked articles
    const personalizedArticles = usePersonalizedFeed(initialArticles);

    // Planning timeline — only shows if user has a wedding date in localStorage
    const planningTimeline = usePlanningTimeline(initialArticles);

    const { data: filteredData, isFetching } = useQuery({
        queryKey: ["magazine_articles", activeCategory],
        queryFn: async () => {
            try {
                const params = new URLSearchParams({ isPublished: "true" });
                if (activeCategory) params.set("category.slug", activeCategory);
                const res = await apiClient.get<HydraCollection<Article>>(`/api/articles?${params}`);
                
                // Fallback to mocks if API returns empty but we have mock matches for this category
                if (res["hydra:totalItems"] === 0 && activeCategory) {
                    const mockMatches = mockArticles.filter((a: Article) => a.category.slug === activeCategory);
                    if (mockMatches.length > 0) {
                        return { "hydra:member": mockMatches, "hydra:totalItems": mockMatches.length };
                    }
                }
                
                return res;
            } catch (error) {
                console.error("Magazine API Error, using mocks:", error);
                if (activeCategory) {
                    const mockMatches = mockArticles.filter((a: Article) => a.category.slug === activeCategory);
                    return { "hydra:member": mockMatches, "hydra:totalItems": mockMatches.length };
                }
                // If it's the main feed, use initial articles (which might be mocks already)
                return { "hydra:member": initialArticles, "hydra:totalItems": initialArticles.length };
            }
        },
        initialData: activeCategory === null
            ? { "hydra:member": initialArticles, "hydra:totalItems": initialArticles.length }
            : undefined,
        staleTime: 1000 * 60 * 5,
    });

    const articles = filteredData?.["hydra:member"] ?? [];
    
    // Logic for modular grid
    const mainFeatured = activeCategory ? null : featuredArticle;
    const gridArticles = activeCategory 
        ? articles 
        : articles.filter((a: Article) => a.id !== mainFeatured?.id).slice(0, 6);
    
    const editorPicks = activeCategory ? [] : articles.filter((a: Article) => a.id !== mainFeatured?.id).slice(6, 9);
    const latestStories = activeCategory ? [] : articles.filter((a: Article) => a.id !== mainFeatured?.id).slice(9);

    return (
        <>
            <Head>
                <title>{t("magazine.seo.title")}</title>
                <meta name="description" content={t("magazine.seo.description")} />
            </Head>

            {/* ── Sticky category bar ─────────────────────────────────────────── */}
            <div className="sticky top-0 z-40">
                <MagazineCategoryBar activeSlug={activeCategory} onChange={setActiveCategory} />
            </div>

            <main className="pb-32 bg-white">
                <AnimatePresence mode="wait">
                    {!activeCategory ? (
                        <motion.div
                            key="curated"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-12 md:space-y-24"
                        >
                            {/* 1. Immersive Hero */}
                            {mainFeatured && (
                                <div className="max-w-screen-2xl mx-auto px-4 md:px-8 mt-6">
                                    < MagazineHero article={mainFeatured} />
                                </div>
                            )}

                            {/* 2. Popular Topics (Visual) */}
                            <div className="max-w-7xl mx-auto px-4 md:px-8">
                                <TopicGrid />
                            </div>

                            {/* 3. Editor's Picks (Landscape Variant) */}
                            {editorPicks.length > 0 && (
                                <section className="max-w-7xl mx-auto px-4 md:px-8">
                                    <div className="flex items-center justify-between mb-10">
                                        <h2 className="font-display text-4xl text-neutral-900">{t('magazine.editors_picks')}</h2>
                                    </div>
                                    <div className="grid grid-cols-1 gap-12">
                                        {editorPicks.map((article: Article) => (
                                            <ArticleCard 
                                                key={article.id} 
                                                {...article} 
                                                variant="landscape" 
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* 3.5  Planning Timeline — visible only if wedding date is set */}
                            {planningTimeline && !activeCategory && (
                                <PlanningTimelineWidget timeline={planningTimeline} />
                            )}

                            {/* 4. Trending Block (Dark Mode) */}
                            <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
                                <TrendingSection />
                            </div>

                            {/* Newsletter Premium Block */}
                            {!activeCategory && (
                                <NewsletterBlock />
                            )}

                            {/* Real Weddings Teaser */}
                            {!activeCategory && (
                                <section className="max-w-7xl mx-auto px-4 md:px-8">
                                    <div className="flex items-end justify-between mb-10">
                                        <div>
                                            <p className="text-primary text-[11px] font-black uppercase tracking-widest mb-2">♥ Vrais Mariages</p>
                                            <h2 className="font-display text-4xl md:text-5xl text-neutral-900">Ils ont dit oui sur Farah</h2>
                                        </div>
                                        <a href="/real-weddings" className="text-primary font-black uppercase tracking-widest text-[13px] hover:underline shrink-0">
                                            Voir tous →
                                        </a>
                                    </div>
                                    {/* Teaser row — 3 visual cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        {[
                                            { couple: "Leila &amp; Karim", city: "Marrakech", img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600", vibe: "Palatial" },
                                            { couple: "Nadia &amp; Youssef", city: "Casablanca", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600", vibe: "Moderne" },
                                            { couple: "Amina &amp; Rachid", city: "Fès", img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600", vibe: "Traditionnel" },
                                        ].map((story, i) => (
                                            <a key={i} href="/real-weddings" className="group relative block aspect-[3/4] rounded-[2rem] overflow-hidden cursor-pointer">
                                                <img src={story.img} alt={story.couple} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                                <div className="absolute bottom-0 inset-x-0 p-6 space-y-1">
                                                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{story.city} &middot; {story.vibe}</p>
                                                    <p className="font-display text-white text-xl leading-tight">{story.couple}</p>
                                                </div>
                                                <div className="absolute top-4 end-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/30">
                                                    {story.vibe}
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* 5.a "For You" Personalized Feed */}
                            {personalizedArticles.length > 0 && !activeCategory && (
                                <section className="max-w-7xl mx-auto px-4 md:px-8">
                                    <div className="flex items-center justify-between mb-10">
                                        <div>
                                            <p className="text-primary text-[11px] font-black uppercase tracking-widest mb-2">✦ Seléction personnalisée</p>
                                            <h2 className="font-display text-4xl text-neutral-900">Rien que pour vous</h2>
                                        </div>
                                        <span className="text-neutral-400 text-[12px] font-semibold">
                                            Basé sur vos favoris
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                                        {personalizedArticles.map((article: Article) => (
                                            <div key={article.id} className="relative">
                                                {/* Personal pick badge */}
                                                <div className="absolute top-4 end-4 z-10 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow">
                                                    ✦ Pour vous
                                                </div>
                                                <ArticleCard {...article} />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* 5.b Latest Stories (Grid) */}
                            {(latestStories.length > 0 || gridArticles.length > 0) && (
                                <section className="max-w-7xl mx-auto px-4 md:px-8">
                                    <div className="flex items-center justify-between mb-10">
                                        <h2 className="font-display text-4xl text-neutral-900">{t('magazine.latest_stories')}</h2>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                                        {[...gridArticles, ...latestStories].map((article: Article) => (
                                            <ArticleCard key={article.id} {...article} />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="filtered"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-7xl mx-auto px-4 md:px-8 pt-12 min-h-screen"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <h2 className="font-display text-48 text-neutral-900">
                                    {articles[0]?.category.name || t('magazine.no_articles')}
                                </h2>
                                <span className="text-neutral-400 font-bold uppercase tracking-widest text-12">
                                    {filteredData?.["hydra:totalItems"] || 0} {t('magazine.articles_found')}
                                </span>
                            </div>

                            {articles.length === 0 ? (
                                <div className="py-32 text-center">
                                    <p className="text-neutral-400 text-lg font-display">{t("magazine.no_articles")}</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                                    {articles.map((article: Article) => (
                                        <ArticleCard key={article.id} {...article} />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </>
    );
}

// ─── SSG ───────────────────────────────────────────────────────────────────────

export const getStaticProps: GetStaticProps<MagazinePageProps> = async ({ locale }) => {
    try {
        const [featuredRes, allRes] = await Promise.all([
            fetchServerSide<HydraCollection<Article>>(
                "/api/articles?isPublished=true&isFeatured=true&order[featuredOrder]=asc&itemsPerPage=1",
                { locale: locale ?? "fr" }
            ),
            fetchServerSide<HydraCollection<Article>>(
                "/api/articles?isPublished=true&itemsPerPage=15&order[publishedAt]=desc",
                { locale: locale ?? "fr" }
            ),
        ]);

        const featuredArticle = featuredRes["hydra:member"][0] || mockMagazinePageProps.featuredArticle;
        const initialArticles = allRes["hydra:member"].length > 0 
            ? allRes["hydra:member"] 
            : mockMagazinePageProps.initialArticles;

        return {
            props: {
                featuredArticle,
                initialArticles,
                ...(await serverSideTranslations(locale ?? "fr", ["common"])),
            },
            revalidate: 300,
        };
    } catch (error) {
        console.error("Magazine SSG Error, falling back to mocks:", error);
        return {
            props: {
                featuredArticle: mockMagazinePageProps.featuredArticle,
                initialArticles: mockMagazinePageProps.initialArticles,
                ...(await serverSideTranslations(locale ?? "fr", ["common"])),
            },
            revalidate: 60,
        };
    }
};
