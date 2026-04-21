import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Calendar, Clock, User, ArrowLeft, Share2, Bookmark, Headphones } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState, useCallback } from "react";
import { fetchServerSide } from "@/utils/fetchServerSide";

// Magazine Components
import ReadingProgressBar from "@/components/magazine/ReadingProgressBar";
import HamlauCalculator from "@/components/magazine/HamlauCalculator";
import HireTheProsWidget from "@/components/magazine/HireTheProsWidget";
import { ShopTheLook } from "@/components/magazine/InlineVendorCard";
import ArticleCard from "@/components/magazine/ArticleCard";
import TableOfContents from "@/components/magazine/TableOfContents";
import AudioPlayer from "@/components/magazine/AudioPlayer";
import ImageHotspot from "@/components/magazine/ImageHotspot";
import ArticleContent from "@/components/magazine/ArticleContent";
import ArticleReactions from "@/components/magazine/ArticleReactions";
import ExpertQABlock from "@/components/magazine/ExpertQABlock";
import SponsoredBlock from "@/components/magazine/SponsoredBlock";

// Types & Mocks
import { Article, HydraCollection } from "@/types/magazine";
import { mockArticles } from "@/lib/mockMagazineData";

// Hooks
import { useBookmarks } from "@/hooks/useBookmarks";

interface ArticlePageProps {
    article: Article;
    relatedArticles: Article[];
}

export default function ArticlePage({ article, relatedArticles }: ArticlePageProps) {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { isBookmarked, toggleBookmark } = useBookmarks();
    const [audioOpen, setAudioOpen] = useState(false);

    const bookmarked = isBookmarked(article.id);

    const handleShare = useCallback(async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: article.title,
                    text: article.excerpt,
                    url: window.location.href,
                });
            } catch {
                // user cancelled
            }
        } else {
            navigator.clipboard?.writeText(window.location.href);
        }
    }, [article]);

    if (router.isFallback) {
        return <div className="min-h-screen flex items-center justify-center font-display text-2xl">Chargement...</div>;
    }

    const publishDate = article.publishedAt 
        ? format(new Date(article.publishedAt), "d MMMM yyyy", { locale: fr }) 
        : "";

    return (
        <div className="bg-white min-h-screen">
            <Head>
                <title>{article.title} | Farah Magazine</title>
                <meta name="description" content={article.excerpt} />
                {/* Open Graph */}
                <meta property="og:title" content={`${article.title} | Farah Magazine`} />
                <meta property="og:description" content={article.excerpt} />
                {article.featuredImage && <meta property="og:image" content={article.featuredImage} />}
                <meta property="og:type" content="article" />
                {/* JSON-LD Article Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": article.title,
                        "image": [article.featuredImage],
                        "datePublished": article.publishedAt,
                        "author": [{
                            "@type": "Person",
                            "name": article.author ? `${article.author.firstName} ${article.author.lastName}` : "Farah Magazine"
                        }]
                    })}
                </script>
            </Head>

            <ReadingProgressBar />

            {/* ── Immersive Header ─────────────────────────────────────────── */}
            <header className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out scale-105"
                    style={{ backgroundImage: `url(${article.featuredImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
                
                <div className="absolute inset-0 flex flex-col justify-end pb-12 md:pb-24">
                    <div className="max-w-4xl mx-auto px-4 md:px-8 w-full">
                        <Link 
                            href="/magazine" 
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                                <ArrowLeft className="w-4 h-4" />
                            </div>
                            <span className="text-12 font-black uppercase tracking-widest">{t('magazine.back_to_magazine')}</span>
                        </Link>
                        
                        <div className="space-y-6">
                            <span className="inline-block bg-primary text-white text-12 font-black uppercase tracking-[3px] px-4 py-1.5 rounded-full">
                                {article.category.name}
                            </span>
                            <h1 className="text-4xl md:text-7xl font-display text-white leading-[1.1]">
                                {article.title}
                            </h1>
                            
                            <div className="flex flex-wrap items-center gap-6 text-white/70 text-13 font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                        <User className="w-3.5 h-3.5" />
                                    </div>
                                    <span>{article.author ? `${article.author.firstName} ${article.author.lastName}` : "Farah Magazine"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{publishDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{article.readingTimeMinutes} {t('magazine.min_read')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Article Content + Sidebars ─────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    {/* Left: Share Bar (Sticky Desktop) */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-32 space-y-4 flex flex-col items-center">
                            <button
                                title={t('magazine.save_article')}
                                onClick={() => toggleBookmark(article.id)}
                                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all bg-white ${
                                    bookmarked
                                        ? "border-primary text-primary shadow-md shadow-primary/10"
                                        : "border-neutral-100 text-neutral-400 hover:text-primary hover:border-primary hover:shadow-sm"
                                }`}
                                aria-label={bookmarked ? "Retirer des favoris" : "Sauvegarder l'article"}
                            >
                                <Bookmark className="w-5 h-5" fill={bookmarked ? "currentColor" : "none"} />
                            </button>
                            <button
                                title={t('magazine.listen_article')}
                                onClick={() => setAudioOpen((prev) => !prev)}
                                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all bg-white ${
                                    audioOpen
                                        ? "border-primary text-primary shadow-md shadow-primary/10"
                                        : "border-neutral-100 text-neutral-400 hover:text-primary hover:border-primary hover:shadow-sm"
                                }`}
                            >
                                <Headphones className="w-5 h-5" />
                            </button>
                            <button
                                title={t('magazine.share_article')}
                                onClick={handleShare}
                                className="w-12 h-12 rounded-full border border-neutral-100 flex items-center justify-center text-neutral-400 hover:text-primary hover:border-primary hover:shadow-sm transition-all bg-white"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                            <div className="h-24 w-px bg-neutral-200 mt-4" />
                        </div>
                    </aside>

                    {/* Mobile FAB */}
                    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full border border-neutral-200 shadow-2xl">
                        <button
                            onClick={() => toggleBookmark(article.id)}
                            className={`flex items-center gap-2 transition-colors text-sm font-semibold px-2 border-r border-neutral-200 pr-4 ${bookmarked ? "text-primary" : "text-neutral-600 hover:text-primary"}`}
                        >
                            <Bookmark className="w-5 h-5" fill={bookmarked ? "currentColor" : "none"} />
                            <span>{bookmarked ? "Sauvegardé" : t('common.save')}</span>
                        </button>
                        <button
                            onClick={() => setAudioOpen((prev) => !prev)}
                            className={`flex items-center justify-center transition-colors px-2 border-r border-neutral-200 pr-4 ${audioOpen ? "text-primary" : "text-neutral-600 hover:text-primary"}`}
                        >
                            <Headphones className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleShare}
                            className="flex items-center justify-center text-neutral-600 hover:text-primary transition-colors pl-2"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Middle: Article Content */}
                    <main className="lg:col-span-7">
                        {/* Safe rendered article HTML */}
                        <ArticleContent
                            html={article.content}
                            dir={article.locale === "ar" || article.locale === "ary" ? "rtl" : "ltr"}
                        />

                        {/* Expert in Residence Q&A Block */}
                        {article.expertData && (
                            <ExpertQABlock expert={article.expertData} />
                        )}

                        {/* Sponsored Native Block */}
                        {article.sponsorData && (
                            <SponsoredBlock sponsor={article.sponsorData} />
                        )}

                        {/* Shop The Look Hotspot Images */}
                        {article.hotspotImages && article.hotspotImages.length > 0 && (
                            <div className="mt-16 space-y-4">
                                <h3 className="font-display text-28 text-neutral-900">
                                    ✦ {t('magazine.shop_the_look')}
                                </h3>
                                <p className="text-neutral-500 text-[14px]">
                                    Survolez les points pour découvrir les créateurs et prestataires.
                                </p>
                                {article.hotspotImages.map((img, idx) => (
                                    <ImageHotspot
                                        key={idx}
                                        imageUrl={img.imageUrl}
                                        alt={img.alt}
                                        hotspots={img.hotspots}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Integrated Widgets */}
                        <div className="mt-16 space-y-12">
                            {article.widgetType === "hamlau" && (
                                <div className="bg-neutral-50 rounded-[2.5rem] p-8 md:p-12 border border-neutral-100">
                                    <HamlauCalculator />
                                </div>
                            )}

                            {article.relatedVendors && article.relatedVendors.length > 0 && (
                                <div className="pt-12 border-t border-neutral-100">
                                    <h3 className="font-display text-32 text-neutral-900 mb-8">
                                        {t('magazine.shop_the_look')}
                                    </h3>
                                    <ShopTheLook vendors={article.relatedVendors} />
                                </div>
                            )}
                        </div>

                        {/* Reactions Bar */}
                        <ArticleReactions articleId={article.id} />
                    </main>

                    {/* Right Sidebar */}
                    <aside className="lg:col-span-4 space-y-12">
                        <div className="sticky top-32 space-y-10">
                            {/* Table of Contents */}
                            <TableOfContents content={article.content} />

                            {/* Divider */}
                            {article.content.includes("<h2") && (
                                <div className="border-t border-neutral-100" />
                            )}

                            {/* CTA Widget */}
                            <HireTheProsWidget 
                                categorySlug={article.category.slug} 
                                categoryName={article.category.name}
                                variant="sidebar"
                            />

                            {/* Recommended Articles */}
                            <div className="space-y-8">
                                <h4 className="font-display text-24 text-neutral-900">{t('magazine.sidebar.recommended')}</h4>
                                <div className="space-y-6">
                                    {relatedArticles.slice(0, 3).map(rel => (
                                        <ArticleCard key={rel.id} {...rel} variant="compact" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* ── Floating "Next Step" CTA (triggers at 50% scroll) ── */}
            <HireTheProsWidget
                categorySlug={article.category.slug}
                categoryName={article.category.name}
                variant="floating"
                triggerAt={0.5}
            />

            {/* ── Audio Player ── */}
            {audioOpen && (
                <AudioPlayer
                    content={article.content}
                    title={article.title}
                    onClose={() => setAudioOpen(false)}
                />
            )}

            {/* ── More Reads Grid ─────────────────────────────────────────── */}
            <section className="bg-neutral-50 py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between mb-16">
                        <h2 className="font-display text-4xl md:text-5xl text-neutral-900">{t('magazine.more_reads')}</h2>
                        <Link href="/magazine" className="text-primary font-black uppercase tracking-widest text-14 hover:underline">
                            {t('magazine.all_articles')}
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {relatedArticles.map(rel => (
                            <ArticleCard key={rel.id} {...rel} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

// ─── SSG ───────────────────────────────────────────────────────────────────────

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        const res = await fetchServerSide<HydraCollection<Article>>(
            "/api/articles?isPublished=true&itemsPerPage=20"
        );
        
        const realPaths = res["hydra:member"].map((article) => ({
            params: { slug: article.slug },
        }));
        
        const mockPaths = mockArticles.map((article) => ({
            params: { slug: article.slug },
        }));

        return {
            paths: [...realPaths, ...mockPaths],
            fallback: "blocking",
        };
    } catch {
        const mockPaths = mockArticles.map((article) => ({
            params: { slug: article.slug },
        }));
        return {
            paths: mockPaths,
            fallback: "blocking",
        };
    }
};

export const getStaticProps: GetStaticProps<ArticlePageProps> = async ({ params, locale }) => {
    const slug = params?.slug as string;

    try {
        const res = await fetchServerSide<HydraCollection<Article>>(
            `/api/articles?slug=${slug}&isPublished=true`,
            { locale: locale ?? "fr" }
        );

        let article: Article | null = res["hydra:member"][0] || null;
        
        if (!article) {
            article = mockArticles.find(a => a.slug === slug) || null;
        }

        if (!article) {
            return { notFound: true };
        }

        const relatedRes = await fetchServerSide<HydraCollection<Article>>(
            `/api/articles?category.slug=${article.category.slug}&id[nearly]=${article.id}&itemsPerPage=3`,
            { locale: locale ?? "fr" }
        );

        let relatedArticles = relatedRes["hydra:member"];
        if (relatedArticles.length === 0) {
            relatedArticles = mockArticles.filter(a => a.slug !== slug).slice(0, 3);
        }

        return {
            props: {
                article,
                relatedArticles,
                ...(await serverSideTranslations(locale ?? "fr", ["common"])),
            },
            revalidate: 300,
        };
    } catch (error) {
        console.error("Magazine Detail SSG Error, using mocks:", error);
        const mockArticle = mockArticles.find(a => a.slug === slug);
        
        if (!mockArticle) return { notFound: true };

        return {
            props: {
                article: mockArticle,
                relatedArticles: mockArticles.filter(a => a.slug !== slug).slice(0, 3),
                ...(await serverSideTranslations(locale ?? "fr", ["common"])),
            },
            revalidate: 60,
        };
    }
};
