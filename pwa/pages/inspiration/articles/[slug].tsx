import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { fetchServerSide } from "@/utils/fetchServerSide";
import { ChevronLeft, Clock, Calendar, User, Share2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface ArticleDetailProps {
    article: any;
}

export default function ArticleDetail({ article }: ArticleDetailProps) {
    const { t } = useTranslation("common");

    if (!article) return null;

    return (
        <div className="bg-white min-h-screen">
            <Head>
                <title>{article.title} — Farah.ma</title>
                <meta name="description" content={article.excerpt} />
            </Head>

            {/* Sticky Header Nav */}
            <div className="sticky top-[64px] z-30 bg-white/80 backdrop-blur-md border-b border-[#EBEBEB] py-4">
                <div className="container mx-auto px-6 max-w-4xl flex items-center justify-between">
                    <Link 
                        href="/inspiration/articles" 
                        className="flex items-center gap-2 text-[13px] font-bold text-[#717171] hover:text-[#1A1A1A] transition-colors"
                    >
                        <ChevronLeft size={16} />
                        Back to articles
                    </Link>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="rounded-full gap-2">
                            <Share2 size={16} />
                            Share
                        </Button>
                    </div>
                </div>
            </div>

            <article className="pb-32">
                {/* Hero Header */}
                <header className="pt-12 pb-16">
                    <div className="container mx-auto px-6 max-w-4xl space-y-8">
                        <div className="flex items-center gap-3">
                            <span className="px-4 py-2 rounded-full bg-[#FEF0ED] text-[#E8472A] text-[11px] font-bold uppercase tracking-widest">
                                {article.category?.name}
                            </span>
                        </div>

                        <h1 className="font-display text-[44px] md:text-[64px] text-[#1A1A1A] leading-[1.05] tracking-tight">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 py-6 border-y border-[#EBEBEB]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden border">
                                    <User size={20} className="text-neutral-400" />
                                </div>
                                <div className="text-[14px]">
                                    <span className="block font-bold text-[#1A1A1A]">Written by</span>
                                    <span className="text-[#717171]">Farah Editorial Team</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 text-[14px]">
                                <Calendar size={18} className="text-[#717171]" />
                                <div>
                                    <span className="block font-bold text-[#1A1A1A]">Published</span>
                                    <span className="text-[#717171]">{format(new Date(article.publishedAt), 'MMMM dd, yyyy')}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-[14px]">
                                <Clock size={18} className="text-[#717171]" />
                                <div>
                                    <span className="block font-bold text-[#1A1A1A]">Read Time</span>
                                    <span className="text-[#717171]">5 min read</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="container mx-auto px-6 max-w-6xl mb-16">
                    <div className="relative aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <Image
                            src={article.featuredImage.startsWith('http') ? article.featuredImage : `/images/inspiration/${article.featuredImage}.png`}
                            alt={article.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Body Content */}
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="prose prose-lg max-w-none prose-neutral">
                        <p className="text-[20px] md:text-[24px] text-[#1A1A1A] leading-relaxed font-medium mb-12">
                            {article.excerpt}
                        </p>
                        
                        <div className="text-[17px] md:text-[19px] text-[#484848] leading-[1.8] space-y-8 whitespace-pre-wrap">
                            {article.content}
                        </div>
                    </div>

                    {/* Footer / Author Sign-off */}
                    <footer className="mt-24 pt-12 border-t border-[#EBEBEB]">
                        <div className="bg-[#F7F7F7] p-8 md:p-12 rounded-[2rem] flex flex-col md:flex-row items-center gap-8">
                            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                                <Image 
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" 
                                    alt="Author" 
                                    width={100} 
                                    height={100} 
                                    className="object-cover"
                                />
                            </div>
                            <div className="space-y-3 text-center md:text-start">
                                <h4 className="font-display text-2xl text-[#1A1A1A]">About the author</h4>
                                <p className="text-[#717171] leading-relaxed">
                                    Our editorial team is dedicated to bringing you the most authentic and helpful wedding planning advice in Morocco. We work with the best vendors and planners to ensure your Farah is perfect.
                                </p>
                            </div>
                        </div>
                    </footer>
                </div>
            </article>

            {/* Newsletter CTA Teaser */}
            <section className="bg-[#FEF0ED] py-24">
                <div className="container mx-auto px-6 max-w-4xl text-center space-y-8">
                    <h2 className="font-display text-3xl md:text-4xl text-[#1A1A1A]">Love these tips?</h2>
                    <p className="text-[#484848]">Get the latest wedding trends and planning secrets delivered to your inbox every week.</p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input 
                            type="email" 
                            placeholder="Your email address" 
                            className="flex-1 px-6 py-4 rounded-full border-none shadow-sm focus:ring-2 focus:ring-[#E8472A]"
                        />
                        <Button className="rounded-full bg-[#1A1A1A] px-8 h-14">Subscribe</Button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
    try {
        const slug = params?.slug as string;
        const articles = await fetchServerSide(`/api/articles?slug=${slug}`, { locale: locale || "fr" }) as any;
        const article = articles?.['member']?.[0];

        if (!article) {
            return { notFound: true };
        }

        return {
            props: {
                article,
                ...(await serverSideTranslations(locale || "fr", ["common"])),
            },
        };
    } catch (e) {
        return { notFound: true };
    }
};
