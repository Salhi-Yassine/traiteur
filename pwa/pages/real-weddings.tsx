import { GetStaticProps } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MapPin, SlidersHorizontal } from "lucide-react";
import { fetchServerSide } from "@/utils/fetchServerSide";
import WeddingStoryCard, { WeddingStory } from "@/components/inspiration/WeddingStoryCard";
import WeddingStoryModal from "@/components/inspiration/WeddingStoryModal";
import { cn } from "@/lib/utils";

// ─── Rich Moroccan Mock Data ───────────────────────────────────────────────────
const MOCK_STORIES: WeddingStory[] = [
    {
        id: "1",
        slug: "leila-karim-marrakech",
        coupleNames: "Leila & Karim",
        location: "Marrakech",
        vibe: "Palatial",
        style: "Palatial",
        season: "Printemps",
        coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
        colorPalette: ["#C9A96E", "#1A1A1A", "#FDF8F0"],
        gallery: [
            "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
        ],
        description: "Une célébration royale de 3 jours au Palais Namaskar, avec des caftans brodés à la main et une décoration florale époustouflante mêlant roses de Damas et fleurs d'oranger.",
        celebrationTimeline: [
            { time: "Jour 1", event: "Hammam & Henné", description: "Cérémonie intime du henné avec les femmes de la famille, suivie d'un dîner traditionnel." },
            { time: "Jour 2", event: "La Fatiha", description: "Lecture du Coran et officialisation de l'union devant les familles réunies." },
            { time: "Jour 3", event: "La Grande Nuit", description: "500 invités, 7 changements de caftans, et une soirée musicale jusqu'à l'aube." },
        ],
        vendorCredits: [
            { role: "Négafa", name: "Négafa Dar El Makhzen", slug: "negafa-dar-el-makhzen" },
            { role: "Traiteur", name: "Traiteur El Bahia", slug: "traiteur-el-bahia" },
            { role: "Salle", name: "Palais Namaskar", slug: "palais-namaskar" },
            { role: "Photographe", name: "Studio Lumière", slug: "studio-lumiere" },
        ],
    },
    {
        id: "2",
        slug: "nadia-youssef-casablanca",
        coupleNames: "Nadia & Youssef",
        location: "Casablanca",
        vibe: "Modern",
        style: "Modern",
        season: "Été",
        coverImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
        colorPalette: ["#E8472A", "#FFFFFF", "#1A1A1A"],
        gallery: [
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800",
        ],
        description: "Un mariage contemporain au cœur de Casablanca, alliant tradition et modernité avec des invitations numériques, une décoration minimaliste et un DJ set acclamé.",
        celebrationTimeline: [
            { time: "18h", event: "Cérémonie", description: "Un nikah intime en famille dans une villa privée." },
            { time: "21h", event: "Soirée", description: "Dîner gastronomique et dance floor jusqu'à 4h du matin." },
        ],
        vendorCredits: [
            { role: "Néqafa", name: "Maison Zineb", slug: "maison-zineb" },
            { role: "Musique", name: "DJ Brahim Atlas", slug: "dj-brahim" },
            { role: "Photographe", name: "Lens & Larmes", slug: "lens-larmes" },
        ],
    },
    {
        id: "3",
        slug: "amina-rachid-fes",
        coupleNames: "Amina & Rachid",
        location: "Fès",
        vibe: "Traditional",
        style: "Traditional",
        season: "Automne",
        coverImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800",
        colorPalette: ["#8B4513", "#FFD700", "#2C1810"],
        gallery: [
            "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1594553280144-8846c4f74ee4?auto=format&fit=crop&q=80&w=800",
        ],
        description: "Un mariage ancré dans la tradition fassi : la sposa portait 9 caftans, chacun représentant une époque de l'histoire de sa famille. Un voyage dans le temps.",
        celebrationTimeline: [
            { time: "Jour 1", event: "Henné Fassi", description: "Cérémonie du henné dans un riad centenaire de la Médina." },
            { time: "Jour 2", event: "Amaria", description: "Procession traditionnelle portée par les porteurs en habit folklorique." },
        ],
        vendorCredits: [
            { role: "Négafa", name: "Négafa Fatima Fassia", slug: "negafa-fatima" },
            { role: "Mahia", name: "Traiteur Mounia", slug: "traiteur-mounia" },
            { role: "Musiciens", name: "Ensemble Andalou de Fès", slug: "ensemble-andalou" },
        ],
    },
    {
        id: "4",
        slug: "samira-omar-rabat",
        coupleNames: "Samira & Omar",
        location: "Rabat",
        vibe: "Bohème",
        style: "Bohème",
        season: "Printemps",
        coverImage: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800",
        colorPalette: ["#D4A96A", "#F5E6D3", "#8B6914"],
        gallery: [
            "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=800",
        ],
        description: "Un soir de printemps dans les jardins de Chellah, avec des lampions, des fleurs sauvages et une musique gnaoua qui a envoûté les 200 invités présents.",
        celebrationTimeline: [
            { time: "19h", event: "Cérémonie en plein air", description: "Un cercle sous les étoiles, entouré de bougies et de fleurs d'oranger." },
            { time: "21h30", event: "Dîner & Gnaoua", description: "Tables dressées parmi les ruines romaines illuminées." },
        ],
        vendorCredits: [
            { role: "Décoration", name: "Studio Botanica", slug: "studio-botanica" },
            { role: "Traiteur", name: "La Table du Roi", slug: "table-du-roi" },
        ],
    },
    {
        id: "5",
        slug: "hana-bilal-agadir",
        coupleNames: "Hana & Bilal",
        location: "Agadir",
        vibe: "Minimalist",
        style: "Minimalist",
        season: "Été",
        coverImage: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800",
        colorPalette: ["#E8E0D8", "#1A1A1A", "#C4B49A"],
        gallery: [
            "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800",
        ],
        description: "Face à l'Atlantique, un mariage dépouillé, épuré, avec seulement 40 invités. La beauté du naturel au-dessus de tout apparat.",
        celebrationTimeline: [
            { time: "17h", event: "Sunset Ceremony", description: "Un échange de vœux face au soleil couchant sur la plage privée." },
            { time: "20h", event: "Dîner de gala", description: "Tables en bois flotté, menu de poissons frais, ambiance feutrée." },
        ],
        vendorCredits: [
            { role: "Photographe", name: "Mer & Lumière", slug: "mer-lumiere" },
            { role: "Traiteur", name: "L'Atelier d'Agadir", slug: "atelier-agadir" },
        ],
    },
];

const CITIES = ["Toutes", "Casablanca", "Marrakech", "Rabat", "Fès", "Agadir"];
const STYLES = ["Tous", "Palatial", "Modern", "Traditional", "Bohème", "Minimalist"];
const SEASONS = ["Toutes", "Printemps", "Été", "Automne", "Hiver"];

interface RealWeddingsPageProps {
    stories: WeddingStory[];
}

export default function RealWeddingsPage({ stories }: RealWeddingsPageProps) {
    const { t } = useTranslation("common");
    const [selectedStory, setSelectedStory] = useState<WeddingStory | null>(null);
    const [activeCity, setActiveCity] = useState("Toutes");
    const [activeStyle, setActiveStyle] = useState("Tous");
    const [activeSeason, setActiveSeason] = useState("Toutes");

    const displayStories = stories.length > 0 ? stories : MOCK_STORIES;

    const filtered = displayStories.filter((s) => {
        const cityMatch = activeCity === "Toutes" || s.location === activeCity;
        const styleMatch = activeStyle === "Tous" || s.style === activeStyle;
        const seasonMatch = activeSeason === "Toutes" || s.season === activeSeason;
        return cityMatch && styleMatch && seasonMatch;
    });

    return (
        <div className="bg-white min-h-screen">
            <Head>
                <title>Vrais Mariages Marocains — Farah.ma</title>
                <meta name="description" content="Découvrez de vrais mariages marocains : Négafas, caftans, lieux de rêve et prestataires vérifiés. Inspirez-vous et trouvez vos pros." />
                <meta property="og:title" content="Vrais Mariages — Farah Magazine" />
            </Head>

            {/* ── Editorial Hero ── */}
            <header className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-16">
                <div className="max-w-3xl space-y-6">
                    <div className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
                        <Heart size={14} fill="currentColor" />
                        Ils ont dit oui sur Farah
                    </div>
                    <h1 className="font-display text-[clamp(3rem,8vw,5.5rem)] text-neutral-900 leading-[1.02] tracking-tight">
                        Vrais Mariages
                    </h1>
                    <p className="text-[1.125rem] text-neutral-500 leading-relaxed max-w-xl">
                        Des histoires vraies, des émotions sincères, et les prestataires qui ont tout rendu possible. Inspirez-vous et réservez directement depuis les stories.
                    </p>
                </div>
            </header>

            {/* ── Sticky Filter Bar ── */}
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-100 py-4">
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap gap-3 items-center">
                    {/* City filter */}
                    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                        <MapPin className="w-4 h-4 text-primary shrink-0 me-1" />
                        {CITIES.map((city) => (
                            <button
                                key={city}
                                onClick={() => setActiveCity(city)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap border",
                                    activeCity === city
                                        ? "bg-neutral-900 text-white border-neutral-900"
                                        : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400"
                                )}
                            >
                                {city}
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-6 bg-neutral-200 hidden md:block" />

                    {/* Style filter */}
                    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                        <SlidersHorizontal className="w-4 h-4 text-neutral-400 shrink-0 me-1" />
                        {STYLES.map((style) => (
                            <button
                                key={style}
                                onClick={() => setActiveStyle(style)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap border",
                                    activeStyle === style
                                        ? "bg-primary text-white border-primary"
                                        : "bg-white text-neutral-500 border-neutral-200 hover:border-primary/40"
                                )}
                            >
                                {style}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Stories Grid ── */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                <div className="flex items-center justify-between mb-12">
                    <p className="text-neutral-400 text-[14px]">
                        <span className="font-semibold text-neutral-900">{filtered.length}</span>{" "}
                        histoire{filtered.length !== 1 ? "s" : ""} trouvée{filtered.length !== 1 ? "s" : ""}
                    </p>
                </div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((story) => (
                            <motion.div
                                key={story.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.35 }}
                            >
                                <WeddingStoryCard
                                    story={story}
                                    onClick={() => setSelectedStory(story)}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filtered.length === 0 && (
                    <div className="py-32 text-center space-y-4">
                        <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto text-4xl">
                            💝
                        </div>
                        <h3 className="font-display text-2xl text-neutral-900">Aucun mariage trouvé</h3>
                        <p className="text-neutral-400">Essayez un autre filtre ou revenez bientôt pour de nouvelles histoires.</p>
                    </div>
                )}
            </div>

            {/* Immersive Viewer */}
            <WeddingStoryModal
                story={selectedStory}
                isOpen={!!selectedStory}
                onClose={() => setSelectedStory(null)}
            />
        </div>
    );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    try {
        const stories = await fetchServerSide("/api/wedding_stories", { locale: locale ?? "fr" }) as { member?: WeddingStory[] };

        return {
            props: {
                stories: stories?.member ?? [],
                ...(await serverSideTranslations(locale ?? "fr", ["common"])),
            },
            revalidate: 300,
        };
    } catch {
        return {
            props: {
                stories: [],
                ...(await serverSideTranslations(locale ?? "fr", ["common"])),
            },
            revalidate: 60,
        };
    }
};
