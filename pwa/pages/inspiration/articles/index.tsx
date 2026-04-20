import { GetServerSideProps } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { fetchServerSide } from "@/utils/fetchServerSide";
import ArticleCard from "@/components/inspiration/ArticleCard";
import InspirationCategoryPills from "@/components/inspiration/InspirationCategoryPills";
import { useState } from "react";
import { ChevronLeft, Search } from "lucide-react";
import Link from "next/link";

interface InspirationArticlesProps {
    articles: any[];
    categories: any[];
}

export default function InspirationArticles({ articles = [], categories = [] }: InspirationArticlesProps) {
    const { t } = useTranslation("common");
    const [activeCategory, setActiveCategory] = useState("");
    
    const filteredArticles = activeCategory 
        ? articles.filter(a => a.category?.slug === activeCategory)
        : articles;

    return (
        <div className="bg-white min-h-screen pt-24 pb-20">
            <Head>
                <title>Planning Tips & Trends — Farah.ma</title>
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
                    <h1 className="font-display text-[40px] md:text-[56px] text-[#1A1A1A] leading-tight">
                        Tips & Trends
                    </h1>
                    <p className="text-[16px] text-[#717171] max-w-xl">
                        Expert guides and the latest trends to make your Moroccan wedding planning stress-free and spectacular.
                    </p>
                </div>
            </div>

            <InspirationCategoryPills 
                categories={categories} 
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
            />

            <section className="py-12">
                <div className="container mx-auto px-6 max-w-7xl">
                    {filteredArticles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {filteredArticles.map((article) => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-32 text-center">
                            <h3 className="font-display text-2xl text-[#1A1A1A]">No articles found in this category yet.</h3>
                            <p className="text-[#717171] mt-2">Try another category or stay tuned for more tips!</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    try {
        const [articles, categories] = await Promise.all([
            fetchServerSide("/api/articles", { locale: locale || "fr" }),
            fetchServerSide("/api/article_categories", { locale: locale || "fr" }),
        ]) as [any, any];

        return {
            props: {
                articles: articles?.['member'] || [],
                categories: categories?.['member'] || [],
                ...(await serverSideTranslations(locale || "fr", ["common"])),
            },
        };
    } catch (e) {
        return {
            props: {
                articles: [],
                categories: [],
                ...(await serverSideTranslations(locale || "fr", ["common"])),
            },
        };
    }
};
