import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Heart } from "lucide-react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { WeddingProvider } from "@/context/WeddingContext";
import apiClient from "../../utils/apiClient";

// Components
import RSVPSearchWidget from "../../components/guest/RSVPSearchWidget";
import InvitationHero from "../../components/invitation/InvitationHero";
import CoupleMeet from "../../components/invitation/CoupleMeet";
import OurStory from "../../components/invitation/OurStory";
import WeddingGallery from "../../components/invitation/WeddingGallery";
import HoneyFundRegistry from "../../components/invitation/HoneyFundRegistry";
import WeddingTimeline from "../../components/invitation/WeddingTimeline";
import QASection from "../../components/invitation/QASection";
import DetailsGrid from "../../components/invitation/DetailsGrid";
import VenueLocation from "../../components/invitation/VenueLocation";
import RSVPBar from "../../components/invitation/RSVPBar";
import GiftModal from "../../components/invitation/GiftModal";
import LenisProvider from "../../components/layout/LenisProvider";

// Config & Utils
import { 
    PublicWeddingData, 
    FALLBACK_WEDDING, 
    THEME_STYLES, 
    getThemeColorStyle,
    HoneyFundItem
} from "../../utils/invitationConfig";

export default function PublicWeddingPage({ wedding }: { wedding: PublicWeddingData | null }) {
    const { t } = useTranslation("common");
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const data = wedding || FALLBACK_WEDDING;

    const dateObj = data.weddingDate ? new Date(data.weddingDate) : null;
    const formattedDate = dateObj ? format(dateObj, "EEEE d MMMM yyyy", { locale: fr }) : "";

    const { scrollY } = useScroll();

    useEffect(() => {
        return scrollY.onChange((latest) => {
            setIsScrolled(latest > 100);
        });
    }, [scrollY]);

    const theme = THEME_STYLES[data.selectedTheme || "modern"] || THEME_STYLES.modern;
    const themeColorStyle = getThemeColorStyle(data.themeColor);

    // State
    const [isSaved, setIsSaved] = useState(false);
    const [activeHoneyFund, setActiveHoneyFund] = useState<HoneyFundItem | null>(null);
    const [contributionAmount, setContributionAmount] = useState<string>("");
    const [isGifting, setIsGifting] = useState(false);
    const [giftSuccess, setGiftSuccess] = useState(false);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${data.brideName} & ${data.groomName}`,
                text: t("event.save_the_date"),
                url: window.location.href
            });
        }
    };

    const handleGiftSubmit = () => {
        setIsGifting(true);
        // Simulate API call
        setTimeout(() => {
            setIsGifting(false);
            setGiftSuccess(true);
        }, 1500);
    };

    const baseUrl = (wedding as any)?.baseUrl || "https://farah.ma";
    const ogImageUrl = `${baseUrl}/api/og/wedding?bride=${encodeURIComponent(data.brideName)}&groom=${encodeURIComponent(data.groomName)}&image=${encodeURIComponent(data.coverImage || "")}&date=${encodeURIComponent(formattedDate)}&city=${encodeURIComponent(data.weddingCity || "")}&locale=${router.locale || "fr"}`;
    const invitationTitle = t("event.invitation_title", { bride: data.brideName, groom: data.groomName });
    const invitationDesc = t("event.invitation_desc", { date: formattedDate, city: data.weddingCity });

    // Structured Data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WeddingEvent",
        "name": invitationTitle,
        "description": invitationDesc,
        "startDate": data.weddingDate,
        "location": {
            "@type": "Place",
            "name": data.venueName || data.weddingCity,
            "address": {
                "@type": "PostalAddress",
                "addressLocality": data.weddingCity,
                "streetAddress": data.venueAddress || ""
            }
        },
        "image": ogImageUrl,
        "eventStatus": "https://schema.org/EventScheduled",
    };

    return (
        <WeddingProvider initialData={wedding}>
            <LenisProvider>
                <div className="bg-[#FCFCFC] min-h-screen text-[#222222] selection:bg-[#E8472A]/10 selection:text-[#E8472A]" style={themeColorStyle}>
                <Head>
                    <title>{`${data.brideName} & ${data.groomName}'s Wedding`}</title>
                    <meta name="description" content={`You're invited to celebrate the wedding of ${data.brideName} and ${data.groomName} on ${formattedDate}.`} />
                    
                    {/* OpenGraph / WhatsApp Meta Tags — Optimized for Massive Expansion */}
                    <meta property="og:title" content={`You're Invited! 💍 ${data.brideName} & ${data.groomName}`} />
                    <meta property="og:description" content={`✨ Vous êtes invités à célébrer notre mariage le ${formattedDate} à ${data.weddingCity}. Cliquez pour voir l'invitation et confirmer votre présence !`} />
                    <meta property="og:image" content={ogImageUrl} />
                    <meta property="og:image:secure_url" content={ogImageUrl} />
                    <meta property="og:image:type" content="image/png" />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />
                    <meta property="og:image:alt" content={`Invitation au mariage de ${data.brideName} & ${data.groomName}`} />
                    <meta property="og:url" content={`${baseUrl}/invitation/${data.slug}`} />
                    <meta property="og:type" content="website" />
                    <meta property="og:site_name" content="Farah.ma" />
                    
                    {/* Twitter/X Specifics */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={`${data.brideName} & ${data.groomName} — Save the Date`} />
                    <meta name="twitter:description" content={`Join us on ${formattedDate} for our wedding celebration.`} />
                    <meta name="twitter:image" content={ogImageUrl} />
                    
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                    />
                </Head>

                {/* Header */}
                <header className={cn(
                    "fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b",
                    isScrolled 
                        ? "bg-white/80 backdrop-blur-md border-neutral-200 py-4 shadow-sm" 
                        : "bg-transparent border-transparent py-6"
                )}>
                    <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isScrolled ? 1 : 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black text-sm">
                                {data.brideName[0]}{data.groomName[0]}
                            </div>
                            <span className="font-bold text-neutral-900 hidden md:block">
                                {data.brideName} & {data.groomName}
                            </span>
                        </motion.div>
                        <div className="flex items-center gap-2">
                            <Link 
                                href="#rsvp"
                                className={cn(
                                    "px-6 py-2 rounded-full font-bold text-sm transition-all shadow-md active:scale-95",
                                    isScrolled ? "bg-primary text-white" : "bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                                )}
                            >
                                {t("event.rsvp_btn")}
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="space-y-0">
                    <InvitationHero 
                        data={data}
                        formattedDate={formattedDate}
                        isSaved={isSaved}
                        onSaveToggle={() => setIsSaved(!isSaved)}
                        onShare={handleShare}
                    />

                    <div className="max-w-4xl mx-auto px-6 py-24 space-y-24">
                        <CoupleMeet data={data} formattedDate={formattedDate} />

                        <OurStory story={data.ourStory} fontTitle={theme.fontTitle} />

                        <WeddingGallery images={data.galleryImages} fontTitle={theme.fontTitle} />

                        <HoneyFundRegistry 
                            honeyFunds={data.honeyFunds || FALLBACK_WEDDING.honeyFunds || []}
                            fontTitle={theme.fontTitle}
                            onFundSelect={setActiveHoneyFund}
                        />

                        <QASection qa={data.qa || []} fontTitle={theme.fontTitle} />

                        <WeddingTimeline 
                            items={data.timelineItems || FALLBACK_WEDDING.timelineItems || []} 
                            fontTitle={theme.fontTitle}
                            bgLight={theme.bgLight}
                        />

                        <VenueLocation 
                            venueName={data.venueName!}
                            city={data.weddingCity}
                            address={data.venueAddress || ""}
                        />

                        <DetailsGrid data={data} />
                    </div>
                </main>

                <RSVPBar data={data} />

                {/* Desktop RSVP Widget */}
                <section id="rsvp" className="py-24 bg-white/50 border-t border-neutral-100 hidden md:block">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-black/5 border border-neutral-100 text-center relative overflow-hidden">
                            <div className="absolute top-0 end-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 start-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                            <div className="relative z-10">
                                <RSVPSearchWidget slug={data.slug} initialGuest={data.preloadedGuest} />
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="py-20 border-t border-neutral-100 text-center bg-white pb-32 md:pb-20">
                    <div className="flex items-center justify-center gap-2 text-neutral-300 font-display text-sm tracking-widest uppercase mb-6">
                        <div className="w-12 h-[1px] bg-neutral-100" />
                        <span>{t("event.powered_by")}</span>
                        <div className="w-12 h-[1px] bg-neutral-100" />
                    </div>
                    <Image src="/logo.svg" alt="Farah.ma" width={80} height={24} className="h-6 w-auto mx-auto opacity-20 grayscale" />
                </footer>

                <GiftModal 
                    item={activeHoneyFund}
                    open={!!activeHoneyFund}
                    onClose={() => setActiveHoneyFund(null)}
                    giftSuccess={giftSuccess}
                    onGiftSuccessClose={() => {
                        setActiveHoneyFund(null);
                        setGiftSuccess(false);
                    }}
                    contributionAmount={contributionAmount}
                    setContributionAmount={setContributionAmount}
                    isGifting={isGifting}
                    onGiftSubmit={handleGiftSubmit}
                    fontTitle={theme.fontTitle}
                />
            </div>
          </LenisProvider>
        </WeddingProvider>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ params, req, locale }) => {
    const slug = params?.slug as string;
    const host = req.headers.host || "localhost:3000";
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const baseUrl = `${protocol}://${host}`;

    try {
        const response = await apiClient.get<PublicWeddingData>(`/public/weddings/${slug}`);
        const wedding = response;

        return {
            props: {
                wedding: {
                    ...wedding,
                    baseUrl
                },
                ...(await serverSideTranslations(locale || "fr", ["common"])),
            },
        };
    } catch (error) {
        return {
            props: {
                wedding: {
                    ...FALLBACK_WEDDING,
                    baseUrl
                },
                ...(await serverSideTranslations(locale || "fr", ["common"])),
            },
        };
    }
};
