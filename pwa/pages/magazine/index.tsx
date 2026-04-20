import Head from "next/head";
import { useState } from "react";
import type { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import apiClient from "@/utils/apiClient";
import { fetchServerSide } from "@/utils/fetchServerSide";
import ArticleCard, { ArticleCardProps } from "@/components/magazine/ArticleCard";
import MagazineCategoryBar from "@/components/magazine/MagazineCategoryBar";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Article {
    id: number;
    slug: string;
    title: string;
    excerpt?: string;
    featuredImage?: string;
    category: { id: number; name: string; slug: string };
    publishedAt?: string;
    tags: string[];
    readingTimeMinutes?: number;
}

interface HydraCollection<T> {
    "hydra:member": T[];
    "hydra:totalItems": number;
}

interface MagazinePageProps {
    featuredArticle: Article | null;
    initialArticles: Article[];
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function MagazinePage({ featuredArticle, initialArticles }: MagazinePageProps) {
    const { t } = useTranslation("common");
    const { locale } = useRouter();
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const { data: filteredData } = useQuery({
        queryKey: ["magazine_articles", activeCategory],
        queryFn: () => {
            const params = new URLSearchParams({ isPublished: "true" });
            if (activeCategory) params.set("category.slug", activeCategory);
            return apiClient.get<HydraCollection<Article>>(`/api/articles?${params}`);
        },
        initialData: activeCategory === null
            ? { "hydra:member": initialArticles, "hydra:totalItems": initialArticles.length }
            : undefined,
        staleTime: 1000 * 60 * 5,
    });

    const articles = filteredData?.["hydra:member"] ?? initialArticles;
    // When a category is active, show all matching articles (skip the featured one)
    const gridArticles = activeCategory
        ? articles
        : articles.filter((a) => a.id !== featuredArticle?.id);

    return (
        <>
            <Head>
                <title>{t("magazine.seo.title")}</title>
                <meta name="description" content={t("magazine.seo.description")} />
                <meta property="og:title" content={t("magazine.seo.title")} />
                <meta property="og:description" content={t("magazine.seo.description")} />
            </Head>

            {/* ── Sticky category bar ─────────────────────────────────────────── */}
            <div className="sticky top-0 z-40">
                <MagazineCategoryBar activeSlug={activeCategory} onChange={setActiveCategory} />
            </div>

            <main className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
                {/* ── Featured hero ─────────────────────────────────────────────── */}
                {!activeCategory && featuredArticle && (
                    <div className="mt-8 mb-10">
                        <ArticleCard
                            slug={featuredArticle.slug}
                            title={featuredArticle.title}
                            excerpt={featuredArticle.excerpt}
                            featuredImage={featuredArticle.featuredImage}
                            category={featuredArticle.category}
                            publishedAt={featuredArticle.publishedAt}
                            readingTimeMinutes={featuredArticle.readingTimeMinutes ?? 1}
                            variant="featured"
                        />
                    </div>
                )}

                {/* ── Section heading ────────────────────────────────────────────── */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-[#1A1A1A] text-2xl">
                        {activeCategory ? t("magazine.all_articles") : t("magazine.latest_articles")}
                    </h2>
                </div>

                {/* ── Article grid ───────────────────────────────────────────────── */}
                {gridArticles.length === 0 ? (
                    <div className="py-20 text-center text-[#B0B0B0] text-[15px]">
                        {t("magazine.no_articles")}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gridArticles.map((article) => (
                            <ArticleCard
                                key={article.id}
                                slug={article.slug}
                                title={article.title}
                                excerpt={article.excerpt}
                                featuredImage={article.featuredImage}
                                category={article.category}
                                publishedAt={article.publishedAt}
                                readingTimeMinutes={article.readingTimeMinutes ?? 1}
                            />
                        ))}
                    </div>
                )}
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
                "/api/articles?isPublished=true&itemsPerPage=12&order[publishedAt]=desc",
                { locale: locale ?? "fr" }
            ),
        ]);

        return {
            props: {
                featuredArticle: featuredRes["hydra:member"][0] ?? null,
                initialArticles: allRes["hydra:member"],
                ...(await serverSideTranslations(locale ?? "fr", ["common"])),
            },
            revalidate: 300,
        };
    } catch {
        return {
            props: {
                featuredArticle: null,
                initialArticles: [],
                ...(await serverSideTranslations(locale ?? "fr", ["common"])),
            },
            revalidate: 60,
        };
    }
};
