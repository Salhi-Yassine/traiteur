import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "../components/vendors/SearchBar";
import VendorCard, { VendorCardProps } from "../components/vendors/VendorCard";
import type { GetStaticProps } from "next";
import { Button } from "../components/ui/button";
import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface HomeProps {
  featuredVendors: VendorCardProps[];
}

// Moroccan eight-pointed star SVG for section ornament dividers
function StarDivider() {
  return (
    <div className="section-divider my-0">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 0l1.5 5.5L15 4l-3.5 4.5L16 12l-5.5-.5L8 16l-2.5-4.5L0 12l4.5-3.5L1 4l5.5 1.5z"
          fill="#F47C65"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

export default function HomePage({ featuredVendors }: HomeProps) {
  const { t } = useTranslation("common");

  const STATS = [
    { value: "800+", label: t("home.stats.vendors") },
    { value: "12",   label: t("home.stats.cities") },
    { value: "100%", label: t("home.stats.verified") },
    { value: "4.9",  label: t("home.stats.rating") },
  ];

  const EVENT_CATEGORIES = [
    { label: t("home.categories.items.salles"),      icon: "🏛️",  category: "Salles",      count: 142 },
    { label: t("home.categories.items.photography"), icon: "📸",  category: "Photography", count: 98  },
    { label: t("home.categories.items.negrafa"),     icon: "👑",  category: "Negrafa",     count: 67  },
    { label: t("home.categories.items.catering"),    icon: "🍽️", category: "Catering",    count: 111 },
    { label: t("home.categories.items.decoration"),  icon: "🌸",  category: "Decoration",  count: 89  },
    { label: t("home.categories.items.beauty"),      icon: "✋",  category: "Beauty",      count: 54  },
    { label: t("home.categories.items.music"),       icon: "🎵",  category: "Music",       count: 73  },
    { label: t("home.categories.items.transport"),   icon: "🚗",  category: "Transport",   count: 38  },
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
      serviceArea: "Casablanca",
      category: "Salles",
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
      serviceArea: "Fès",
      category: "Negrafa",
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
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1920&q=85"
            alt="Mariage marocain — cour de riad illuminée"
            fill
            className="object-cover"
            priority
          />
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
      <section className="bg-white border-b border-[#DDDDDD] py-12" aria-label="Chiffres clés">
        <div className="container mx-auto max-w-5xl px-6">
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
        </div>
      </section>

      {/* ─── CATEGORY TILES ─── */}
      <section className="py-24 bg-white" aria-labelledby="categories-heading">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-12 space-y-3">
            <h2 id="categories-heading" className="font-display text-[36px] md:text-[44px] text-[#1A1A1A] leading-[1.1]">
              {t("home.categories.title")}
            </h2>
            <p className="text-[16px] text-[#717171] max-w-xl mx-auto">
              {t("home.categories.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {EVENT_CATEGORIES.map(({ label, icon, category, count }) => (
              <Link
                key={label}
                href={`/vendors?category=${category}`}
                className="group relative bg-white border border-[#DDDDDD] rounded-[24px] flex flex-col items-center justify-center gap-4 p-6 min-h-[160px]
                  shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_12px_rgba(0,0,0,0.10)]
                  hover:-translate-y-[2px] transition-all duration-200 ease-out overflow-hidden"
                aria-label={`${label} — ${count} ${t("home.categories.count_suffix")}`}
              >
                {/* Subtle 6% star pattern bg per PRD §6.9 */}
                <div
                  className="absolute inset-0 opacity-[0.06] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M20 3l2.5 7.5H30l-6 4.5 2.5 7.5-6.5-5-6.5 5 2.5-7.5-6-4.5h7.5z' fill='%23F47C65'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                  }}
                  aria-hidden="true"
                />
                <span className="text-[32px] group-hover:scale-110 transition-transform duration-200 relative z-10" aria-hidden="true">
                  {icon}
                </span>
                <div className="text-center relative z-10">
                  <span className="block text-[14px] font-semibold text-[#1A1A1A] group-hover:text-[#E8472A] transition-colors">
                    {label}
                  </span>
                  <span className="block text-[12px] text-[#717171] mt-0.5">
                    {count} {t("home.categories.count_suffix")}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/vendors/categories"
              className="text-[14px] font-medium text-[#484848] hover:text-[#E8472A] transition-colors underline underline-offset-4"
            >
              {t("home.categories.view_all")}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── ORNAMENT DIVIDER ─── */}
      <div className="flex justify-center py-4">
        <StarDivider />
      </div>

      {/* ─── FEATURED VENDORS ─── */}
      <section className="py-24 bg-[#F7F7F7]" aria-labelledby="vendors-heading">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div className="space-y-2">
              <h2 id="vendors-heading" className="font-display text-[36px] md:text-[44px] text-[#1A1A1A] leading-[1.1]">
                {t("home.featured.title")}
              </h2>
              <p className="text-[15px] text-[#717171]">
                {t("home.featured.subtitle")}
              </p>
            </div>
            <Link href="/vendors">
              <Button variant="ghost">
                {t("home.featured.view_all")}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map((vendor) => (
              <VendorCard key={vendor.id} {...vendor} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── ORNAMENT DIVIDER ─── */}
      <div className="flex justify-center py-4 bg-white">
        <StarDivider />
      </div>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 bg-white" aria-labelledby="how-it-works-heading">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="text-center mb-16 space-y-3">
            <h2 id="how-it-works-heading" className="font-display text-[36px] md:text-[44px] text-[#1A1A1A] leading-[1.1]">
              {t("home.how_it_works.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {HOW_IT_WORKS.map(({ step, title, description }) => (
              <div key={step} className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#FEF0ED] border border-[#E8472A]/20 flex items-center justify-center mx-auto">
                  <span className="font-display text-[#E8472A] text-[18px]">{step}</span>
                </div>
                <h3 className="font-semibold text-[16px] text-[#1A1A1A] leading-tight">
                  {title}
                </h3>
                <p className="text-[14px] text-[#717171] leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Button variant="default" size="lg" asChild>
              <Link href="/auth/register">
                {t("home.how_it_works.cta")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── ORNAMENT DIVIDER ─── */}
      <div className="flex justify-center py-4">
        <StarDivider />
      </div>

      {/* ─── FOR VENDORS CTA ─── */}
      <section className="py-24 bg-[#1A1A1A] relative overflow-hidden" aria-labelledby="vendors-cta-heading">
        {/* Subtle star texture — 5% per PRD §8.1I */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 5l4 11h11l-9 7 3.5 11L30 27l-9.5 7L24 23 15 16h11z' fill='%23F47C65'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
          aria-hidden="true"
        />
        <div className="container mx-auto max-w-3xl px-6 text-center relative z-10 space-y-6">
          <h2 id="vendors-cta-heading" className="font-display text-[36px] md:text-[48px] text-white leading-[1.1]">
            {t("home.vendors_cta.title")}
          </h2>
          <p className="text-[16px] text-[#B0B0B0] max-w-xl mx-auto leading-relaxed">
            {t("home.vendors_cta.subtitle")}
          </p>
          <Button variant="default" size="lg" asChild>
            <Link href="/for-vendors">
              {t("home.vendors_cta.cta")}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost";
    // For now we still fetch in default, but since it's SSR/SSG we should ideally pass the locale if supported by API
    // Our new LocaleListener expects Accept-Language
    const res = await fetch(`${baseUrl}/api/vendor_profiles?isVerified=true&page=1&itemsPerPage=3`, {
      headers: { 
        Accept: "application/ld+json",
        "Accept-Language": locale || 'fr' 
      },
    });

    const members = res.ok ? (await res.json())["hydra:member"] ?? [] : [];

    const featuredVendors: VendorCardProps[] = members.map((v: any) => ({
      id: v.id ?? 0,
      slug: v.slug,
      businessName: v.businessName,
      tagline: v.tagline,
      serviceArea: v.serviceArea,
      category: v.category ?? "Other",
      priceRange: v.priceRange,
      coverImageUrl: v.coverImageUrl,
      averageRating: v.averageRating ? parseFloat(v.averageRating) : undefined,
      reviewCount: v.reviewCount ?? 0,
      isVerified: v.isVerified ?? false,
    }));

    return { 
      props: { 
        featuredVendors,
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
