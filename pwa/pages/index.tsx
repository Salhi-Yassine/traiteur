import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "../components/caterers/SearchBar";
import CatererCard, { CatererCardProps } from "../components/caterers/CatererCard";
import type { GetStaticProps } from "next";

interface HomeProps {
  featuredCaterers: CatererCardProps[];
}

const STATS = [
  { value: "500+", label: "Caterers Listed" },
  { value: "48", label: "Cities Covered" },
  { value: "12k+", label: "Events Served" },
  { value: "4.9", label: "Average Rating" },
];

const EVENT_CATEGORIES = [
  { label: "Weddings", icon: "💍", href: "/caterers?eventType=Wedding" },
  { label: "Corporate", icon: "🏢", href: "/caterers?eventType=Corporate" },
  { label: "Birthdays", icon: "🎂", href: "/caterers?eventType=Birthday" },
  { label: "Anniversaries", icon: "🥂", href: "/caterers?eventType=Anniversary" },
  { label: "Graduations", icon: "🎓", href: "/caterers?eventType=Graduation" },
  { label: "Private Parties", icon: "🎉", href: "/caterers?eventType=Other" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Search & Discover",
    description: "Browse hundreds of verified caterers near you. Filter by cuisine, service style, and budget.",
  },
  {
    step: "02",
    title: "Explore Profiles",
    description: "View menus, photo galleries, reviews, and pricing from real events.",
  },
  {
    step: "03",
    title: "Request a Quote",
    description: "Send your event details directly to the caterer. Get a personalized proposal in 24hrs.",
  },
];

// Fallback caterers for static rendering when API is not available
const FALLBACK_CATERERS: CatererCardProps[] = [
  {
    id: 1,
    slug: "festin-royal-alger",
    businessName: "Festin Royal",
    tagline: "Cuisine algérienne authentique pour vos événements mémorables",
    serviceArea: "Alger",
    cuisineTypes: ["Algerian", "Mediterranean", "Oriental"],
    priceRange: "$$$",
    coverImageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800",
    averageRating: 5,
    reviewCount: 2,
    isVerified: true,
  },
  {
    id: 2,
    slug: "le-jardin-saveurs-oran",
    businessName: "Le Jardin des Saveurs",
    tagline: "La gastronomie méditerranéenne à votre service",
    serviceArea: "Oran",
    cuisineTypes: ["Mediterranean", "French", "Italian"],
    priceRange: "$$$$",
    coverImageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    averageRating: 4,
    reviewCount: 1,
    isVerified: true,
  },
  {
    id: 3,
    slug: "saveurs-kabyle-tizi-ouzou",
    businessName: "Saveurs Kabyles",
    tagline: "L'authenticité berbère dans chaque bouchée",
    serviceArea: "Tizi Ouzou",
    cuisineTypes: ["Algerian", "Berber", "Traditional"],
    priceRange: "$$",
    coverImageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    averageRating: 5,
    reviewCount: 1,
    isVerified: true,
  },
];

export default function HomePage({ featuredCaterers }: HomeProps) {
  const caterers = featuredCaterers.length > 0 ? featuredCaterers : FALLBACK_CATERERS;

  return (
    <>
      <Head>
        <title>Traiteur — Algeria's Premier Catering Marketplace</title>
        <meta
          name="description"
          content="Find and book the best caterers in Algeria for weddings, corporate events, and private celebrations. Browse verified profiles, menus, reviews, and request quotes."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=85"
            alt="Elegant catering spread"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="fade-in-up">
            <p className="text-[var(--color-gold-400)] text-sm font-semibold uppercase tracking-[0.25em] mb-4">
              Algeria's Premier Catering Marketplace
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 text-balance">
              Extraordinary Dining for{" "}
              <em className="italic not-italic text-[var(--color-gold-400)]">Every</em>{" "}
              Celebration
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Discover and book the finest caterers across Algeria — from intimate
              gatherings to grand weddings. Authentic flavors, unforgettable moments.
            </p>
          </div>

          {/* Search bar */}
          <div className="flex justify-center">
            <SearchBar variant="hero" />
          </div>

          {/* Popular searches */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="text-white/60 text-sm">Popular:</span>
            {["Algerian", "Mediterranean", "French", "Buffet", "Wedding"].map((tag) => (
              <Link
                key={tag}
                href={`/caterers?cuisineTypes=${tag}`}
                className="text-white/80 hover:text-white text-sm underline underline-offset-2 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="bg-[var(--color-teal-800)] py-10">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div className="font-display text-3xl md:text-4xl font-bold text-white mb-1">
                  {value}
                </div>
                <div className="text-[var(--color-teal-300)] text-sm font-medium uppercase tracking-wide">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EVENT CATEGORIES ─── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <div className="section-divider mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-charcoal-900)] mb-3">
              Browse by Event Type
            </h2>
            <p className="text-[var(--color-charcoal-500)] max-w-lg mx-auto">
              Whether it's an intimate birthday dinner or a grand wedding reception,
              we have the perfect caterer for you.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {EVENT_CATEGORIES.map(({ label, icon, href }) => (
              <Link
                key={label}
                href={href}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-[var(--color-sand-50)] hover:bg-[var(--color-teal-50)] border border-transparent hover:border-[var(--color-teal-200)] transition-all"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{icon}</span>
                <span className="text-sm font-semibold text-[var(--color-charcoal-700)] group-hover:text-[var(--color-teal-800)]">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED CATERERS ─── */}
      <section className="py-20 bg-[var(--color-sand-50)]">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="section-divider mb-4" />
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-charcoal-900)] mb-2">
                Featured Caterers
              </h2>
              <p className="text-[var(--color-charcoal-500)]">
                Handpicked for their excellence, consistency, and 5-star reviews.
              </p>
            </div>
            <Link
              href="/caterers"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-teal-700)] hover:text-[var(--color-teal-900)] transition-colors"
            >
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {caterers.map((caterer) => (
              <CatererCard key={caterer.id} {...caterer} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/caterers"
              className="inline-flex items-center gap-2 bg-[var(--color-teal-700)] text-white px-8 py-3.5 rounded-full font-semibold hover:bg-[var(--color-teal-800)] transition-colors"
            >
              Browse All Caterers
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <div className="section-divider mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-charcoal-900)] mb-3">
              How Traiteur Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, title, description }) => (
              <div key={step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--color-teal-50)] border-2 border-[var(--color-teal-200)] flex items-center justify-center mx-auto mb-5">
                  <span className="font-display font-bold text-xl text-[var(--color-teal-700)]">{step}</span>
                </div>
                <h3 className="font-display font-semibold text-xl text-[var(--color-charcoal-900)] mb-2">
                  {title}
                </h3>
                <p className="text-[var(--color-charcoal-500)] leading-relaxed text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-20 bg-gradient-to-br from-[var(--color-teal-800)] to-[var(--color-teal-900)]">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <div className="text-[var(--color-gold-400)] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            For Catering Professionals
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
            Grow Your Catering Business with Traiteur
          </h2>
          <p className="text-[var(--color-teal-200)] text-lg mb-8 max-w-lg mx-auto">
            Join 500+ caterers already receiving quote requests from clients across Algeria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register?type=caterer"
              className="bg-[var(--color-gold-500)] text-[var(--color-teal-900)] px-8 py-4 rounded-full font-bold hover:bg-[var(--color-gold-400)] transition-colors"
            >
              List Your Business — Free
            </Link>
            <Link
              href="#how-it-works"
              className="border border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost";
    const res = await fetch(`${baseUrl}/api/caterer_profiles?isVerified=true&page=1&itemsPerPage=6`, {
      headers: { Accept: "application/ld+json" },
    });

    if (!res.ok) throw new Error("API not available");
    const data = await res.json();
    const members = data["hydra:member"] ?? [];

    const featuredCaterers: CatererCardProps[] = members.map((c: Record<string, unknown>) => ({
      id: (c.id as number) ?? 0,
      slug: c.slug as string,
      businessName: c.businessName as string,
      tagline: c.tagline as string | undefined,
      serviceArea: c.serviceArea as string,
      cuisineTypes: (c.cuisineTypes as string[]) ?? [],
      priceRange: c.priceRange as string,
      coverImageUrl: c.coverImageUrl as string | undefined,
      averageRating: c.averageRating ? parseFloat(c.averageRating as string) : undefined,
      reviewCount: (c.reviewCount as number) ?? 0,
      isVerified: (c.isVerified as boolean) ?? false,
    }));

    return { props: { featuredCaterers }, revalidate: 300 };
  } catch {
    return { props: { featuredCaterers: [] }, revalidate: 60 };
  }
};
