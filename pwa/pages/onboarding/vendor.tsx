import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
    X, ChevronLeft, ChevronRight, Clock, MessageSquare, BarChart2, Store,
} from "lucide-react";
import type { HydraCollection } from "@/types/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import apiClient, { ApiError } from "@/utils/apiClient";
import { PATHS } from "@/constants/paths";
import type { VendorProfilePayload } from "@/types/api";
import { Button } from "@/components/ui/button";

// Modular Components & Types
import { WizardValues, INITIAL_VALUES, Category, City } from "@/components/onboarding/vendor/WizardTypes";
import OnboardingHeader from "@/components/onboarding/vendor/OnboardingHeader";
import StepActivity from "@/components/onboarding/vendor/StepActivity";
import StepLocation from "@/components/onboarding/vendor/StepLocation";
import StepVisuals from "@/components/onboarding/vendor/StepVisuals";
import StepReview from "@/components/onboarding/vendor/StepReview";

const STAGE_SCREEN_COUNTS = [1, 3, 3, 2, 1]; // screens per stage (stage 0 = welcome)
const TOTAL_CONTENT_SCREENS = 9; 

const STAGE_IMAGES = [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80", 
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80",
];

export default function VendorOnboardingPage() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { user, isLoading: authLoading, refreshUser } = useAuth();

    // Navigation state
    const [stage, setStage]   = useState(0); 
    const [screen, setScreen] = useState(0);

    // Form state
    const [values, setValues] = useState<WizardValues>(INITIAL_VALUES);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showTagline, setShowTagline] = useState(false);
    const [autosaved, setAutosaved] = useState(false);

    // Auth guard
    useEffect(() => {
        if (authLoading) return;
        if (!user) router.replace(`${PATHS.AUTH_LOGIN}?next=${PATHS.ONBOARDING_VENDOR}`);
        else if (user.userType !== "vendor") router.replace(PATHS.HOME);
    }, [user, authLoading, router]);

    const triggerAutosave = useCallback(() => {
        setAutosaved(true);
        const timeout = setTimeout(() => setAutosaved(false), 2500);
        return () => clearTimeout(timeout);
    }, []);

    // Remote data
    const { data: categoriesData } = useQuery<HydraCollection<Category>>({
        queryKey: ["categories"],
        queryFn:  () => apiClient.get<HydraCollection<Category>>("/api/categories?itemsPerPage=50"),
        enabled:  !!user,
    });
    const { data: citiesData } = useQuery<HydraCollection<City>>({
        queryKey: ["cities"],
        queryFn:  () => apiClient.get<HydraCollection<City>>("/api/cities?itemsPerPage=100"),
        enabled:  !!user,
    });

    const categories: Category[] = categoriesData?.["hydra:member"] ?? [];
    const cities:     City[]     = citiesData?.["hydra:member"] ?? [];

    const mutation = useMutation({
        mutationFn: (payload: VendorProfilePayload) => apiClient.post("/api/vendor_profiles", payload),
        onSuccess: async () => {
            await refreshUser();
            router.push("/dashboard/vendor");
        },
    });

    // ── Value updater ──────────────────────────────────────────────────────────
    function set<K extends keyof WizardValues>(key: K, val: WizardValues[K]) {
        setValues((prev) => ({ ...prev, [key]: val }));
        setErrors((prev) => { const n = { ...prev }; delete n[key as string]; return n; });
        triggerAutosave();
    }

    // ── File upload helpers ────────────────────────────────────────────────────
    async function handleCoverFile(file: File) {
        const reader = new FileReader();
        reader.onload = (e) => {
            setValues((prev) => ({ ...prev, coverFile: file, coverPreview: e.target?.result as string }));
            triggerAutosave();
        };
        reader.readAsDataURL(file);
    }

    async function handleGalleryFile(index: number, file: File) {
        const reader = new FileReader();
        reader.onload = (e) => {
            setValues((prev) => {
                const files    = [...prev.galleryFiles];
                const previews = [...prev.galleryPreviews];
                files[index]    = file;
                previews[index] = e.target?.result as string;
                return { ...prev, galleryFiles: files, galleryPreviews: previews };
            });
            triggerAutosave();
        };
        reader.readAsDataURL(file);
    }

    function removeGallerySlot(index: number) {
        setValues((prev) => {
            const files    = [...prev.galleryFiles];
            const previews = [...prev.galleryPreviews];
            files[index]    = null;
            previews[index] = null;
            return { ...prev, galleryFiles: files, galleryPreviews: previews };
        });
    }

    // ── Navigation ────────────────────────────────────────────────────────────
    function goNext() {
        if (stage === 0) { setStage(1); setScreen(0); return; }
        
        // Simple validation logic
        const errs: Record<string, string> = {};
        if (stage === 1 && screen === 0 && !values.category) errs.category = t("onboarding.errors.category_required");
        if (stage === 1 && screen === 1 && !values.businessName.trim()) errs.businessName = t("onboarding.errors.business_name_required");
        if (stage === 2 && screen === 0 && values.cities.length === 0) errs.cities = t("onboarding.errors.cities_required");
        if (stage === 2 && screen === 2 && !values.whatsapp.trim()) errs.whatsapp = t("onboarding.errors.whatsapp_required");

        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        
        const maxScreen = STAGE_SCREEN_COUNTS[stage] - 1;
        if (screen < maxScreen) setScreen((s) => s + 1);
        else if (stage < 4) { setStage((s) => s + 1); setScreen(0); }
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function goBack() {
        if (stage === 0) return;
        if (screen > 0) setScreen((s) => s - 1);
        else if (stage > 1) { setStage((s) => s - 1); setScreen(STAGE_SCREEN_COUNTS[stage - 1] - 1); }
        else setStage(0);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleSubmit() {
        const payload = {
            businessName: values.businessName,
            tagline: values.tagline,
            category: values.category,
            description: values.description,
            cities: values.cities,
            whatsapp: values.whatsapp,
            website: values.website,
            priceRange: values.priceRange,
            startingPrice: values.startingPrice ? parseInt(values.startingPrice, 10) : undefined,
            galleryImages: values.galleryImages.filter(Boolean),
        };
        mutation.mutate(payload);
    }

    if (authLoading || !user) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-10 h-10 border-4 border-[#E8472A] border-t-transparent animate-spin rounded-full" /></div>;

    if (stage === 0) {
        return (
            <div className="min-h-screen flex flex-col lg:flex-row">
                <div className="hidden lg:block lg:w-1/2 relative bg-cover bg-center" style={{ backgroundImage: `url(${STAGE_IMAGES[0]})` }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/30 flex flex-col justify-end p-12">
                        <p className="font-display text-white text-4xl leading-snug mb-2">Farah.ma</p>
                        <p className="text-white/80 text-lg">{t("onboarding.vendor.welcome_sub")}</p>
                    </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center px-6 py-14 lg:px-16">
                    <div className="w-full max-w-md">
                        <h1 className="font-display text-[38px] leading-tight text-[#1A1A1A] mb-2">{t("onboarding.vendor.welcome_title")}</h1>
                        <p className="text-[16px] text-[#717171] mb-8">{t("onboarding.vendor.welcome_sub")}</p>
                        <div className="space-y-3 mb-10">
                            {[Store, MessageSquare, BarChart2].map((Icon, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#FEF0ED] flex items-center justify-center"><Icon className="w-4 h-4 text-[#E8472A]" /></div>
                                    <span className="text-[14px] text-[#1A1A1A] font-medium">{t(`onboarding.vendor.welcome_bullet_${i+1}`)}</span>
                                </div>
                            ))}
                        </div>
                        <Button onClick={goNext} className="w-full h-[52px] text-[15px] font-semibold rounded-2xl">{t("onboarding.vendor.start")}</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">
            <Head><title>{t("onboarding.title")} — Farah.ma</title></Head>

            <div className="hidden lg:block lg:w-[42%] xl:w-[38%] relative bg-cover bg-center transition-all duration-700" style={{ backgroundImage: `url(${STAGE_IMAGES[Math.max(0, stage - 1)]})` }}>
                <div className="absolute inset-0 bg-gradient-to-br from-black/55 to-black/25" />
                <div className="absolute bottom-12 start-10 end-10">
                    <p className="text-white/60 text-[12px] font-semibold uppercase tracking-widest mb-1">{t(`onboarding.stage_${stage}_label`)}</p>
                    <p className="text-white font-display text-[28px] leading-snug">
                        {stage === 1 && t("onboarding.fields.category_question")}
                        {stage === 2 && t("onboarding.fields.cities_question")}
                        {stage === 3 && t("onboarding.fields.cover_question")}
                        {stage === 4 && t("onboarding.fields.review_question")}
                    </p>
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                <OnboardingHeader stage={stage} currentFlatScreen={stage > 0 ? (stage-1)*3 + screen + 1 : 0} totalScreens={TOTAL_CONTENT_SCREENS} autosaved={autosaved} />

                <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10 lg:py-16">
                    <div className="animate-in fade-in slide-in-from-bottom-3 duration-400" key={`${stage}-${screen}`}>
                        {stage === 1 && <StepActivity screen={screen} values={values} errors={errors} categories={categories} set={set} showTagline={showTagline} setShowTagline={setShowTagline} />}
                        {stage === 2 && <StepLocation screen={screen} values={values} errors={errors} cities={cities} set={set} />}
                        {stage === 3 && <StepVisuals screen={screen} values={values} handleCoverFile={handleCoverFile} handleGalleryFile={handleGalleryFile} removeGallerySlot={removeGallerySlot} />}
                        {stage === 4 && <StepReview values={values} cities={cities} categories={categories} setStage={setStage} setScreen={setScreen} />}
                    </div>
                </main>

                <footer className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-neutral-100">
                    <div className="max-w-2xl mx-auto px-6 h-[72px] flex items-center justify-between gap-4">
                        <Button variant="ghost" onClick={goBack} className="h-12 px-5 rounded-2xl text-[14px] font-semibold text-[#484848]"><ChevronLeft className="w-4 h-4 me-1 rtl:rotate-180" />{t("onboarding.nav.back")}</Button>
                        {stage === 4 ? (
                            <Button onClick={handleSubmit} disabled={mutation.isPending} className="h-12 px-8 rounded-2xl text-[14px] font-semibold bg-[#E8472A] text-white">
                                {mutation.isPending ? t("onboarding.nav.submitting") : t("onboarding.nav.submit")}
                            </Button>
                        ) : (
                            <Button onClick={goNext} className="h-12 px-8 rounded-2xl text-[14px] font-semibold bg-[#1A1A1A] text-white">
                                {t("onboarding.nav.next")}<ChevronRight className="w-4 h-4 ms-1 rtl:rotate-180" />
                            </Button>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
    props: { ...(await serverSideTranslations(locale || "fr", ["common"])) },
});
