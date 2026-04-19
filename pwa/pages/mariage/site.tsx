import { useTranslation } from "next-i18next";
import Head from "next/head";
import PlanningLayout from "../../components/layout/PlanningLayout";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import type { HydraCollection } from "@/types/api";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Heart, Camera, BookOpen, HelpCircle, MapPin, Palette, Globe, Plus, Trash2, ExternalLink, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";

interface WeddingProfile {
    id: number;
    brideName: string;
    groomName: string;
    weddingDate: string;
    weddingCity: string;
    venueName: string;
    venueAddress: string;
    coverImage: string;
    ourStory: string;
    qa: { question: string; answer: string }[];
    travelInfo: string;
    selectedTheme: string;
    galleryImages: string[];
    slug: string;
}

export default function WeddingWebsiteBuilder() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("general");
    
    const { data: profileData, isLoading } = useQuery<HydraCollection<WeddingProfile>>({
        queryKey: ["weddingProfile"],
        queryFn: () => apiClient.get<HydraCollection<WeddingProfile>>("/api/wedding_profiles?itemsPerPage=1"),
    });

    const initialProfile: WeddingProfile | null = profileData?.["hydra:member"]?.[0] ?? null;
    const [formData, setFormData] = useState<Partial<WeddingProfile>>({});

    useEffect(() => {
        if (initialProfile) {
            setFormData({
                ...initialProfile,
                qa: initialProfile.qa || [],
                galleryImages: initialProfile.galleryImages || []
            });
        }
    }, [initialProfile]);

    const mutation = useMutation({
        mutationFn: (data: Partial<WeddingProfile>) => 
            apiClient.patch(`/api/wedding_profiles/${initialProfile?.id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["weddingProfile"] });
            alert(t("website.save_success"));
        },
    });

    const handleSave = () => {
        mutation.mutate(formData);
    };

    const addQA = () => {
        const currentQA = formData.qa || [];
        setFormData({ ...formData, qa: [...currentQA, { question: "", answer: "" }] });
    };

    const removeQA = (index: number) => {
        const currentQA = [...(formData.qa || [])];
        currentQA.splice(index, 1);
        setFormData({ ...formData, qa: currentQA });
    };

    const updateQA = (index: number, field: "question" | "answer", value: string) => {
        const currentQA = [...(formData.qa || [])];
        currentQA[index][field] = value;
        setFormData({ ...formData, qa: currentQA });
    };

    const themes = [
        { id: "modern", name: t("website.themes.modern"), color: "bg-neutral-900" },
        { id: "romantic", name: t("website.themes.romantic"), color: "bg-primary/20" },
        { id: "classic", name: t("website.themes.classic"), color: "bg-blue-900" },
        { id: "dark", name: t("website.themes.dark"), color: "bg-black" }
    ];

    if (isLoading) return <div className="p-20 text-center">{t("common.loading")}</div>;

    return (
        <PlanningLayout
            title={t("website.title")}
            description={t("website.edit_title")}
        >
            <Head>
                <title>{t("website.title")} — Farah.ma</title>
            </Head>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column: Editor */}
                <div className="flex-1 space-y-8">
                    <div className="bg-white rounded-[2.5rem] border border-neutral-200 overflow-hidden shadow-sm">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="w-full justify-start h-auto bg-neutral-50/50 p-2 gap-2 border-b border-neutral-100 rounded-none overflow-x-auto overflow-y-hidden">
                                <TabsTrigger value="general" className="rounded-2xl px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-black uppercase tracking-widest">
                                    <Globe className="w-4 h-4 me-2" /> {t("website.tabs.general")}
                                </TabsTrigger>
                                <TabsTrigger value="story" className="rounded-2xl px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-black uppercase tracking-widest">
                                    <BookOpen className="w-4 h-4 me-2" /> {t("website.tabs.story")}
                                </TabsTrigger>
                                <TabsTrigger value="qa" className="rounded-2xl px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-black uppercase tracking-widest">
                                    <HelpCircle className="w-4 h-4 me-2" /> {t("website.tabs.qa")}
                                </TabsTrigger>
                                <TabsTrigger value="gallery" className="rounded-2xl px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-black uppercase tracking-widest">
                                    <Camera className="w-4 h-4 me-2" /> {t("website.tabs.gallery")}
                                </TabsTrigger>
                                <TabsTrigger value="theme" className="rounded-2xl px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-black uppercase tracking-widest">
                                    <Palette className="w-4 h-4 me-2" /> {t("website.tabs.theme")}
                                </TabsTrigger>
                            </TabsList>

                            <div className="p-10">
                                <AnimatePresence mode="wait">
                                    {/* General Tab */}
                                    <TabsContent value="general" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t("onboarding.fields.bride_name")}</Label>
                                                <Input 
                                                    value={formData.brideName || ""} 
                                                    onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                                                    className="rounded-2xl py-6"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t("onboarding.fields.groom_name")}</Label>
                                                <Input 
                                                    value={formData.groomName || ""} 
                                                    onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                                                    className="rounded-2xl py-6"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t("onboarding.couple.wedding_date")}</Label>
                                                <Input 
                                                    type="date"
                                                    value={formData.weddingDate ? formData.weddingDate.split('T')[0] : ""} 
                                                    onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                                                    className="rounded-2xl py-6"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t("onboarding.couple.wedding_city")}</Label>
                                                <Input 
                                                    value={formData.weddingCity || ""} 
                                                    onChange={(e) => setFormData({ ...formData, weddingCity: e.target.value })}
                                                    className="rounded-2xl py-6"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t("dashboard.event.venue_info")}</Label>
                                            <Input 
                                                value={formData.venueName || ""} 
                                                onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                                                placeholder="ex: Palais des Roses"
                                                className="rounded-2xl py-6"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t("website.fields.site_url")}</Label>
                                            <div className="flex items-center gap-2 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                                                <span className="text-neutral-400 text-sm font-medium">farah.ma/e/</span>
                                                <Input 
                                                    value={formData.slug || ""} 
                                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                    className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 font-bold text-neutral-900"
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* Story Tab */}
                                    <TabsContent value="story" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t("website.fields.our_story_label")}</Label>
                                            <p className="text-xs text-neutral-400 mb-4">{t("website.fields.our_story_hint")}</p>
                                            <Textarea 
                                                value={formData.ourStory || ""} 
                                                onChange={(e) => setFormData({ ...formData, ourStory: e.target.value })}
                                                placeholder={t("dashboard.event.our_story_placeholder")}
                                                className="min-h-[300px] rounded-3xl p-6 leading-relaxed"
                                            />
                                        </div>
                                    </TabsContent>

                                    {/* Q&A Tab */}
                                    <TabsContent value="qa" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="space-y-6">
                                            {formData.qa?.map((item, idx) => (
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    key={idx} 
                                                    className="p-6 bg-neutral-50 rounded-[2rem] border border-neutral-100 space-y-4 relative group"
                                                >
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        onClick={() => removeQA(idx)}
                                                        className="absolute top-4 end-4 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-full"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                    <div className="space-y-1">
                                                        <Label className="text-[10px] font-black uppercase text-neutral-400 ms-1">{t("website.fields.qa_question")}</Label>
                                                        <Input 
                                                            value={item.question} 
                                                            onChange={(e) => updateQA(idx, "question", e.target.value)}
                                                            className="bg-white rounded-xl"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-[10px] font-black uppercase text-neutral-400 ms-1">{t("website.fields.qa_answer")}</Label>
                                                        <Textarea 
                                                            value={item.answer} 
                                                            onChange={(e) => updateQA(idx, "answer", e.target.value)}
                                                            className="bg-white rounded-xl"
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}
                                            <Button 
                                                onClick={addQA}
                                                variant="outline"
                                                className="w-full py-8 border-2 border-dashed border-neutral-200 rounded-[2rem] text-neutral-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all font-bold"
                                            >
                                                <Plus className="w-5 h-5 me-2" /> {t("website.fields.add_qa")}
                                            </Button>
                                        </div>
                                    </TabsContent>

                                    {/* Gallery Tab */}
                                    <TabsContent value="gallery" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t("onboarding.fields.cover_image")}</Label>
                                            <Input 
                                                value={formData.coverImage || ""} 
                                                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                                                placeholder="https://images.unsplash.com/..."
                                                className="rounded-2xl py-6"
                                            />
                                            {formData.coverImage && (
                                                <div className="relative aspect-video rounded-3xl overflow-hidden mt-4 border border-neutral-100">
                                                    <img src={formData.coverImage} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    {/* Theme Tab */}
                                    <TabsContent value="theme" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10 flex flex-col md:flex-row items-center gap-8">
                                            <div className="flex-1 text-center md:text-start">
                                                <h3 className="text-2xl font-black mb-2">{t("website.templates_gallery.current_theme")} : {formData.selectedTheme ? t(`website.themes.${formData.selectedTheme}`) : t("website.themes.modern")}</h3>
                                                <p className="text-neutral-500 mb-6 text-sm leading-relaxed">
                                                    {t("website.templates_gallery.page_subtitle")}
                                                </p>
                                                <button 
                                                    onClick={() => router.push("/mariage/templates")}
                                                    className="bg-neutral-900 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-black/10 hover:bg-black hover:scale-105 transition-all text-sm w-full md:w-auto"
                                                >
                                                    {t("website.templates_gallery.explore_more")}
                                                </button>
                                            </div>
                                            <div className="w-full md:w-1/3 aspect-[4/5] bg-white rounded-2xl border-4 border-white shadow-xl overflow-hidden relative">
                                                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                                <div className="absolute inset-0 flex flex-col items-center justify-end p-6 z-20 text-center">
                                                    <span className="text-white font-bold text-lg mb-1">{formData.brideName || 'Yassine'} & {formData.groomName || 'Salma'}</span>
                                                    <span className="text-white/80 text-[10px] uppercase tracking-widest">Save the date</span>
                                                </div>
                                                <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
                                                    <Palette className="w-8 h-8 text-neutral-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </AnimatePresence>
                            </div>
                        </Tabs>

                        <div className="p-10 bg-neutral-50/50 border-t border-neutral-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-neutral-400 italic text-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                {mutation.isPending ? t("common.loading") : t("website.status.auto_saved")}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Mini Preview & Quick Info (Airbnb Mockup Style) */}
                <div className="lg:w-[400px] space-y-6">
                    <div className="bg-white border text-neutral-900 overflow-hidden rounded-[2rem] sticky top-8 shadow-2xl shadow-neutral-200/50 flex flex-col">
                        {/* Mock Browser Header */}
                        <div className="bg-neutral-50 px-4 py-3 flex items-center justify-between border-b border-neutral-100">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="bg-white rounded-full px-4 py-1 text-[10px] text-neutral-400 font-medium flex items-center gap-1 border border-neutral-200">
                                farah.ma/e/<span className="text-neutral-900 font-bold">{formData.slug || 'slug'}</span>
                            </div>
                            <div className="w-10" />
                        </div>
                        
                        {/* Mock Content */}
                        <div className="relative h-48 bg-neutral-100">
                            {formData.coverImage ? (
                                <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                                    <Camera className="w-8 h-8 text-primary/30" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 start-4 end-4 flex justify-between items-end">
                                <div>
                                    <p className="text-white text-[10px] uppercase tracking-widest font-bold mb-1 opacity-80">{t("event.save_the_date")}</p>
                                    <p className="text-white font-serif text-2xl leading-none">
                                        {formData.brideName || 'Bride'} &amp; {formData.groomName || 'Groom'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <h4 className="font-bold text-lg mb-2">{t("website.status.preview_label")}</h4>
                            <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
                                Visualisez votre site tel que vos invités le verront. Partagez ensuite le lien sur WhatsApp ou sur vos faire-part.
                            </p>
                            
                            <a 
                                href={`/e/${formData.slug || initialProfile?.slug}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-[0.98]"
                            >
                                {t("website.preview_btn")}
                                <ExternalLink className="w-4 h-4" />
                            </a>

                            <div className="mt-6 pt-6 border-t border-neutral-100">
                                <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                    <div className="mt-1 text-primary">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-primary text-xs font-black uppercase tracking-widest mb-1">{t("website.status.pro_tip")}</p>
                                        <p className="text-sm italic leading-relaxed text-primary/80">
                                            &ldquo;{t("website.status.pro_tip_content")}&rdquo;
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
