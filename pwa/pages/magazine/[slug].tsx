import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { Clock, ArrowLeft, Tag } from "lucide-react";
import { fetchServerSide } from "@/utils/fetchServerSide";
import HireTheProsWidget from "@/components/magazine/HireTheProsWidget";
import HamlauCalculator from "@/components/magazine/HamlauCalculator";
import MagazineCategoryBar from "@/components/magazine/MagazineCategoryBar";
import ArticleCard from "@/components/magazine/ArticleCard";
import ReadingProgressBar from "@/components/magazine/ReadingProgressBar";
import { ShopTheLook } from "@/components/magazine/InlineVendorCard";
import type { InlineVendorCardProps } from "@/components/magazine/InlineVendorCard";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface RelatedVendor {
    id: number;
    slug: string;
    businessName: string;
    category: { name: string; slug: string };
    coverImageUrl?: string;
    isVerified?: boolean;
    averageRating?: number;
}

interface Article {
    id: number;
    slug: string;
    title: string;
    excerpt?: string;
    content: string;
    featuredImage?: string;
    readingTimeMinutes?: number;
    widgetType?: string | null;
    category: { id: number; name: string; slug: string };
    author?: { id: number; firstName?: string; lastName?: string; email: string };
    publishedAt?: string;
    createdAt: string;
    tags: string[];
    relatedVendors: RelatedVendor[];
}

interface HydraCollection<T> {
    "hydra:member": T[];
}

interface ArticlePageProps {
    article: Article;
    relatedArticles: Article[];
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string, locale: string): string {
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-MA" : "fr-MA", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(iso));
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ArticlePage({ article, relatedArticles }: ArticlePageProps) {
    const { t } = useTranslation("common");
    const { locale } = useRouter();

    const dateLabel = article.publishedAt
        ? formatDate(article.publishedAt, locale ?? "fr")
        : formatDate(article.createdAt, locale ?? "fr");

    const minutes = article.readingTimeMinutes ?? 1;
    const showCalculator = article.widgetType === "hamlau";
    const ogImage = article.featuredImage ?? "";

    const shopVendors: InlineVendorCardProps[] = article.relatedVendors.map((v) => ({
        slug: v.slug,
        businessName: v.businessName,
        category: v.category,
        coverImageUrl: v.coverImageUrl,
        isVerified: v.isVerified,
        averageRating: v.averageRating,
    }));

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.excerpt ?? article.title,
        image: ogImage || undefined,
        datePublished: article.publishedAt ?? article.createdAt,
        dateModified: article.publishedAt ?? article.createdAt,
        author: article.author
            ? { "@type": "Person", name: `${article.author.firstName ?? ""} ${article.author.lastName ?? ""}`.trim() || article.author.email }
            : { "@type": "Organization", name: "Farah.ma" },
        publisher: {
            "@type": "Organization",
            name: "Farah.ma",
            logo: { "@type": "ImageObject", url: "https://farah.ma/logo.png" },
        },
        articleSection: article.category.name,
        keywords: article.tags.join(", "),
        timeRequired: `PT${minutes}M`,
    };

    return (
        <>
            <Head>
                <title>{article.title} — Farah Magazine</title>
                <meta name="description" content={article.excerpt ?? article.title} />
                <meta property="og:title" content={article.title} />
                {article.excerpt && <meta property="og:description" content={article.excerpt} />}
                {ogImage && <meta property="og:image" content={ogImage} />}
                <meta property="og:type" content="article" />
                {article.publishedAt && (
                    <meta property="article:published_time" content={article.publishedAt} />
                )}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </Head>

            {/* ── Reading progress ────────────────────────────────────────────── */}
            <ReadingProgressBar />

            {/* ── Sticky category bar ─────────────────────────────────────────── */}
            <div className="sticky top-0 z-40">
                <MagazineCategoryBar activeSlug={article.category.slug} onChange={() => {}} />
            </div>

            {/* ── Hero image ─────────────────────────────────────────────────── */}
            {article.featuredImage && (
                <div className="relative h-[55vh] min-h-[320px] bg-neutral-900">
                    <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        priority
                        className="object-cover opacity-85"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
                </div>
            )}

            {/* ── Article body ───────────────────────────────────────────────── */}
            <div className="max-w-[800px] mx-auto px-4 md:px-6 pb-24">
                {/* Back link */}
                <Link
                    href="/magazine"
                    className="inline-flex items-center gap-2 text-[#717171] hover:text-primary text-[13px] font-medium mt-8 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 rtl:-scale-x-100" />
                    {t("magazine.back_to_magazine")}
                </Link>

                {/* Category + meta */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Link
                        href={`/magazine?category=${article.category.slug}`}
                        className="bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
                    >
                        {article.category.name}
                    </Link>
                    <span className="flex items-center gap-1 text-[#B0B0B0] text-[12px]">
                        <Clock className="w-3.5 h-3.5" />
                        {minutes} {t("magazine.min_read")}
                    </span>
                    <span className="text-[#B0B0B0] text-[12px]">{dateLabel}</span>
                </div>

                {/* Title */}
                <h1 className="font-display text-[#1A1A1A] text-3xl md:text-4xl lg:text-5xl leading-tight mb-5">
                    {article.title}
                </h1>

                {/* Excerpt */}
                {article.excerpt && (
                    <p className="text-[#5E5E5E] text-[17px] leading-relaxed mb-8 font-light border-s-4 border-primary ps-5">
                        {article.excerpt}
                    </p>
                )}

                {/* Content */}
                <div
                    className="prose prose-lg prose-neutral max-w-none
                        prose-headings:font-display prose-headings:text-[#1A1A1A]
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-[16px] prose-blockquote:border-s-primary
                        prose-blockquote:not-italic prose-blockquote:text-[#5E5E5E]"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Hamlou Calculator (widgetType === 'hamlau') */}
                {showCalculator && <HamlauCalculator />}

                {/* Shop the Look — inline vendor cards */}
                {shopVendors.length > 0 && <ShopTheLook vendors={shopVendors} />}

                {/* Tags */}
                {article.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-[#F0F0F0]">
                        <Tag className="w-4 h-4 text-[#B0B0B0]" />
                        {article.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-[12px] text-[#717171] bg-[#F5F5F5] px-3 py-1 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Related articles */}
                {relatedArticles.length > 0 && (
                    <div className="mt-16">
                        <h3 className="font-display text-[#1A1A1A] text-2xl mb-6">
                            {t("magazine.related_articles")}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {relatedArticles.map((a) => (
                                <ArticleCard
                                    key={a.id}
                                    slug={a.slug}
                                    title={a.title}
                                    excerpt={a.excerpt}
                                    featuredImage={a.featuredImage}
                                    category={a.category}
                                    publishedAt={a.publishedAt}
                                    readingTimeMinutes={a.readingTimeMinutes ?? 1}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Floating hire widget ───────────────────────────────────────── */}
            <HireTheProsWidget
                categorySlug={article.category.slug}
                categoryName={article.category.name}
            />
        </>
    );
}

// ─── SSG ───────────────────────────────────────────────────────────────────────

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
    try {
        const data = await fetchServerSide<HydraCollection<{ slug: string }>>(
            "/api/articles?isPublished=true&itemsPerPage=50&order[publishedAt]=desc"
        );
        const slugs = data["hydra:member"].map((a) => a.slug);
        const paths = (locales ?? ["fr"]).flatMap((locale) =>
            slugs.map((slug) => ({ params: { slug }, locale }))
        );
        return { paths, fallback: "blocking" };
    } catch {
        return { paths: [], fallback: "blocking" };
    }
};

export const getStaticProps: GetStaticProps<ArticlePageProps> = async ({ params, locale }) => {
    const slug = params?.slug as string;

    try {
        const data = await fetchServerSide<HydraCollection<Article>>(
            `/api/articles?slug=${encodeURIComponent(slug)}&isPublished=true`,
            { locale: locale ?? "fr" }
        );
        const article = data["hydra:member"][0];

        if (!article) {
            return { notFound: true };
        }

        const related = await fetchServerSide<HydraCollection<Article>>(
            `/api/articles?isPublished=true&category.slug=${article.category.slug}&itemsPerPage=2&order[publishedAt]=desc`,
            { locale: locale ?? "fr" }
        );

        return {
            props: {
                article,
                relatedArticles: related["hydra:member"].filter((a) => a.id !== article.id).slice(0, 2),
                ...(await serverSideTranslations(locale ?? "fr", ["common"])),
            },
            revalidate: 300,
        };
    } catch {
        return { notFound: true };
    }
};
