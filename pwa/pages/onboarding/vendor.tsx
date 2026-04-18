import Head from "next/head";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
    X, ChevronLeft, ChevronRight, Check, Clock, Camera,
    MessageSquare, BarChart2, Upload, ImagePlus, Lightbulb,
    Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useAuth } from "../../context/AuthContext";
import apiClient, { ApiError } from "../../utils/apiClient";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category { id: number; name: string; slug: string; emoji: string | null; }
interface City     { id: number; name: string; slug: string; }

interface WizardValues {
    businessName:    string;
    tagline:         string;
    category:        string;
    description:     string;
    cities:          string[];
    whatsapp:        string;
    website:         string;
    instagram:       string;
    priceRange:      string;
    startingPrice:   string;
    languagesSpoken: string[];
    coverImageUrl:   string;
    galleryImages:   string[];
    coverFile:       File | null;
    coverPreview:    string | null;
    galleryFiles:    (File | null)[];
    galleryPreviews: (string | null)[];
}

// ─── Stage / Screen map ───────────────────────────────────────────────────────
// stage 0 = welcome
// stage 1 = Votre activité  (screens 0,1,2)
// stage 2 = Où et comment   (screens 0,1,2)
// stage 3 = Votre vitrine   (screens 0,1)
// stage 4 = review + submit (screen 0)

const STAGE_SCREEN_COUNTS = [1, 3, 3, 2, 1]; // screens per stage (stage 0 = welcome)
const TOTAL_CONTENT_SCREENS = 9; // stages 1-4

// ─── Stage images (one per content stage) ────────────────────────────────────

const STAGE_IMAGES = [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80", // stage 1
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80", // stage 2
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80", // stage 3
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80", // stage 4
];

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_VALUES: WizardValues = {
    businessName: "", tagline: "", category: "",
    description: "", cities: [], whatsapp: "", website: "", instagram: "",
    priceRange: "MADMAD", startingPrice: "",
    languagesSpoken: ["ary", "fr"],
    coverImageUrl: "", galleryImages: ["", "", "", "", "", ""],
    coverFile: null, coverPreview: null,
    galleryFiles: [null, null, null, null, null, null],
    galleryPreviews: [null, null, null, null, null, null],
};

const PRICE_OPTIONS = [
    { value: "MAD",        labelKey: "budget",    symbols: 1, descKey: "budget_desc" },
    { value: "MADMAD",     labelKey: "standard",  symbols: 2, descKey: "standard_desc" },
    { value: "MADMADMAD",  labelKey: "premium",   symbols: 3, descKey: "premium_desc" },
    { value: "MADMADMAD+", labelKey: "exclusif",  symbols: 4, descKey: "exclusif_desc" },
];

const LANGUAGES = [
    { value: "ary", label: "Darija (دارجة)" },
    { value: "fr",  label: "Français" },
    { value: "ar",  label: "Arabe classique (العربية)" },
    { value: "en",  label: "English" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function flatScreenIndex(stage: number, screen: number): number {
    let idx = 0;
    for (let s = 1; s < stage; s++) idx += STAGE_SCREEN_COUNTS[s];
    return idx + screen + 1; // 1-based
}

function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
    });
}

function buildPayload(values: WizardValues) {
    return {
        businessName:    values.businessName,
        ...(values.tagline       && { tagline:       values.tagline }),
        category:        values.category,
        description:     values.description,
        cities:          values.cities,
        whatsapp:        values.whatsapp,
        ...(values.website       && { website:       values.website }),
        ...(values.instagram     && { instagram:     values.instagram }),
        priceRange:      values.priceRange,
        ...(values.startingPrice && { startingPrice: parseInt(values.startingPrice, 10) }),
        languagesSpoken: values.languagesSpoken,
        ...(values.coverImageUrl && { coverImageUrl:  values.coverImageUrl }),
        galleryImages:   values.galleryImages.filter(Boolean),
    };
}

// ─── Validation per screen ────────────────────────────────────────────────────

function validateScreen(
    stage: number,
    screen: number,
    values: WizardValues,
    t: (key: string) => string,
): Record<string, string> {
    const errors: Record<string, string> = {};
    if (stage === 1 && screen === 0 && !values.category)
        errors.category = t("onboarding.errors.category_required");
    if (stage === 1 && screen === 1 && !values.businessName.trim())
        errors.businessName = t("onboarding.errors.business_name_required");
    if (stage === 1 && screen === 2) {
        if (!values.description.trim())
            errors.description = t("onboarding.errors.description_required");
        else if (values.description.trim().length < 50)
            errors.description = t("onboarding.errors.description_min");
    }
    if (stage === 2 && screen === 0 && values.cities.length === 0)
        errors.cities = t("onboarding.errors.cities_required");
    if (stage === 2 && screen === 1 && !values.priceRange)
        errors.priceRange = t("onboarding.errors.price_required");
    if (stage === 2 && screen === 2 && !values.whatsapp.trim())
        errors.whatsapp = t("onboarding.errors.whatsapp_required");
    return errors;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScreenHeading({ question, sub }: { question: string; sub?: string }) {
    return (
        <div className="mb-8">
            <h1 className="font-display text-[32px] leading-tight text-[#1A1A1A] mb-2">
                {question}
            </h1>
            {sub && <p className="text-[15px] text-[#717171] leading-relaxed">{sub}</p>}
        </div>
    );
}

function FieldError({ msg }: { msg?: string }) {
    if (!msg) return null;
    return <p className="text-[12px] text-red-500 font-medium mt-1">{msg}</p>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VendorOnboardingPage() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { user, isLoading: authLoading, refreshUser } = useAuth();

    // navigation state
    const [stage, setStage]   = useState(0); // 0 = welcome
    const [screen, setScreen] = useState(0);

    // form values
    const [values, setValues] = useState<WizardValues>(INITIAL_VALUES);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showTagline, setShowTagline] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [autosaved, setAutosaved] = useState(false);

    // cover drop zone
    const coverInputRef = useRef<HTMLInputElement>(null);
    const [coverDragOver, setCoverDragOver] = useState(false);

    // auth guard
    useEffect(() => {
        if (authLoading) return;
        if (!user) router.replace("/auth/login?next=/onboarding/vendor");
        else if (user.userType !== "vendor") router.replace("/");
    }, [user, authLoading, router]);

    // autosave indicator
    const triggerAutosave = useCallback(() => {
        setAutosaved(true);
        const t = setTimeout(() => setAutosaved(false), 2500);
        return () => clearTimeout(t);
    }, []);

    // remote data
    const { data: categoriesData } = useQuery({
        queryKey: ["categories"],
        queryFn:  () => apiClient.get("/api/categories?itemsPerPage=50"),
        enabled:  !!user,
    });
    const { data: citiesData } = useQuery({
        queryKey: ["cities"],
        queryFn:  () => apiClient.get("/api/cities?itemsPerPage=100"),
        enabled:  !!user,
    });

    const categories: Category[] = categoriesData?.["hydra:member"] ?? [];
    const cities:     City[]     = citiesData?.["hydra:member"] ?? [];

    // submit mutation
    const mutation = useMutation({
        mutationFn: (payload: ReturnType<typeof buildPayload>) =>
            apiClient.post("/api/vendor_profiles", payload),
        onSuccess: async () => {
            await refreshUser();
            router.push("/dashboard/vendor");
        },
        onError: (err: unknown) => {
            const msg = err instanceof ApiError ? err.message : null;
            setSubmitError(msg || t("onboarding.errors.submit_failed"));
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
        const preview = await readFileAsDataURL(file);
        setValues((prev) => ({ ...prev, coverFile: file, coverPreview: preview }));
        triggerAutosave();
    }

    async function handleGalleryFile(index: number, file: File) {
        const preview = await readFileAsDataURL(file);
        setValues((prev) => {
            const files    = [...prev.galleryFiles];
            const previews = [...prev.galleryPreviews];
            files[index]    = file;
            previews[index] = preview;
            return { ...prev, galleryFiles: files, galleryPreviews: previews };
        });
        triggerAutosave();
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
        const errs = validateScreen(stage, screen, values, t);
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});
        const maxScreen = STAGE_SCREEN_COUNTS[stage] - 1;
        if (screen < maxScreen) { setScreen((s) => s + 1); }
        else if (stage < 4) { setStage((s) => s + 1); setScreen(0); }
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function goBack() {
        if (stage === 0) return;
        if (screen > 0) { setScreen((s) => s - 1); }
        else if (stage > 1) { setStage((s) => s - 1); setScreen(STAGE_SCREEN_COUNTS[stage - 1] - 1); }
        else { setStage(0); }
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleSkip() {
        goNext();
    }

    function handleSubmit() {
        setSubmitError(null);
        mutation.mutate(buildPayload(values));
    }

    // ── Loading / redirect guard ───────────────────────────────────────────────
    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-10 h-10 rounded-full border-4 border-[#E8472A] border-t-transparent animate-spin" />
            </div>
        );
    }

    const isLastScreen = stage === 4 && screen === 0;
    const currentFlatScreen = stage > 0 ? flatScreenIndex(stage, screen) : 0;
    const stageImage = STAGE_IMAGES[Math.max(0, stage - 1)];

    // ─────────────────────────────────────────────────────────────────────────
    // WELCOME SCREEN
    // ─────────────────────────────────────────────────────────────────────────
    if (stage === 0) {
        return (
            <>
                <Head><title>{t("onboarding.vendor.welcome_title")} — Farah.ma</title></Head>
                <div className="min-h-screen flex flex-col lg:flex-row">
                    {/* Left pane */}
                    <div
                        className="hidden lg:block lg:w-1/2 relative bg-cover bg-center"
                        style={{ backgroundImage: `url(${STAGE_IMAGES[0]})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/30 flex flex-col justify-end p-12">
                            <p className="font-display text-white text-4xl leading-snug mb-2">
                                Farah.ma
                            </p>
                            <p className="text-white/80 text-lg">{t("onboarding.vendor.welcome_sub")}</p>
                        </div>
                    </div>

                    {/* Right pane */}
                    <div className="flex-1 flex flex-col items-center justify-center px-6 py-14 lg:px-16">
                        <div className="w-full max-w-md">
                            <div className="flex justify-end mb-8">
                                <button
                                    type="button"
                                    onClick={() => router.push("/")}
                                    aria-label={t("auth.back_home")}
                                    className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
                                >
                                    <X className="w-5 h-5 text-[#717171]" />
                                </button>
                            </div>

                            <p className="text-[13px] font-semibold text-[#E8472A] uppercase tracking-widest mb-3">
                                Farah.ma
                            </p>
                            <h1 className="font-display text-[38px] leading-tight text-[#1A1A1A] mb-2">
                                {t("onboarding.vendor.welcome_title")}
                            </h1>
                            <p className="text-[16px] text-[#717171] mb-8">
                                {t("onboarding.vendor.welcome_sub")}
                            </p>

                            <div className="space-y-3 mb-10">
                                {[
                                    { icon: Store,         label: t("onboarding.vendor.welcome_bullet_1") },
                                    { icon: MessageSquare, label: t("onboarding.vendor.welcome_bullet_2") },
                                    { icon: BarChart2,     label: t("onboarding.vendor.welcome_bullet_3") },
                                ].map(({ icon: Icon, label }, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-[#FEF0ED] flex items-center justify-center shrink-0">
                                            <Icon className="w-4 h-4 text-[#E8472A]" />
                                        </div>
                                        <span className="text-[14px] text-[#1A1A1A] font-medium">{label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 text-[12px] text-[#717171] mb-8">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{t("onboarding.vendor.welcome_time")}</span>
                            </div>

                            <Button
                                onClick={goNext}
                                className="w-full h-[52px] text-[15px] font-semibold rounded-2xl"
                            >
                                {t("onboarding.vendor.start")}
                            </Button>
                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    onClick={() => router.push("/dashboard/vendor")}
                                    className="text-[13px] text-[#717171] hover:text-neutral-900 underline underline-offset-2 transition-colors"
                                >
                                    {t("onboarding.vendor.skip")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // MAIN WIZARD SHELL (stages 1–4)
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <>
            <Head><title>{t("onboarding.title")} — Farah.ma</title></Head>

            {/* Exit confirmation drawer */}
            {showExitConfirm && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowExitConfirm(false)} />
                    <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-sm p-8 mx-4 shadow-3 animate-in slide-in-from-bottom-4 duration-300">
                        <h3 className="font-display text-[22px] text-[#1A1A1A] mb-2">
                            {t("onboarding.exit_confirm_title")}
                        </h3>
                        <p className="text-[14px] text-[#717171] mb-6">{t("onboarding.exit_confirm_body")}</p>
                        <div className="flex flex-col gap-3">
                            <Button variant="ghost" onClick={() => router.push("/")} className="w-full h-12 border border-neutral-200 rounded-2xl text-[#1A1A1A]">
                                {t("onboarding.exit_confirm_cta")}
                            </Button>
                            <Button onClick={() => setShowExitConfirm(false)} className="w-full h-12 rounded-2xl">
                                {t("onboarding.exit_cancel")}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="min-h-screen flex flex-col lg:flex-row">
                {/* Left image pane */}
                <div
                    className="hidden lg:block lg:w-[42%] xl:w-[38%] relative bg-cover bg-center transition-all duration-700"
                    style={{ backgroundImage: `url(${stageImage})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-black/55 to-black/25" />
                    {/* Stage label on image */}
                    <div className="absolute bottom-12 start-10 end-10">
                        <p className="text-white/60 text-[12px] font-semibold uppercase tracking-widest mb-1">
                            {t(`onboarding.stage_${stage}_label`)}
                        </p>
                        <p className="text-white font-display text-[28px] leading-snug">
                            {stage === 1 && t("onboarding.fields.category_question")}
                            {stage === 2 && t("onboarding.fields.cities_question")}
                            {stage === 3 && t("onboarding.fields.cover_question")}
                            {stage === 4 && t("onboarding.fields.review_question")}
                        </p>
                    </div>
                </div>

                {/* Right content pane */}
                <div className="flex-1 flex flex-col">
                    {/* Top bar */}
                    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-neutral-100">
                        <div className="max-w-2xl mx-auto px-6 h-[60px] flex items-center justify-between gap-4">
                            {/* Exit X */}
                            <button
                                type="button"
                                onClick={() => setShowExitConfirm(true)}
                                aria-label={t("auth.back_home")}
                                className="p-2 -ms-2 rounded-full hover:bg-neutral-100 transition-colors shrink-0"
                            >
                                <X className="w-5 h-5 text-[#717171]" />
                            </button>

                            {/* Stage progress dots */}
                            <div className="flex-1 flex items-center justify-center gap-3">
                                {[1, 2, 3, 4].map((s) => (
                                    <div key={s} className="flex items-center gap-2">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full transition-all duration-300",
                                            s < stage  ? "bg-[#E8472A] scale-100" :
                                            s === stage ? "bg-[#E8472A] scale-125 ring-4 ring-[#E8472A]/20" :
                                                          "bg-neutral-200"
                                        )} />
                                        {s < 4 && <div className={cn(
                                            "w-8 h-px transition-colors duration-500",
                                            s < stage ? "bg-[#E8472A]" : "bg-neutral-200"
                                        )} />}
                                    </div>
                                ))}
                            </div>

                            {/* Autosave + screen count */}
                            <div className="shrink-0 flex items-center gap-2">
                                {autosaved && (
                                    <span className="text-[11px] text-green-600 font-medium animate-in fade-in duration-300 hidden sm:block">
                                        {t("onboarding.autosaved")}
                                    </span>
                                )}
                                <span className="text-[12px] text-[#B0B0B0] font-medium">
                                    {currentFlatScreen}/{TOTAL_CONTENT_SCREENS}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Screen content */}
                    <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-10 lg:py-16">
                        <div className="animate-in fade-in slide-in-from-bottom-3 duration-400" key={`${stage}-${screen}`}>
                            {renderScreen()}
                        </div>
                    </div>

                    {/* Bottom navigation bar */}
                    <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-neutral-100">
                        <div className="max-w-2xl mx-auto px-6 h-[72px] flex items-center justify-between gap-4">
                            <Button
                                variant="ghost"
                                onClick={goBack}
                                className="h-12 px-5 rounded-2xl text-[14px] font-semibold text-[#484848] hover:bg-neutral-100"
                            >
                                <ChevronLeft className="w-4 h-4 me-1 rtl:rotate-180" />
                                {t("onboarding.nav.back")}
                            </Button>

                            {isLastScreen ? (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={mutation.isPending}
                                    loading={mutation.isPending}
                                    className="h-12 px-8 rounded-2xl text-[14px] font-semibold bg-[#E8472A] hover:bg-[#C43A20]"
                                >
                                    {mutation.isPending
                                        ? t("onboarding.nav.submitting")
                                        : t("onboarding.nav.submit")}
                                </Button>
                            ) : (
                                <Button
                                    onClick={goNext}
                                    className="h-12 px-8 rounded-2xl text-[14px] font-semibold bg-[#1A1A1A] hover:bg-[#2A2A2A]"
                                >
                                    {t("onboarding.nav.next")}
                                    <ChevronRight className="w-4 h-4 ms-1 rtl:rotate-180" />
                                </Button>
                            )}
                        </div>

                        {/* Skip link — only on optional screens */}
                        {(stage === 3 || (stage === 1 && screen === 1)) && (
                            <div className="text-center pb-3 -mt-1">
                                <button
                                    type="button"
                                    onClick={handleSkip}
                                    className="text-[12px] text-[#B0B0B0] hover:text-neutral-700 underline underline-offset-2 transition-colors"
                                >
                                    {t("onboarding.skip")}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );

    // ─────────────────────────────────────────────────────────────────────────
    // SCREEN RENDERER
    // ─────────────────────────────────────────────────────────────────────────
    function renderScreen() {
        // Stage 1 — Votre activité
        if (stage === 1 && screen === 0) return <Screen11_Category />;
        if (stage === 1 && screen === 1) return <Screen12_BusinessName />;
        if (stage === 1 && screen === 2) return <Screen13_Description />;
        // Stage 2 — Où et comment
        if (stage === 2 && screen === 0) return <Screen21_Cities />;
        if (stage === 2 && screen === 1) return <Screen22_PriceRange />;
        if (stage === 2 && screen === 2) return <Screen23_Contact />;
        // Stage 3 — Votre vitrine
        if (stage === 3 && screen === 0) return <Screen31_CoverPhoto />;
        if (stage === 3 && screen === 1) return <Screen32_Gallery />;
        // Stage 4 — Review
        if (stage === 4 && screen === 0) return <Screen4_Review />;
        return null;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SCREEN 1.1 — Category
    // ─────────────────────────────────────────────────────────────────────────
    function Screen11_Category() {
        return (
            <>
                <ScreenHeading
                    question={t("onboarding.fields.category_question")}
                    sub={t("onboarding.fields.category_sub")}
                />
                {categories.length === 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-28 rounded-2xl bg-neutral-100 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {categories.map((cat) => {
                            const iri = `/api/categories/${cat.id}`;
                            const selected = values.category === iri;
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => set("category", iri)}
                                    className={cn(
                                        "relative flex flex-col items-center justify-center gap-2 p-4 h-28 rounded-2xl border-2 text-center transition-all duration-200",
                                        selected
                                            ? "border-[#E8472A] bg-[#FEF0ED] shadow-md"
                                            : "border-[#EBEBEB] bg-white hover:border-[#E8472A]/40 hover:shadow-sm"
                                    )}
                                    aria-pressed={selected}
                                >
                                    {selected && (
                                        <span className="absolute top-2 end-2 w-5 h-5 rounded-full bg-[#E8472A] flex items-center justify-center">
                                            <Check className="w-3 h-3 text-white" />
                                        </span>
                                    )}
                                    <span className="text-2xl">{cat.emoji || "🎉"}</span>
                                    <span className="text-[13px] font-semibold text-[#1A1A1A] leading-tight">
                                        {cat.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
                <FieldError msg={errors.category} />
            </>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SCREEN 1.2 — Business name
    // ─────────────────────────────────────────────────────────────────────────
    function Screen12_BusinessName() {
        return (
            <>
                <ScreenHeading
                    question={t("onboarding.fields.business_name_question")}
                    sub={t("onboarding.fields.business_name_sub")}
                />
                <div className="space-y-4">
                    <div>
                        <Input
                            id="businessName"
                            value={values.businessName}
                            onChange={(e) => set("businessName", e.target.value)}
                            placeholder={t("onboarding.fields.business_name_placeholder")}
                            className={cn(
                                "h-14 text-[16px] border-2 rounded-2xl px-4",
                                errors.businessName ? "border-red-400 ring-4 ring-red-400/20" : "border-[#EBEBEB] focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10"
                            )}
                            autoFocus
                        />
                        <FieldError msg={errors.businessName} />
                    </div>

                    {/* Optional tagline toggle */}
                    {!showTagline ? (
                        <button
                            type="button"
                            onClick={() => setShowTagline(true)}
                            className="text-[13px] text-[#717171] hover:text-[#E8472A] underline underline-offset-2 transition-colors"
                        >
                            + {t("onboarding.fields.tagline_toggle")}
                        </button>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <Label className="text-[13px] font-semibold text-[#1A1A1A] mb-1.5 block">
                                {t("onboarding.fields.tagline")}
                            </Label>
                            <Input
                                id="tagline"
                                value={values.tagline}
                                onChange={(e) => set("tagline", e.target.value)}
                                placeholder={t("onboarding.fields.tagline_placeholder")}
                                className="h-12 text-[15px] border-2 border-[#EBEBEB] focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10 rounded-2xl px-4"
                            />
                        </div>
                    )}
                </div>
            </>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SCREEN 1.3 — Description
    // ─────────────────────────────────────────────────────────────────────────
    function Screen13_Description() {
        const charCount = values.description.trim().length;
        const isOk = charCount >= 50;
        return (
            <>
                <ScreenHeading
                    question={t("onboarding.fields.description_question")}
                    sub={t("onboarding.fields.description_sub")}
                />

                {/* Tip card */}
                <div className="flex gap-3 p-4 bg-[#FEF0ED] rounded-2xl mb-6">
                    <Lightbulb className="w-4 h-4 text-[#E8472A] shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[12px] font-bold text-[#E8472A] mb-0.5">{t("onboarding.fields.description_tip_title")}</p>
                        <p className="text-[13px] text-[#484848]">{t("onboarding.fields.description_tip")}</p>
                    </div>
                </div>

                <div>
                    <textarea
                        id="description"
                        rows={6}
                        value={values.description}
                        onChange={(e) => set("description", e.target.value)}
                        placeholder={t("onboarding.fields.description_placeholder")}
                        className={cn(
                            "w-full text-[15px] border-2 rounded-2xl p-4 resize-none transition-all duration-150 outline-none leading-relaxed",
                            errors.description
                                ? "border-red-400 ring-4 ring-red-400/20"
                                : "border-[#EBEBEB] focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10"
                        )}
                        autoFocus
                    />
                    <div className="flex items-center justify-between mt-1.5">
                        <FieldError msg={errors.description} />
                        <span className={cn(
                            "text-[12px] font-medium ms-auto",
                            isOk ? "text-green-600" : "text-[#B0B0B0]"
                        )}>
                            {charCount} {!isOk && `/ 50`}
                        </span>
                    </div>
                </div>
            </>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SCREEN 2.1 — Cities
    // ─────────────────────────────────────────────────────────────────────────
    function Screen21_Cities() {
        return (
            <>
                <ScreenHeading
                    question={t("onboarding.fields.cities_question")}
                    sub={t("onboarding.fields.cities_sub")}
                />
                <div className="flex flex-wrap gap-2">
                    {cities.map((city) => {
                        const iri = `/api/cities/${city.id}`;
                        const selected = values.cities.includes(iri);
                        return (
                            <button
                                key={city.id}
                                type="button"
                                onClick={() =>
                                    set(
                                        "cities",
                                        selected
                                            ? values.cities.filter((c) => c !== iri)
                                            : [...values.cities, iri]
                                    )
                                }
                                className={cn(
                                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-[14px] font-semibold border-2 transition-all duration-150",
                                    selected
                                        ? "border-[#E8472A] bg-[#FEF0ED] text-[#E8472A]"
                                        : "border-[#EBEBEB] bg-white text-[#484848] hover:border-[#E8472A]/40"
                                )}
                                aria-pressed={selected}
                            >
                                {selected && <Check className="w-3 h-3" />}
                                {city.name}
                            </button>
                        );
                    })}
                </div>
                <FieldError msg={errors.cities} />
            </>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SCREEN 2.2 — Price range
    // ─────────────────────────────────────────────────────────────────────────
    function Screen22_PriceRange() {
        return (
            <>
                <ScreenHeading
                    question={t("onboarding.fields.price_range_question")}
                    sub={t("onboarding.fields.price_range_sub")}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {PRICE_OPTIONS.map((opt) => {
                        const selected = values.priceRange === opt.value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => set("priceRange", opt.value)}
                                className={cn(
                                    "relative flex flex-col gap-2 p-5 rounded-2xl border-2 text-start transition-all duration-200",
                                    selected
                                        ? "border-[#E8472A] bg-[#FEF0ED] shadow-md shadow-[#E8472A]/10"
                                        : "border-[#EBEBEB] bg-white hover:scale-[1.01] hover:shadow-sm"
                                )}
                                aria-pressed={selected}
                            >
                                {selected && (
                                    <span className="absolute top-3 end-3 w-5 h-5 rounded-full bg-[#E8472A] flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </span>
                                )}
                                <span className="text-[20px] font-bold text-[#E8472A]">
                                    {"د".repeat(opt.symbols)}
                                </span>
                                <span className="text-[14px] font-bold text-[#1A1A1A] capitalize">
                                    {t(`vendor_profile.price_${opt.labelKey}`)}
                                </span>
                            </button>
                        );
                    })}
                </div>
                <FieldError msg={errors.priceRange} />

                {/* Optional starting price */}
                <div className="mt-6">
                    <Label className="text-[13px] font-semibold text-[#1A1A1A] mb-1.5 block">
                        {t("onboarding.fields.starting_price")}
                    </Label>
                    <div className="relative">
                        <Input
                            type="number"
                            min="0"
                            value={values.startingPrice}
                            onChange={(e) => set("startingPrice", e.target.value)}
                            placeholder="ex. 5000"
                            className="h-12 text-[15px] border-2 border-[#EBEBEB] focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10 rounded-2xl pe-16"
                        />
                        <span className="absolute end-4 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-[#B0B0B0]">
                            MAD
                        </span>
                    </div>
                </div>
            </>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SCREEN 2.3 — Contact
    // ─────────────────────────────────────────────────────────────────────────
    function Screen23_Contact() {
        return (
            <>
                <ScreenHeading
                    question={t("onboarding.fields.contact_question")}
                    sub={t("onboarding.fields.contact_sub")}
                />
                <div className="space-y-4">
                    {/* WhatsApp — required */}
                    <div>
                        <Label className="text-[13px] font-semibold text-[#1A1A1A] mb-1.5 block">
                            {t("onboarding.fields.whatsapp")} <span className="text-[#E8472A]">*</span>
                        </Label>
                        <div className="relative">
                            <span className="absolute start-4 top-1/2 -translate-y-1/2 text-[20px]">💬</span>
                            <Input
                                type="tel"
                                value={values.whatsapp}
                                onChange={(e) => set("whatsapp", e.target.value)}
                                placeholder={t("onboarding.fields.whatsapp_placeholder")}
                                className={cn(
                                    "h-14 text-[15px] border-2 rounded-2xl ps-12",
                                    errors.whatsapp ? "border-red-400 ring-4 ring-red-400/20" : "border-[#EBEBEB] focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10"
                                )}
                                autoFocus
                            />
                        </div>
                        <FieldError msg={errors.whatsapp} />
                    </div>

                    {/* Website — optional */}
                    <div>
                        <Label className="text-[13px] font-semibold text-[#1A1A1A] mb-1.5 block">
                            {t("onboarding.fields.website")}
                        </Label>
                        <Input
                            type="url"
                            value={values.website}
                            onChange={(e) => set("website", e.target.value)}
                            placeholder={t("onboarding.fields.website_placeholder")}
                            className="h-12 text-[15px] border-2 border-[#EBEBEB] focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10 rounded-2xl"
                        />
                    </div>

                    {/* Instagram — optional */}
                    <div>
                        <Label className="text-[13px] font-semibold text-[#1A1A1A] mb-1.5 block">
                            {t("onboarding.fields.instagram")}
                        </Label>
                        <div className="relative">
                            <span className="absolute start-4 top-1/2 -translate-y-1/2 text-[15px] font-bold text-[#B0B0B0]">@</span>
                            <Input
                                type="text"
                                value={values.instagram}
                                onChange={(e) => set("instagram", e.target.value)}
                                placeholder={t("onboarding.fields.instagram_placeholder").replace("@", "")}
                                className="h-12 text-[15px] border-2 border-[#EBEBEB] focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10 rounded-2xl ps-10"
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SCREEN 3.1 — Cover photo
    // ─────────────────────────────────────────────────────────────────────────
    function Screen31_CoverPhoto() {
        const hasCover = !!values.coverPreview;
        return (
            <>
                <ScreenHeading
                    question={t("onboarding.fields.cover_question")}
                    sub={t("onboarding.fields.cover_sub")}
                />

                <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    aria-label={t("onboarding.fields.cover_browse")}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleCoverFile(file);
                    }}
                />

                {!hasCover ? (
                    /* Drop zone */
                    <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setCoverDragOver(true); }}
                        onDragLeave={() => setCoverDragOver(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setCoverDragOver(false);
                            const file = e.dataTransfer.files[0];
                            if (file && file.type.startsWith("image/")) handleCoverFile(file);
                        }}
                        className={cn(
                            "w-full h-52 flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed transition-all duration-200",
                            coverDragOver
                                ? "border-[#E8472A] bg-[#FEF0ED]"
                                : "border-[#D4D4D4] bg-neutral-50 hover:border-[#E8472A]/60 hover:bg-[#FEF0ED]/40"
                        )}
                    >
                        <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center">
                            <Upload className="w-5 h-5 text-[#717171]" />
                        </div>
                        <div className="text-center">
                            <p className="text-[14px] font-semibold text-[#1A1A1A]">
                                {t("onboarding.fields.cover_drop")}
                            </p>
                            <p className="text-[12px] text-[#717171] mt-0.5">
                                {t("onboarding.fields.cover_drop_or")}{" "}
                                <span className="text-[#E8472A] underline">
                                    {t("onboarding.fields.cover_browse")}
                                </span>
                            </p>
                            <p className="text-[11px] text-[#B0B0B0] mt-1">{t("onboarding.fields.cover_formats")}</p>
                        </div>
                    </button>
                ) : (
                    /* Preview */
                    <div className="relative rounded-3xl overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={values.coverPreview!}
                            alt={t("onboarding.fields.cover_selected")}
                            className="w-full h-56 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-end p-4">
                            <button
                                type="button"
                                onClick={() => coverInputRef.current?.click()}
                                className="bg-white text-[#1A1A1A] text-[13px] font-semibold px-4 py-2 rounded-xl hover:bg-neutral-100 transition-colors flex items-center gap-2"
                            >
                                <Camera className="w-4 h-4" />
                                {t("onboarding.fields.cover_change")}
                            </button>
                        </div>
                    </div>
                )}
            </>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SCREEN 3.2 — Gallery
    // ─────────────────────────────────────────────────────────────────────────
    function Screen32_Gallery() {
        return (
            <>
                <ScreenHeading
                    question={t("onboarding.fields.gallery_question")}
                    sub={t("onboarding.fields.gallery_sub")}
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[0, 1, 2, 3, 4, 5].map((i) => {
                        const preview = values.galleryPreviews[i];
                        return (
                            <div key={i} className="relative aspect-square">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="sr-only"
                                    id={`gallery-slot-${i}`}
                                    aria-label={t("onboarding.fields.gallery_slot_label", { n: i + 1 })}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleGalleryFile(i, file);
                                    }}
                                />
                                {preview ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={preview}
                                            alt={t("onboarding.fields.gallery_slot_label", { n: i + 1 })}
                                            className="w-full h-full object-cover rounded-2xl"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeGallerySlot(i)}
                                            aria-label="Remove photo"
                                            className="absolute top-2 end-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5 text-white" />
                                        </button>
                                    </>
                                ) : (
                                    <label
                                        htmlFor={`gallery-slot-${i}`}
                                        className="w-full h-full flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-[#D4D4D4] bg-neutral-50 hover:border-[#E8472A]/60 hover:bg-[#FEF0ED]/40 cursor-pointer transition-all duration-150"
                                    >
                                        <ImagePlus className="w-5 h-5 text-[#B0B0B0]" />
                                        <span className="text-[11px] text-[#B0B0B0] font-medium">
                                            {t("onboarding.fields.gallery_slot_empty")}
                                        </span>
                                    </label>
                                )}
                            </div>
                        );
                    })}
                </div>
            </>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SCREEN 4 — Review & submit
    // ─────────────────────────────────────────────────────────────────────────
    function Screen4_Review() {
        const selectedCategory = categories.find(
            (c) => `/api/categories/${c.id}` === values.category
        );
        const selectedCityNames = values.cities
            .map((iri) => {
                const id = parseInt(iri.split("/").pop() ?? "0", 10);
                return cities.find((c) => c.id === id)?.name ?? "";
            })
            .filter(Boolean)
            .join(", ");

        const priceSymbols = PRICE_OPTIONS.find((o) => o.value === values.priceRange)?.symbols ?? 2;

        return (
            <>
                <ScreenHeading
                    question={t("onboarding.fields.review_question")}
                    sub={t("onboarding.fields.review_sub")}
                />

                {submitError && (
                    <div className="mb-6 p-4 bg-[#FEECEC] border border-[#C13030]/20 rounded-2xl text-[14px] text-[#C13030]">
                        {submitError}
                    </div>
                )}

                {/* Mini profile card preview */}
                <div className="rounded-3xl border-2 border-[#EBEBEB] overflow-hidden mb-8">
                    {values.coverPreview && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={values.coverPreview} alt="" className="w-full h-40 object-cover" />
                    )}
                    <div className="p-5">
                        <p className="font-display text-[22px] text-[#1A1A1A]">
                            {values.businessName || "—"}
                        </p>
                        {selectedCategory && (
                            <p className="text-[13px] text-[#717171] mt-0.5">{selectedCategory.emoji} {selectedCategory.name}</p>
                        )}
                        {selectedCityNames && (
                            <p className="text-[12px] text-[#B0B0B0] mt-1">📍 {selectedCityNames}</p>
                        )}
                        <p className="text-[14px] font-bold text-[#E8472A] mt-2">{"د".repeat(priceSymbols)}</p>
                    </div>
                </div>

                {/* Review rows */}
                <div className="space-y-0 divide-y divide-[#F7F7F7]">
                    <ReviewRow label={t("onboarding.fields.business_name")} value={values.businessName} onEdit={() => { setStage(1); setScreen(1); }} />
                    <ReviewRow label={t("onboarding.fields.description")} value={values.description.slice(0, 80) + (values.description.length > 80 ? "…" : "")} onEdit={() => { setStage(1); setScreen(2); }} />
                    <ReviewRow label={t("onboarding.fields.cities")} value={selectedCityNames} onEdit={() => { setStage(2); setScreen(0); }} />
                    <ReviewRow label={t("onboarding.fields.price_range")} value={"د".repeat(priceSymbols)} onEdit={() => { setStage(2); setScreen(1); }} />
                    <ReviewRow label={t("onboarding.fields.whatsapp")} value={values.whatsapp} onEdit={() => { setStage(2); setScreen(2); }} />
                </div>

                {/* Languages */}
                <div className="mt-6">
                    <Label className="text-[13px] font-semibold text-[#1A1A1A] mb-3 block">
                        {t("onboarding.fields.languages_label")}
                    </Label>
                    <div className="flex flex-wrap gap-2">
                        {LANGUAGES.map((lang) => {
                            const selected = values.languagesSpoken.includes(lang.value);
                            return (
                                <button
                                    key={lang.value}
                                    type="button"
                                    onClick={() =>
                                        set(
                                            "languagesSpoken",
                                            selected
                                                ? values.languagesSpoken.filter((l) => l !== lang.value)
                                                : [...values.languagesSpoken, lang.value]
                                        )
                                    }
                                    className={cn(
                                        "flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold border-2 transition-all duration-150",
                                        selected
                                            ? "border-[#E8472A] bg-[#FEF0ED] text-[#E8472A]"
                                            : "border-[#EBEBEB] bg-white text-[#484848] hover:border-[#E8472A]/40"
                                    )}
                                >
                                    {selected && <Check className="w-3 h-3" />}
                                    {lang.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    }

    function ReviewRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
        return (
            <div className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#B0B0B0]">{label}</p>
                    <p className="text-[14px] text-[#1A1A1A] mt-0.5 break-words">{value || "—"}</p>
                </div>
                <button
                    type="button"
                    onClick={onEdit}
                    className="text-[12px] text-[#717171] hover:text-[#E8472A] underline underline-offset-2 shrink-0 transition-colors"
                >
                    {t("onboarding.preview.edit")}
                </button>
            </div>
        );
    }
}

// ─── SSR ──────────────────────────────────────────────────────────────────────

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale ?? "fr", ["common"])),
    },
});
