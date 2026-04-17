import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, Calendar, Users, Heart, Clock, Gift, Music, Coffee, Sparkles, Camera } from "lucide-react";
import apiClient from "../../utils/apiClient";
import { Badge } from "../../components/ui/badge";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface TimelineItem {
    time: string;
    title: string;
    description?: string;
    icon?: string;
}

interface PublicWeddingData {
    brideName: string;
    groomName: string;
    weddingDate: string;
    weddingCity: string;
    venueName?: string;
    venueAddress?: string;
    coverImage?: string;
    registryUrl?: string;
    accommodationInfo?: string;
    timelineItems?: TimelineItem[];
}

const FALLBACK_WEDDING: PublicWeddingData = {
    brideName: "Salma",
    groomName: "Yassine",
    weddingDate: "2026-08-15",
    weddingCity: "Casablanca",
    venueName: "Palais des Roses",
    venueAddress: "Boulevard de la Corniche, Casablanca",
    coverImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=85",
    registryUrl: "https://www.amazon.fr/wedding",
    accommodationInfo: "Nous avons négocié un tarif préférentiel au Four Seasons Casablanca. Mentionnez 'Farah Wedding' lors de votre réservation.",
    timelineItems: [
        { time: "17:00", title: "Accueil & Thé", description: "Réception des invités avec thé à la menthe et pâtisseries marocaines.", icon: "coffee" },
        { time: "18:30", title: "Cérémonie", description: "Échange des vœux et signature de l'acte.", icon: "heart" },
        { time: "20:00", title: "Dîner de Gala", description: "Un festin traditionnel animé par un orchestre andalou.", icon: "music" },
        { time: "23:00", title: "Défilé Negrafa", description: "Présentation des tenues traditionnelles.", icon: "sparkles" },
        { time: "01:00", title: "Gâteau Wedding", description: "Célébration finale et soirée dansante.", icon: "camera" }
    ]
};

const ICON_MAP: Record<string, any> = {
    coffee: Coffee,
    heart: Heart,
    music: Music,
    sparkles: Sparkles,
    camera: Camera,
    clock: Clock
};

export default function PublicWeddingPage({ wedding }: { wedding: PublicWeddingData | null }) {
    const { t } = useTranslation("common");
    const [isScrolled, setIsScrolled] = useState(false);
    const data = wedding || FALLBACK_WEDDING;

    const dateObj = data.weddingDate ? new Date(data.weddingDate) : null;
    const formattedDate = dateObj ? format(dateObj, "EEEE d MMMM yyyy", { locale: fr }) : "";

    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white selection:bg-primary/20">
            <Head>
                <title>{data.brideName} & {data.groomName} — Farah.ma</title>
                <meta name="description" content={`Rejoignez-nous pour célébrer le mariage de ${data.brideName} et ${data.groomName}.`} />
            </Head>

            {/* Premium Sticky Header (Airbnb Style) */}
            <header className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
                isScrolled ? "bg-white/80 backdrop-blur-xl border-b border-neutral-100 py-3 shadow-sm" : "bg-transparent"
            )}>
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <img 
                        src="/logo.svg" 
                        alt="Farah.ma" 
                        className={cn("h-6 transition-all", isScrolled ? "opacity-100" : "opacity-0")} 
                    />
                    <div className={cn("flex items-center gap-4 transition-all", isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4")}>
                        <Link 
                            href="#rsvp" 
                            className="bg-neutral-900 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-black transition-all"
                        >
                            {t("event.rsvp_btn")}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Immersive Hero (Parallax Effect) */}
            <section className="relative h-screen w-full overflow-hidden">
                <motion.div 
                    style={{ scale: useTransform(scrollYProgress, [0, 0.5], [1, 1.2]) }}
                    className="absolute inset-0"
                >
                    {data.coverImage ? (
                        <img 
                            src={data.coverImage} 
                            alt="Wedding Cover" 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                            <Heart className="w-24 h-24 text-primary/20" />
                        </div>
                    )}
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
                
                <div className="absolute inset-x-0 bottom-24 flex flex-col items-center text-center text-white px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <Badge variant="outline" className="mb-6 px-4 py-2 text-xs uppercase tracking-[0.3em] font-bold border-white/40 text-white backdrop-blur-md">
                            {t("event.save_the_date")}
                        </Badge>
                        <h1 className="font-display text-7xl md:text-[120px] font-black mb-8 leading-[0.9] tracking-tighter">
                            {data.brideName} <br />
                            <span className="text-primary italic font-serif">&</span> <br />
                            {data.groomName}
                        </h1>
                        <div className="flex flex-col md:flex-row items-center gap-8 text-lg font-medium opacity-90 tracking-wide mt-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-primary" />
                                <span>{formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-primary" />
                                <span>{data.weddingCity}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
                
                {/* Scroll Indicator */}
                <motion.div 
                    animate={{ y: [0, 10, 0] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <div className="w-[1px] h-12 bg-white/40 relative">
                        <div className="absolute top-0 left-0 w-full h-4 bg-primary rounded-full" />
                    </div>
                </motion.div>
            </section>

            {/* Gallery Bento Grid */}
            <section className="py-32 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[800px] md:h-[600px]">
                    <div className="md:col-span-2 md:row-span-2 rounded-[2rem] overflow-hidden group">
                        <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="md:col-span-1 rounded-[2rem] overflow-hidden group">
                        <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="md:col-span-1 rounded-[2rem] overflow-hidden group bg-primary/5 p-8 flex flex-col justify-center items-center text-center">
                        <Camera className="w-10 h-10 text-primary mb-4" />
                        <h3 className="font-display text-2xl font-bold">{t("event.gallery_title")}</h3>
                        <p className="text-sm text-neutral-500 mt-2">{t("event.gallery_desc")}</p>
                    </div>
                    <div className="md:col-span-1 border-2 border-neutral-100 rounded-[2rem] overflow-hidden flex items-center justify-center p-8 text-center italic font-serif text-xl">
                        "Two souls with but a single thought, two hearts that beat as one."
                    </div>
                    <div className="md:col-span-1 rounded-[2rem] overflow-hidden group">
                        <img src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                </div>
            </section>

            {/* Timeline & Schedule (TheKnot Style) */}
            <section className="py-32 bg-neutral-50">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <Badge variant="primary" className="mb-4">PROGRAMME</Badge>
                        <h2 className="font-display text-5xl font-black text-neutral-900 leading-tight">
                            Notre Déroulement
                        </h2>
                    </div>

                    <div className="relative border-l-2 border-primary/20 ml-6 md:ml-0 md:flex md:flex-col md:items-center">
                        {(data.timelineItems || FALLBACK_WEDDING.timelineItems)?.map((item, idx) => {
                            const IconComp = ICON_MAP[item.icon || "clock"] || Clock;
                            return (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className={cn(
                                        "relative md:w-[600px] mb-16 pl-12 md:pl-0",
                                        idx % 2 === 0 ? "md:mr-auto md:pr-24 md:text-right" : "md:ml-auto md:pl-24 md:text-left"
                                    )}
                                >
                                    {/* Timeline Node */}
                                    <div className="absolute left-[-11px] md:left-1/2 md:-translate-x-1/2 top-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 ring-8 ring-white">
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                    </div>
                                    
                                    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-black/5 hover:shadow-black/10 transition-shadow">
                                        <div className={cn("flex items-center gap-4 mb-4", idx % 2 === 0 ? "md:flex-row-reverse" : "")}>
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                                <IconComp className="w-6 h-6" />
                                            </div>
                                            <span className="text-primary font-black tracking-widest text-lg">{item.time}</span>
                                        </div>
                                        <h4 className="font-display text-2xl font-bold text-neutral-900 mb-2">{item.title}</h4>
                                        <p className="text-neutral-500 leading-relaxed text-sm">{item.description}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Details Grid (Registry & Lodging) */}
            <section className="py-32 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Registry */}
                <div className="bg-[#1A1A1A] text-white p-12 rounded-[3rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 transform group-hover:scale-110 transition-transform">
                        <Gift className="w-24 h-24 text-white/10" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <Badge className="bg-primary/20 text-primary border-transparent">CADEAUX</Badge>
                        <h3 className="font-display text-4xl font-bold">Liste de Mariage</h3>
                        <p className="text-white/60 text-lg max-w-md leading-relaxed">
                            Votre présence est notre plus beau cadeau. Si vous souhaitez toutefois nous gâter, notre liste de mariage est disponible ici.
                        </p>
                        <Link 
                            href={data.registryUrl || "#"} 
                            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-neutral-100 transition-all"
                        >
                            Consulter la liste →
                        </Link>
                    </div>
                </div>

                {/* Accomodation */}
                <div className="bg-primary/5 p-12 rounded-[3rem] relative overflow-hidden group border border-primary/10">
                    <div className="absolute top-0 right-0 p-8 transform group-hover:scale-110 transition-transform">
                        <MapPin className="w-24 h-24 text-primary/10" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <Badge className="bg-primary/10 text-primary border-transparent">HÉBERGEMENT</Badge>
                        <h3 className="font-display text-4xl font-bold text-neutral-900">Se loger à proximité</h3>
                        <p className="text-neutral-500 text-lg max-w-md leading-relaxed">
                            {data.accommodationInfo || "Des chambres ont été pré-réservées pour nos invités dans les hôtels alentours."}
                        </p>
                        <div className="flex flex-wrap gap-4 mt-8">
                            <span className="bg-white px-4 py-2 rounded-full text-xs font-bold shadow-sm border border-neutral-100">Four Seasons ★★★★★</span>
                            <span className="bg-white px-4 py-2 rounded-full text-xs font-bold shadow-sm border border-neutral-100">Pestana CR7 ★★★★</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky Bottom Bar (Airbnb Mobile Look) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-full duration-700">
                <div className="bg-white/90 backdrop-blur-2xl border border-neutral-100 p-4 rounded-[2rem] flex items-center justify-between shadow-[0_-8px_40px_-15px_rgba(0,0,0,0.1)]">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Prêt ?</p>
                        <p className="font-bold text-neutral-900">{t("event.rsvp_btn")}</p>
                    </div>
                    <Link 
                        href="#rsvp" 
                        className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20"
                    >
                        {t("event.rsvp_btn")}
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-20 border-t border-neutral-100 text-center bg-white pb-32 md:pb-20">
                <div className="flex items-center justify-center gap-2 text-neutral-300 font-display text-sm tracking-widest uppercase mb-6">
                    <div className="w-12 h-[1px] bg-neutral-100" />
                    <span>Propulsé par</span>
                    <div className="w-12 h-[1px] bg-neutral-100" />
                </div>
                <img src="/logo.svg" alt="Farah.ma" className="h-6 mx-auto opacity-20 grayscale" />
                <div id="rsvp" className="mt-8" />
            </footer>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
    try {
        const { slug } = params as { slug: string };
        const response = await apiClient.get(`/api/public/weddings/${slug}`);
        
        return {
            props: {
                wedding: response,
                ...(await serverSideTranslations(locale || "fr", ["common"])),
            },
        };
    } catch (error) {
        return {
            props: {
                wedding: null,
                ...(await serverSideTranslations(locale || "fr", ["common"])),
            },
        };
    }
};
