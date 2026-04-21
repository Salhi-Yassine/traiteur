import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import type { GetStaticProps } from "next";
import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../components/ui/button";
import VendorCard, { VendorCardProps } from "../components/vendors/VendorCard";
import SearchBar from "../components/vendors/SearchBar";
import { fetchServerSide } from "../utils/fetchServerSide";
import WeddingStoriesSection from "../components/inspiration/WeddingStoriesSection";

interface CategoryFromApi {
  name: string;
  slug: string;
  emoji: string | null;
  vendorCount: number;
}

interface HomeProps {
  featuredVendors: VendorCardProps[];
  stats?: {
    vendorCount: number;
    cityCount: number;
    averageRating: number;
    reviewCount: number;
    availableCategories: CategoryFromApi[];
  };
}

// Fade-in scroll animation component
function FadeInUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "50px" });
    
    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.disconnect(); };
  }, []);

  return (
    <div
      ref={domRef}
      className={cn(
        "transition-all duration-1000 ease-out fill-mode-forwards",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const CATEGORY_IMAGES: Record<string, string> = {
  salles: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
  photography: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
  negrafa: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
  catering: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
  decoration: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
  beauty: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80",
  music: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
  transport: "https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800&q=80",
  default: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80"
};

const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1920&q=85",
    alt: "Mariage marocain — cour de riad illuminée",
  },
  {
    src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=85",
    alt: "Salles de mariage",
  },
  {
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1920&q=85",
    alt: "Photographie de mariage",
  },
  {
    src: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1920&q=85",
    alt: "Traiteur et gastronomie",
  },
  {
    src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&q=85",
    alt: "Décoration de mariage",
  },
];

export default function HomePage({ featuredVendors, stats }: HomeProps) {
  const { t } = useTranslation("common");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const categoriesFromApi = stats?.availableCategories || [];

  // Dynamic categories from API — map to curated background images
  const EVENT_CATEGORIES = categoriesFromApi.length > 0
    ? categoriesFromApi.slice(0, 8).map((cat: CategoryFromApi) => ({
      label: cat.name,
      imageUrl: CATEGORY_IMAGES[cat.slug] || CATEGORY_IMAGES.default,
      category: cat.slug,
      count: cat.vendorCount ?? 0,
    }))
    : [
      { label: t("home.categories.items.salles"), imageUrl: CATEGORY_IMAGES.salles, category: "salles", count: 0 },
      { label: t("home.categories.items.photography"), imageUrl: CATEGORY_IMAGES.photography, category: "photography", count: 0 },
      { label: t("home.categories.items.negrafa"), imageUrl: CATEGORY_IMAGES.negrafa, category: "negrafa", count: 0 },
      { label: t("home.categories.items.catering"), imageUrl: CATEGORY_IMAGES.catering, category: "catering", count: 0 },
      { label: t("home.categories.items.decoration"), imageUrl: CATEGORY_IMAGES.decoration, category: "decoration", count: 0 },
      { label: t("home.categories.items.beauty"), imageUrl: CATEGORY_IMAGES.beauty, category: "beauty", count: 0 },
      { label: t("home.categories.items.music"), imageUrl: CATEGORY_IMAGES.music, category: "music", count: 0 },
      { label: t("home.categories.items.transport"), imageUrl: CATEGORY_IMAGES.transport, category: "transport", count: 0 },
    ];

  const STATS = [
    { value: stats ? `${stats.vendorCount}+` : "800+", label: t("home.stats.vendors") },
    { value: stats ? `${stats.cityCount}` : "12", label: t("home.stats.cities") },
    { value: "100%", label: t("home.stats.verified") },
    { value: stats ? `${stats.averageRating}` : "4.9", label: t("home.stats.rating") },
  ];

  const HOW_IT_WORKS = [
    {
      step: "1",
      title: t("home.how_it_works.step1.title"),
      description: t("home.how_it_works.step1.desc"),
    },
    {
      step: "2",
      title: t("home.how_it_works.step2.title"),
      description: t("home.how_it_works.step2.desc"),
    },
    {
      step: "3",
      title: t("home.how_it_works.step3.title"),
      description: t("home.how_it_works.step3.desc"),
    },
  ];

  const FALLBACK_VENDORS: VendorCardProps[] = [
    {
      id: 1,
      slug: "palais-des-roses-casablanca",
      businessName: "Palais des Roses",
      tagline: "Un cadre idyllique pour votre mariage de rêve à Casablanca",
      cities: [{ name: "Casablanca", slug: "casablanca" }],
      category: { name: "Salles", slug: "salles" },
      priceRange: "MADMADMAD",
      coverImageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
      averageRating: 4.9,
      reviewCount: 128,
      isVerified: true,
    },
    {
      id: 2,
      slug: "negafa-dar-el-makhzen-fes",
      businessName: "Négafa Dar El Makhzen",
      tagline: "Le raffinement des tenues traditionnelles — Fès",
      cities: [{ name: "Fès", slug: "fes" }],
      category: { name: "Negrafa", slug: "negrafa" },
      priceRange: "MADMADMAD+",
      coverImageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
      averageRating: 5.0,
      reviewCount: 64,
      isVerified: true,
    },
  ];

  const vendors = featuredVendors.length > 0 ? featuredVendors : FALLBACK_VENDORS;

  return (
    <div className="bg-white min-h-screen">
      <Head>
        <title>Farah.ma — {t("home.hero.title").replace(/<[^>]*>?/gm, '')}</title>
        <meta name="description" content={t("home.hero.subtitle")} />
      </Head>

      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" aria-label="Section héro">
        {/* Background photo */}
        <div className="absolute inset-0 z-0 bg-black">
          {HERO_IMAGES.map((image, index) => (
            <div
              key={image.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
          {/* Dark overlay — 55% per PRD */}
          <div className="absolute inset-0 bg-black/55" />
          {/* Subtle Moroccan star tessellation — 5% opacity per PRD §6.9 */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 5l4 11h11l-9 7 3.5 11L30 27l-9.5 7L24 23 15 16h11z' fill='%23F47C65' opacity='0.8'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
            }}
            aria-hidden="true"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-8">
          {/* Tagline */}
          <h1 className="font-display italic text-white text-5xl md:text-[64px] leading-[1.05] tracking-[-0.5px]">
            <Trans i18nKey="home.hero.title" t={t}>
              Planifiez le mariage de vos rêves, <span className="not-italic font-display">à la marocaine</span>
            </Trans>
          </h1>

          <p className="text-white/85 text-[18px] md:text-[20px] leading-relaxed max-w-2xl mx-auto">
            {t("home.hero.subtitle")}
          </p>

          {/* Search bar */}
          <div className="max-w-3xl mx-auto">
            <SearchBar variant="hero" />
          </div>

          {/* Social proof */}
          <p className="text-white/60 text-[14px]">
            {t("home.hero.social_proof")}
          </p>
        </div>
      </section>

      {/* ─── TRUST STATS ─── */}
      <section className="bg-white border-b border-[#EBEBEB] py-16" aria-label="Chiffres clés">
        <FadeInUp className="container mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div className="font-display text-[40px] font-normal text-[#1A1A1A] leading-none mb-1">
                  {value}
                </div>
                <div className="text-[13px] text-[#717171]">{label}</div>
              </div>
            ))}
          </div>
        </FadeInUp>
      </section>

      {/* ─── CATEGORY TILES (Bento Grid) ─── */}
      <section className="py-32 bg-white" aria-labelledby="categories-heading">
        <div className="container mx-auto max-w-7xl px-6">
          <FadeInUp className="text-center mb-16 space-y-3">
            <h2 id="categories-heading" className="font-display text-[36px] md:text-[44px] text-[#1A1A1A] leading-[1.1]">
              {t("home.categories.title")}
            </h2>
            <p className="text-[16px] text-[#717171] max-w-xl mx-auto">
              {t("home.categories.subtitle")}
            </p>
          </FadeInUp>

          <FadeInUp delay={100} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {EVENT_CATEGORIES.map(({ label, imageUrl, category, count }, i) => (
              <Link
                key={label}
                href={`/vendors?category.slug=${category}`}
                className={cn(
                    "group relative bg-[#1A1A1A] rounded-2xl flex flex-col items-start justify-end overflow-hidden",
                    "aspect-[4/5] sm:aspect-auto sm:h-[320px]"
                )}
                aria-label={`${label} — ${count} ${t("home.categories.count_suffix")}`}
              >
                <Image 
                    src={imageUrl} 
                    alt={label} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
                {/* Sleek gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="relative z-10 p-6 text-start w-full">
                  <span className="block text-[16px] font-semibold text-white group-hover:text-[#E8472A] transition-colors leading-tight">
                    {label}
                  </span>
                  <span className="block text-[13px] text-white/80 mt-1">
                    {count} {t("home.categories.count_suffix")}
                  </span>
                </div>
              </Link>
            ))}
          </FadeInUp>

          <FadeInUp delay={200} className="text-center mt-12">
            <Link
              href="/categories"
              className="text-[15px] font-medium text-[#1A1A1A] hover:text-[#E8472A] transition-colors underline underline-offset-4"
            >
              {t("home.categories.view_all")}
            </Link>
          </FadeInUp>
        </div>
      </section>

      {/* ─── REAL WEDDING STORIES (Inspiration) ─── */}
      <WeddingStoriesSection />

      {/* ─── FEATURED VENDORS ─── */}
      <section className="py-32 bg-[#F7F7F7]" aria-labelledby="vendors-heading">
        <div className="container mx-auto max-w-7xl px-6">
          <FadeInUp className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-2">
              <h2 id="vendors-heading" className="font-display text-[36px] md:text-[44px] text-[#1A1A1A] leading-[1.1]">
                {t("home.featured.title")}
              </h2>
              <p className="text-[16px] text-[#717171]">
                {t("home.featured.subtitle")}
              </p>
            </div>
            <Link href="/vendors">
              <Button variant="default" className="rounded-full shadow-sm">
                {t("home.featured.view_all")}
              </Button>
            </Link>
          </FadeInUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor, i) => (
              <FadeInUp key={vendor.id} delay={i * 100}>
                <VendorCard {...vendor} />
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-32 bg-white" aria-labelledby="how-it-works-heading">
        <div className="container mx-auto max-w-5xl px-6">
          <FadeInUp className="text-center mb-20 space-y-3">
            <h2 id="how-it-works-heading" className="font-display text-[36px] md:text-[44px] text-[#1A1A1A] leading-[1.1]">
              {t("home.how_it_works.title")}
            </h2>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {HOW_IT_WORKS.map(({ step, title, description }, i) => (
              <FadeInUp key={step} delay={i * 150} className="text-center space-y-5">
                <div className="w-14 h-14 rounded-full bg-[#FEF0ED] flex items-center justify-center mx-auto shadow-sm">
                  <span className="font-display text-[#E8472A] text-[20px] font-semibold">{step}</span>
                </div>
                <h3 className="font-semibold text-[18px] text-[#1A1A1A] leading-tight">
                  {title}
                </h3>
                <p className="text-[15px] text-[#717171] leading-relaxed">
                  {description}
                </p>
              </FadeInUp>
            ))}
          </div>

          <FadeInUp delay={400} className="text-center mt-20">
            <Button variant="default" size="lg" className="rounded-full shadow-md" asChild>
              <Link href="/auth/register">
                {t("home.how_it_works.cta")}
              </Link>
            </Button>
          </FadeInUp>
        </div>
      </section>

      {/* ─── FOR VENDORS CTA ─── */}
      <section className="py-32 bg-[#1A1A1A] relative overflow-hidden" aria-labelledby="vendors-cta-heading">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1A1A1A] to-[#2A2A2A] pointer-events-none" />
        <FadeInUp className="container mx-auto max-w-3xl px-6 text-center relative z-10 space-y-8">
          <h2 id="vendors-cta-heading" className="font-display text-[40px] md:text-[56px] text-white leading-[1.05]">
            {t("home.vendors_cta.title", "Inscrivez votre entreprise sur Farah.ma")}
          </h2>
          <p className="text-[18px] text-[#B0B0B0] max-w-2xl mx-auto leading-relaxed">
            {t("home.vendors_cta.subtitle")}
          </p>
          <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-[#1A1A1A] rounded-full mt-4" asChild>
            <Link href="/for-vendors">
              {t("home.vendors_cta.cta", "Become a vendor")}
            </Link>
          </Button>
        </FadeInUp>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const stats = await fetchServerSide("/api/app_stats", { locale: locale || "fr" }).catch(() => null) as any;

    const featuredVendors: VendorCardProps[] = (stats?.featuredVendors || []).map((v: any) => ({
      id: v.id ?? 0,
      slug: v.slug,
      businessName: v.businessName,
      tagline: v.tagline,
      serviceArea: v.serviceArea,
      category: v.category ?? { name: "Other", slug: "other" },
      priceRange: v.priceRange,
      startingPrice: v.startingPrice ?? null,
      coverImageUrl: v.coverImageUrl ?? null,
      averageRating: v.averageRating !== null && v.averageRating !== undefined ? parseFloat(v.averageRating) : null,
      reviewCount: v.reviewCount ?? 0,
      isVerified: v.isVerified ?? false,
    }));

    return {
      props: {
        featuredVendors,
        stats,
        ...(await serverSideTranslations(locale ?? 'fr', ['common'])),
      },
      revalidate: 300
    };
  } catch {
    return {
      props: {
        featuredVendors: [],
        ...(await serverSideTranslations(locale ?? 'fr', ['common'])),
      },
      revalidate: 60
    };
  }
};
