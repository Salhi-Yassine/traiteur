import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "../components/vendors/SearchBar";
import VendorCard, { VendorCardProps } from "../components/vendors/VendorCard";
import type { GetStaticProps } from "next";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

interface HomeProps {
  featuredVendors: VendorCardProps[];
}

const STATS = [
  { value: "800+", label: "Prestataires" },
  { value: "12", label: "Villes" },
  { value: "100%", label: "Vérifiés" },
  { value: "4.9", label: "Note Clients" },
];

const EVENT_CATEGORIES = [
  { label: "Salles", icon: "🏰", category: "Salles" },
  { label: "Traiteurs", icon: "🍽️", category: "Catering" },
  { label: "Négafas", icon: "👑", category: "Negrafa" },
  { label: "Photo & Vidéo", icon: "📸", category: "Photography" },
  { label: "Orchestres", icon: "🎵", category: "Music" },
  { label: "Décoration", icon: "🌸", category: "Decoration" },
  { label: "Beauté", icon: "💄", category: "Beauty" },
  { label: "Hébergement", icon: "🏨", category: "Transport" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Inspiration & Choix",
    description: "Parcourez les plus beaux mariages et trouvez les prestataires qui correspondent à votre style.",
  },
  {
    step: "02",
    title: "Planification Intelligente",
    description: "Gérez votre budget, votre liste d'invités et vos devis en un seul endroit sécurisé.",
  },
  {
    step: "03",
    title: "Le Jour J Parfait",
    description: "Vivez votre moment magique sans stress, entouré des meilleurs experts du Maroc.",
  },
];

const FALLBACK_VENDORS: VendorCardProps[] = [
  {
    id: 1,
    slug: "palais-des-roses-casablanca",
    businessName: "Palais des Roses",
    tagline: "Un cadre idyllique pour votre mariage de rêve",
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
    tagline: "Le raffinement des tenues traditionnelles",
    serviceArea: "Fès",
    category: "Negrafa",
    priceRange: "MADMADMAD+",
    coverImageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
    averageRating: 5.0,
    reviewCount: 64,
    isVerified: true,
  },
  {
    id: 3,
    slug: "traiteur-el-bahia-rabat",
    businessName: "Traiteur El Bahia",
    tagline: "L'excellence de la gastronomie fassie",
    serviceArea: "Rabat",
    category: "Catering",
    priceRange: "MADMAD",
    coverImageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
    averageRating: 4.8,
    reviewCount: 95,
    isVerified: true,
  },
];

export default function HomePage({ featuredVendors }: HomeProps) {
  const vendors = featuredVendors.length > 0 ? featuredVendors : FALLBACK_VENDORS;

  return (
    <div className="bg-background min-h-screen">
      <Head>
        <title>Farah.ma — Le Mariage Marocain de vos Rêves</title>
        <meta
          name="description"
          content="Découvrez les meilleurs prestataires pour votre mariage au Maroc : Salles, Traiteurs, Négafas, Photographes et bien plus encore sur Farah.ma."
        />
      </Head>

      {/* ─── PREMIUM HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1920&q=85"
            alt="Mariage Marocain"
            fill
            className="object-cover opacity-40 scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-primary" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-transparent to-primary/90" />
        </div>

        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/moroccan-flower.png')]" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="fade-in-up space-y-10">
            <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl px-6 py-2 rounded-full border border-white/10 text-secondary font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
                    Première Destination Mariage au Maroc
                </div>
            </div>
            
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.95] tracking-tighter">
                L'Art du Mariage <br />
                <span className="text-secondary italic font-light serif block mt-4">Marocain</span>
            </h1>
            
            <p className="text-white/80 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-medium text-balance">
                Connectez-vous aux artisans d'exception pour une célébration <br className="hidden md:block" /> 
                qui honore vos traditions et sublime votre amour.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-3xl mx-auto pt-4">
              <div className="w-full md:flex-1">
                <SearchBar variant="hero" />
              </div>
              <Button size="lg" variant="secondary" className="w-full md:w-auto shadow-gold group">
                Commencer le Planning
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST STATS ─── */}
      <section className="bg-white py-16 border-b border-border">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label} className="group cursor-default">
                <div className="font-display text-5xl font-black text-primary mb-2 group-hover:text-secondary transition-all group-hover:scale-110">
                  {value}
                </div>
                <div className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em]">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORY EXPLORATION ─── */}
      <section className="py-32 relative overflow-hidden bg-background">
        <div className="container mx-auto max-w-7xl px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="space-y-4">
                <Badge variant="accent" className="mb-2">Univers Farah</Badge>
                <h2 className="font-display text-5xl md:text-6xl font-black text-primary leading-[0.9]">
                    Inspiration par <br />
                    <span className="text-secondary italic font-light serif">Catégorie</span>
                </h2>
            </div>
            <p className="text-muted-foreground max-w-sm text-lg font-medium leading-relaxed italic">
              "Chaque détail compte pour faire de votre union un moment qui traversera le temps."
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {EVENT_CATEGORIES.map(({ label, icon, category }) => (
              <Link
                key={label}
                href={`/vendors?category=${category}`}
                className="group relative h-56 rounded-[3rem] bg-white border border-border flex flex-col items-center justify-center gap-6 transition-all hover:shadow-premium-hover hover:-translate-y-3 hover:border-secondary/20"
              >
                <div className="w-20 h-20 rounded-3xl bg-accent flex items-center justify-center text-4xl group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-sm">
                    {icon}
                </div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary group-hover:text-secondary transition-colors">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED VENDORS ─── */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/moroccan-flower.png')]" />
        
        <div className="container mx-auto max-w-7xl px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-20 gap-8">
            <div className="space-y-4 text-center md:text-left">
                <Badge variant="outline" className="text-white border-white/20">Sélection</Badge>
                <h2 className="font-display text-5xl md:text-6xl font-black text-white leading-[0.9]">
                    Prestataires <br />
                    <span className="text-secondary italic font-light serif">D'Excellence</span>
                </h2>
            </div>
            <Link href="/vendors">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 group">
                DÉCOUVRIR TOUT LE CATALOGUE
                <svg className="w-4 h-4 translate-x-1 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {vendors.map((vendor) => (
              <VendorCard key={vendor.id} {...vendor} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-40 bg-white relative">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-24 space-y-6">
            <Badge variant="accent" className="mx-auto">Accompagnement</Badge>
            <h2 className="font-display text-5xl md:text-7xl font-black text-primary">Sérénité Farah.ma</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {HOW_IT_WORKS.map(({ step, title, description }) => (
              <div key={step} className="group text-center space-y-8 relative">
                <div className="relative inline-block pb-8">
                    <div className="text-9xl font-display font-black text-accent/30 group-hover:text-secondary/10 transition-colors duration-700 leading-none">{step}</div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-secondary group-hover:w-16 transition-all duration-500" />
                </div>
                <h3 className="font-display font-black text-3xl text-primary">
                  {title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-medium max-w-xs mx-auto">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-32 bg-background">
        <div className="container mx-auto max-w-6xl px-6">
            <Card className="bg-primary p-16 md:p-28 text-center relative overflow-hidden border-none rounded-[4rem]">
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/moroccan-flower.png')]" />
                
                <CardContent className="relative z-10 space-y-12">
                    <h2 className="font-display text-5xl md:text-8xl font-black text-white leading-tight tracking-tighter">
                        Écrivons votre <br />
                        <span className="text-secondary italic font-light serif underline decoration-secondary/30">Légende</span>
                    </h2>
                    <p className="text-white/70 text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
                        Rejoignez la communauté Farah et donnez à votre mariage <br className="hidden md:block" /> 
                        le prestige qu'il mérite.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                      <Link href="/auth/register?type=vendor">
                        <Button size="lg" variant="secondary" className="px-12 h-16 text-base group">
                          Inscrire mon entreprise
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Button>
                      </Link>
                      <Link href="/auth/register?type=couple">
                        <Button size="lg" variant="outline" className="px-12 h-16 text-base border-white/20 text-white hover:bg-white/10">
                          Créer mon compte couple
                        </Button>
                      </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost";
    const res = await fetch(`${baseUrl}/api/vendor_profiles?isVerified=true&page=1&itemsPerPage=3`, {
      headers: { Accept: "application/ld+json" },
    });

    if (!res.ok) throw new Error("API not available");
    const data = await res.json();
    const members = data["hydra:member"] ?? [];

    const featuredVendors: VendorCardProps[] = members.map((v: Record<string, unknown>) => ({
      id: (v.id as number) ?? 0,
      slug: v.slug as string,
      businessName: v.businessName as string,
      tagline: v.tagline as string | undefined,
      serviceArea: v.serviceArea as string,
      category: (v.category as string) ?? "Other",
      priceRange: v.priceRange as string,
      coverImageUrl: v.coverImageUrl as string | undefined,
      averageRating: v.averageRating ? parseFloat(v.averageRating as string) : undefined,
      reviewCount: (v.reviewCount as number) ?? 0,
      isVerified: (v.isVerified as boolean) ?? false,
    }));

    return { props: { featuredVendors }, revalidate: 300 };
  } catch {
    return { props: { featuredVendors: [] }, revalidate: 60 };
  }
};
