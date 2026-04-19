import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import PlanningLayout from "../../components/layout/PlanningLayout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { TemplateCard, ThemeId } from "../../components/templates/TemplateCard";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, Laptop, Smartphone, X, Crown, Palette } from "lucide-react";
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from "../../components/ui/dialog";

const THEMES_DATA = [
    { id: "modern", category: "modern", imageSrc: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80" },
    { id: "romantic", category: "romantic", imageSrc: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80" },
    { id: "classic", category: "classic", imageSrc: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80" },
    { id: "boho", category: "romantic", imageSrc: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80" },
    { id: "dark", category: "dark", imageSrc: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80" },
    { id: "moroccan", category: "moroccan", imageSrc: "https://images.unsplash.com/photo-1539617546058-a8d116cb5e2f?w=800&q=80", isPremium: true },
];

const COLOR_PALETTES = [
    { id: "default", name: "Original", classInfo: "bg-neutral-800" },
    { id: "rose", name: "Rose Gold", classInfo: "bg-rose-400" },
    { id: "emerald", name: "Emerald", classInfo: "bg-emerald-600" },
    { id: "amber", name: "Sahara Amber", classInfo: "bg-amber-500" },
    { id: "indigo", name: "Indigo", classInfo: "bg-indigo-600" },
];

type WeddingProfileQuery = {
    brideName?: string;
    groomName?: string;
    selectedTheme?: string;
};

export default function TemplatesGallery() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const queryClient = useQueryClient();

    const [brideName, setBrideName] = useState("");
    const [groomName, setGroomName] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [quickViewTheme, setQuickViewTheme] = useState<any>(null);
    const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
    const [selectedColor, setSelectedColor] = useState("default");
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    // Fetch existing profile to populate names & current theme
    const { data: profile } = useQuery<WeddingProfileQuery | null>({
        queryKey: ["weddingProfile"],
        queryFn: () => apiClient.get<WeddingProfileQuery>("/api/dashboard/wedding-profile").catch(() => null),
    });

    useEffect(() => {
        if (profile) {
            if (profile.brideName) setBrideName(profile.brideName);
            if (profile.groomName) setGroomName(profile.groomName);
        }
    }, [profile]);

    // Save Theme Mutation
    const updateThemeMutation = useMutation({
        mutationFn: ({ themeId, themeColor }: { themeId: string, themeColor: string }) => 
            apiClient.patch("/api/dashboard/wedding-profile", { selectedTheme: themeId, themeColor: themeColor }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["weddingProfile"] });
            router.push("/mariage/site");
        }
    });

    const handleSelectTheme = (themeId: string, isPremium: boolean = false) => {
        if (isPremium) {
            setShowPremiumModal(true);
            return;
        }
        updateThemeMutation.mutate({ themeId, themeColor: selectedColor });
    };

    const categories = [
        { id: "all", label: t("website.templates_gallery.filter_all") },
        { id: "modern", label: t("website.templates_gallery.filter_modern") },
        { id: "romantic", label: t("website.templates_gallery.filter_romantic") },
        { id: "classic", label: t("website.templates_gallery.filter_classic") },
        { id: "dark", label: t("website.templates_gallery.filter_dark") },
        { id: "moroccan", label: t("website.templates_gallery.filter_moroccan") },
    ];

    const filteredThemes = activeCategory === "all" 
        ? THEMES_DATA 
        : THEMES_DATA.filter(th => th.category === activeCategory);

    return (
        <PlanningLayout 
            title={t("website.templates_gallery.page_title")} 
            description={t("website.templates_gallery.page_subtitle")}
        >
            <Head>
                <title>{t("website.templates_gallery.page_title")} — Farah.ma</title>
            </Head>

            <div className="absolute top-0 start-0 w-full h-[50vh] bg-gradient-to-b from-primary/5 to-transparent -z-10" />

            <div className="max-w-7xl mx-auto space-y-12 pb-32">
                {/* Header & Back Action */}
                <div className="pt-8">
                    <button 
                        onClick={() => router.push("/mariage/site")}
                        className="flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                        {t("common.back")}
                    </button>
                    <h1 className="text-5xl font-display font-black text-neutral-900 tracking-tight mb-4">
                        {t("website.templates_gallery.page_title")}
                    </h1>
                    <p className="text-xl text-neutral-500 max-w-2xl">
                        {t("website.templates_gallery.page_subtitle")}
                    </p>
                </div>

                {/* "See Your Names Live" Sticky Bar */}
                <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-black/5 border border-neutral-100 flex flex-col md:flex-row items-center gap-6 sticky top-8 z-30">
                    <div className="shrink-0 text-sm font-bold text-neutral-400 uppercase tracking-widest">
                        {t("website.templates_gallery.live_preview_label")}
                    </div>
                    <div className="flex-1 flex items-center gap-4 w-full">
                        <Input 
                            placeholder={t("onboarding.fields.bride_name")} 
                            value={brideName}
                            onChange={(e) => setBrideName(e.target.value)}
                            className="rounded-2xl border-2 border-neutral-200 bg-neutral-50 focus-visible:ring-0 focus-visible:border-primary text-lg font-bold"
                        />
                        <span className="text-neutral-300 font-serif italic text-2xl">&amp;</span>
                        <Input 
                            placeholder={t("onboarding.fields.groom_name")} 
                            value={groomName}
                            onChange={(e) => setGroomName(e.target.value)}
                            className="rounded-2xl border-2 border-neutral-200 bg-neutral-50 focus-visible:ring-0 focus-visible:border-primary text-lg font-bold"
                        />
                    </div>
                </div>

                {/* Category Filters (Airbnb Style) */}
                <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar border-b border-neutral-100">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={cn(
                                "px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all",
                                activeCategory === cat.id 
                                    ? "bg-neutral-900 text-white shadow-md shadow-black/20" 
                                    : "bg-white text-neutral-500 hover:bg-neutral-100 border border-neutral-200"
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Themes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredThemes.map((theme) => (
                        <TemplateCard
                            key={theme.id}
                            id={theme.id as ThemeId}
                            title={t(`website.themes.${theme.id}`)}
                            description={`A meticulously designed ${theme.id} aesthetic.`}
                            imageSrc={theme.imageSrc}
                            isPremium={theme.isPremium}
                            brideName={brideName}
                            groomName={groomName}
                            isActive={profile?.selectedTheme === theme.id}
                            onSelect={() => handleSelectTheme(theme.id, theme.isPremium)}
                            onQuickView={() => {
                                setQuickViewTheme(theme);
                                setSelectedColor("default");
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Quick View Modal */}
            <Dialog open={!!quickViewTheme} onOpenChange={(open) => !open && setQuickViewTheme(null)}>
                <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 rounded-[2rem] overflow-hidden bg-neutral-100 flex flex-col">
                    {/* Modal Header */}
                    <div className="px-6 py-4 bg-white border-b border-neutral-200 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-4">
                            <h3 className="font-bold text-xl">{quickViewTheme ? t(`website.themes.${quickViewTheme.id}`) : ""}</h3>
                            {quickViewTheme?.isPremium && (
                                <span className="bg-black text-[#D4AF37] px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Premium</span>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-full">
                            <button 
                                onClick={() => setPreviewMode("desktop")}
                                className={cn("p-2 rounded-full transition-colors", previewMode === "desktop" ? "bg-white shadow-sm" : "text-neutral-500 hover:text-neutral-900")}
                            >
                                <Laptop className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => setPreviewMode("mobile")}
                                className={cn("p-2 rounded-full transition-colors", previewMode === "mobile" ? "bg-white shadow-sm" : "text-neutral-500 hover:text-neutral-900")}
                            >
                                <Smartphone className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button 
                                onClick={() => quickViewTheme && handleSelectTheme(quickViewTheme.id, quickViewTheme.isPremium)}
                                disabled={updateThemeMutation.isPending}
                                className={cn(
                                    "rounded-full px-8 font-bold flex items-center gap-2", 
                                    quickViewTheme?.isPremium ? "bg-black hover:bg-neutral-800 text-[#D4AF37]" : "bg-primary hover:bg-primary/90 text-white"
                                )}
                            >
                                {updateThemeMutation.isPending ? t("common.loading") : (
                                    <>
                                        {quickViewTheme?.isPremium && <Crown className="w-4 h-4" />}
                                        {t("website.templates_gallery.use_theme")}
                                    </>
                                )}
                            </Button>
                            <DialogClose className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors">
                                <X className="w-5 h-5" />
                            </DialogClose>
                        </div>
                    </div>

                    {/* Color Swatches Bar */}
                    <div className="px-6 py-3 bg-white border-b border-neutral-100 flex items-center gap-4 shadow-sm z-10 shrink-0">
                        <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-widest border-e border-neutral-200 pe-4 me-2">
                            <Palette className="w-4 h-4" />
                            Couleurs
                        </div>
                        <div className="flex items-center gap-3">
                            {COLOR_PALETTES.map((color) => (
                                <button
                                    key={color.id}
                                    onClick={() => setSelectedColor(color.id)}
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 transition-all disabled:opacity-50",
                                        color.classInfo,
                                        selectedColor === color.id ? "ring-2 ring-primary ring-offset-2 border-white scale-110" : "border-transparent hover:scale-110",
                                    )}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* IFrame/Mock Container */}
                    <div className="flex-1 overflow-auto bg-neutral-100/50 p-4 md:p-8 flex justify-center items-start">
                        <div className={cn(
                            "bg-white shadow-2xl transition-all duration-500 overflow-hidden relative",
                            previewMode === "desktop" ? "w-full max-w-5xl rounded-lg min-h-screen" : "w-[375px] h-[812px] rounded-[3rem] border-[14px] border-black my-8"
                        )}>
                            <div className={cn("w-full h-full flex flex-col items-center justify-between text-neutral-400 p-10 text-center transition-colors duration-500", 
                                selectedColor === "rose" ? "bg-rose-50" :
                                selectedColor === "emerald" ? "bg-emerald-50" :
                                selectedColor === "amber" ? "bg-amber-50" :
                                selectedColor === "indigo" ? "bg-indigo-50" : "bg-neutral-50"
                            )}>
                                <div className="flex flex-col items-center flex-1 justify-center">
                                    <div className={cn("w-32 h-32 rounded-full mb-8 shadow-inner", 
                                        selectedColor === "rose" ? "bg-rose-200 text-rose-500" :
                                        selectedColor === "emerald" ? "bg-emerald-200 text-emerald-500" :
                                        selectedColor === "amber" ? "bg-amber-200 text-amber-600" :
                                        selectedColor === "indigo" ? "bg-indigo-200 text-indigo-500" : "bg-neutral-200 text-neutral-500"
                                    )}></div>
                                    <h1 className={cn("text-4xl font-black mb-4", 
                                        selectedColor === "rose" ? "text-rose-900" :
                                        selectedColor === "emerald" ? "text-emerald-900" :
                                        selectedColor === "amber" ? "text-amber-900" :
                                        selectedColor === "indigo" ? "text-indigo-900" : "text-neutral-700"
                                    )}>Live Preview Environment</h1>
                                    <p className="max-w-md mx-auto text-neutral-500">This window previews <b>{quickViewTheme?.id}</b> precisely as a guest would see it, matching your live data and styles.</p>
                                </div>
                                <div className={cn("w-full h-32 rounded-t-[3rem] opacity-50",
                                    selectedColor === "rose" ? "bg-rose-400" :
                                    selectedColor === "emerald" ? "bg-emerald-400" :
                                    selectedColor === "amber" ? "bg-amber-400" :
                                    selectedColor === "indigo" ? "bg-indigo-400" : "bg-neutral-300"
                                )} />
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Premium Gating Mockup Modal */}
            <Dialog open={showPremiumModal} onOpenChange={setShowPremiumModal}>
                <DialogContent className="max-w-md p-8 rounded-[2rem] bg-gradient-to-br from-neutral-900 to-black text-white border border-neutral-800 shadow-2xl">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37] to-yellow-200 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                            <Crown className="w-8 h-8 text-black" />
                        </div>
                        <DialogTitle className="text-2xl font-black mb-2 text-[#D4AF37]">Premium Exclusive</DialogTitle>
                        <DialogDescription className="text-neutral-400 mb-8 leading-relaxed">
                            Ce thème spectaculaire fait partie de notre collection Premium. Passez à Farah Premium pour débloquer tous les thèmes, obtenir un domaine personnalisé (ex: <i>sarah-yassine.com</i>), et suivre vos invités en temps réel !
                        </DialogDescription>
                        
                        <div className="w-full space-y-3">
                            <Button className="w-full bg-[#D4AF37] hover:bg-yellow-500 text-black font-black py-6 rounded-2xl text-lg transition-transform active:scale-95 shadow-xl shadow-yellow-500/20">
                                Upgrade to Premium
                            </Button>
                            <Button 
                                variant="ghost" 
                                onClick={() => setShowPremiumModal(false)}
                                className="w-full text-neutral-400 hover:text-white hover:bg-white/5 py-4 rounded-xl"
                            >
                                Explorer les thèmes gratuits
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </PlanningLayout>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale || "fr", ["common"])),
        },
    };
};
