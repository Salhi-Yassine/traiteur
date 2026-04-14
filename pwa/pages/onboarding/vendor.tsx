import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { useFormik } from "formik";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Check, ChevronLeft, ChevronRight, Building2, MapPin, Briefcase, Camera, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
    category:        string;   // IRI e.g. "/api/categories/3"
    description:     string;
    cities:          string[]; // IRIs e.g. ["/api/cities/1"]
    whatsapp:        string;
    website:         string;
    instagram:       string;
    priceRange:      string;
    startingPrice:   string;
    languagesSpoken: string[];
    coverImageUrl:   string;
    galleryImages:   string[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 5;

const INITIAL_VALUES: WizardValues = {
    businessName: "", tagline: "", category: "",
    description: "", cities: [], whatsapp: "", website: "", instagram: "",
    priceRange: "MADMAD", startingPrice: "",
    languagesSpoken: ["ary", "fr"],
    coverImageUrl: "", galleryImages: ["", "", "", "", "", ""],
};

const STEP_ICONS = [Building2, MapPin, Briefcase, Camera, Eye];

const STEP_IMAGES = [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80", // Step 0: Basic
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&q=80", // Step 1: Area
    "https://images.unsplash.com/photo-1555244162-803834f70033?w=1920&q=80", // Step 2: Pricing
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1920&q=80", // Step 3: Photos
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1920&q=80"  // Step 4: Preview
];

const PRICE_OPTIONS = [
    { value: "MAD",        labelKey: "budget",   symbols: 1 },
    { value: "MADMAD",     labelKey: "standard",  symbols: 2 },
    { value: "MADMADMAD",  labelKey: "premium",   symbols: 3 },
    { value: "MADMADMAD+", labelKey: "exclusif",  symbols: 4 },
];

const LANGUAGES = [
    { value: "ary", label: "Darija (دارجة)" },
    { value: "fr",  label: "Français" },
    { value: "ar",  label: "Arabe classique (العربية)" },
    { value: "en",  label: "English" },
];

// ─── Per-step validation ──────────────────────────────────────────────────────

function validateStep(
    step: number,
    values: WizardValues,
    t: (key: string) => string,
): Record<string, string> {
    const errors: Record<string, string> = {};
    if (step === 0) {
        if (!values.businessName.trim()) errors.businessName = t("onboarding.errors.business_name_required");
        if (!values.category)            errors.category     = t("onboarding.errors.category_required");
    }
    if (step === 1) {
        if (!values.description.trim())       errors.description = t("onboarding.errors.description_required");
        else if (values.description.trim().length < 50) errors.description = t("onboarding.errors.description_min");
        if (values.cities.length === 0)       errors.cities      = t("onboarding.errors.cities_required");
        if (!values.whatsapp.trim())          errors.whatsapp    = t("onboarding.errors.whatsapp_required");
    }
    if (step === 2) {
        if (!values.priceRange) errors.priceRange = t("onboarding.errors.price_required");
    }
    return errors;
}

// ─── Submit payload builder ───────────────────────────────────────────────────

function buildPayload(values: WizardValues) {
    return {
        businessName:    values.businessName,
        ...(values.tagline        && { tagline:       values.tagline }),
        category:        values.category,
        description:     values.description,
        cities:          values.cities,
        whatsapp:        values.whatsapp,
        ...(values.website        && { website:       values.website }),
        ...(values.instagram      && { instagram:     values.instagram }),
        priceRange:      values.priceRange,
        ...(values.startingPrice  && { startingPrice: parseInt(values.startingPrice, 10) }),
        languagesSpoken: values.languagesSpoken,
        ...(values.coverImageUrl  && { coverImageUrl:  values.coverImageUrl }),
        galleryImages:   values.galleryImages.filter(Boolean),
    };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VendorOnboardingPage() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // ── Auth guard ─────────────────────────────────────────────────────────────
    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.replace("/auth/login?next=/onboarding/vendor");
        } else if (user.userType !== "vendor") {
            router.replace("/");
        }
    }, [user, authLoading, router]);

    // ── Remote data ────────────────────────────────────────────────────────────
    const { data: categoriesData } = useQuery({
        queryKey: ["categories"],
        queryFn: () => apiClient.get("/api/categories?itemsPerPage=50"),
        enabled: !!user,
    });
    const { data: citiesData } = useQuery({
        queryKey: ["cities"],
        queryFn: () => apiClient.get("/api/cities?itemsPerPage=100"),
        enabled: !!user,
    });

    const categories: Category[] = categoriesData?.["hydra:member"] ?? [];
    const cities: City[]         = citiesData?.["hydra:member"] ?? [];

    // ── Mutation ───────────────────────────────────────────────────────────────
    const createProfile = useMutation({
        mutationFn: (payload: ReturnType<typeof buildPayload>) =>
            apiClient.post("/api/vendor_profiles", payload),
        onSuccess: (data) => {
            router.push(`/vendors/${data.slug}`);
        },
        onError: (err: unknown) => {
            const message = err instanceof ApiError
                ? err.message
                : t("onboarding.errors.submit_failed");
            setSubmitError(message);
        },
    });

    // ── Formik ─────────────────────────────────────────────────────────────────
    const formik = useFormik<WizardValues>({
        initialValues: INITIAL_VALUES,
        validateOnChange: false,
        validateOnBlur: true,
        onSubmit: (values) => {
            setSubmitError(null);
            createProfile.mutate(buildPayload(values));
        },
    });

    // ── Navigation ─────────────────────────────────────────────────────────────
    const handleNext = async () => {
        const errors = validateStep(currentStep, formik.values, t);
        if (Object.keys(errors).length > 0) {
            formik.setErrors(errors);
            const touched = Object.keys(errors).reduce<Record<string, boolean>>(
                (acc, k) => ({ ...acc, [k]: true }), {}
            );
            formik.setTouched(touched, false);
            return;
        }
        setCurrentStep((s) => s + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleBack = () => {
        setCurrentStep((s) => s - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ── Loading / guard ────────────────────────────────────────────────────────
    if (authLoading || !user || user.userType !== "vendor") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-10 h-10 border-4 border-[#E8472A] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // ── Step content ───────────────────────────────────────────────────────────
    const renderStep = () => {
        switch (currentStep) {

            // Step 0 — Infos essentielles
            case 0: return (
                <div className="space-y-6">
                    <Field
                        label={t("onboarding.fields.business_name")}
                        error={formik.touched.businessName ? formik.errors.businessName : undefined}
                        required
                    >
                        <Input
                            id="businessName"
                            name="businessName"
                            placeholder={t("onboarding.fields.business_name_placeholder")}
                            value={formik.values.businessName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={cn(
                                "h-14 text-[16px] rounded-xl border-2 transition-all focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10",
                                formik.touched.businessName && formik.errors.businessName ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : "border-[#EBEBEB]"
                            )}
                        />
                    </Field>

                    <Field
                        label={t("onboarding.fields.tagline")}
                        error={undefined}
                    >
                        <Input
                            id="tagline"
                            name="tagline"
                            placeholder={t("onboarding.fields.tagline_placeholder")}
                            value={formik.values.tagline}
                            onChange={formik.handleChange}
                            className="h-14 text-[16px] rounded-xl border-2 border-[#EBEBEB] transition-all focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10"
                        />
                    </Field>

                    <Field
                        label={t("onboarding.fields.category")}
                        error={formik.touched.category ? formik.errors.category : undefined}
                        required
                    >
                        <select
                            id="category"
                            name="category"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={cn(
                                "w-full h-14 rounded-xl border-2 bg-white px-4 text-[16px] text-[#1A1A1A] focus:outline-none focus:ring-4 focus:ring-[#E8472A]/10 focus:border-[#E8472A] transition-all",
                                formik.touched.category && formik.errors.category
                                    ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                                    : "border-[#EBEBEB]"
                            )}
                        >
                            <option value="">{t("onboarding.fields.category_placeholder")}</option>
                            {categories.map((c) => (
                                <option key={c.id} value={`/api/categories/${c.id}`}>
                                    {c.emoji ? `${c.emoji} ` : ""}{c.name}
                                </option>
                            ))}
                        </select>
                    </Field>
                </div>
            );

            // Step 1 — Zone & contact
            case 1: return (
                <div className="space-y-6">
                    <Field
                        label={t("onboarding.fields.description")}
                        error={formik.touched.description ? formik.errors.description : undefined}
                        hint={t("onboarding.fields.description_hint")}
                        required
                    >
                        <div className="relative">
                            <textarea
                                id="description"
                                name="description"
                                rows={5}
                                placeholder={t("onboarding.fields.description_placeholder")}
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={cn(
                                    "w-full rounded-xl border-2 bg-white px-4 py-4 text-[16px] text-[#1A1A1A] resize-none focus:outline-none focus:ring-4 focus:ring-[#E8472A]/10 focus:border-[#E8472A] transition-all",
                                    formik.touched.description && formik.errors.description
                                        ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                                        : "border-[#EBEBEB]"
                                )}
                            />
                            <span className="absolute bottom-2.5 end-3 text-[11px] text-[#B0B0B0]">
                                {formik.values.description.length}/50+
                            </span>
                        </div>
                    </Field>

                    <Field
                        label={t("onboarding.fields.cities")}
                        error={formik.touched.cities ? formik.errors.cities as string : undefined}
                        required
                    >
                        <div className="flex flex-wrap gap-2">
                            {cities.map((city) => {
                                const iri = `/api/cities/${city.id}`;
                                const selected = formik.values.cities.includes(iri);
                                return (
                                    <button
                                        key={city.id}
                                        type="button"
                                        onClick={() => {
                                            const next = selected
                                                ? formik.values.cities.filter((c) => c !== iri)
                                                : [...formik.values.cities, iri];
                                            formik.setFieldValue("cities", next);
                                            formik.setFieldTouched("cities", true, false);
                                        }}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full text-[13px] font-medium border transition-all duration-150",
                                            selected
                                                ? "bg-[#E8472A] text-white border-[#E8472A]"
                                                : "bg-white text-[#484848] border-[#DDDDDD] hover:border-[#E8472A]"
                                        )}
                                    >
                                        {selected && <Check className="inline w-3 h-3 me-1 -mt-0.5" />}
                                        {city.name}
                                    </button>
                                );
                            })}
                        </div>
                    </Field>

                    <Field
                        label={t("onboarding.fields.whatsapp")}
                        error={formik.touched.whatsapp ? formik.errors.whatsapp : undefined}
                        required
                    >
                        <Input
                            id="whatsapp"
                            name="whatsapp"
                            type="tel"
                            placeholder={t("onboarding.fields.whatsapp_placeholder")}
                            value={formik.values.whatsapp}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={cn(
                                "h-14 text-[16px] rounded-xl border-2 transition-all focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10",
                                formik.touched.whatsapp && formik.errors.whatsapp ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : "border-[#EBEBEB]"
                            )}
                        />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label={t("onboarding.fields.website")}>
                            <Input
                                id="website"
                                name="website"
                                type="url"
                                placeholder={t("onboarding.fields.website_placeholder")}
                                value={formik.values.website}
                                onChange={formik.handleChange}
                                className="h-14 text-[16px] rounded-xl border-2 border-[#EBEBEB] transition-all focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10"
                            />
                        </Field>
                        <Field label={t("onboarding.fields.instagram")}>
                            <Input
                                id="instagram"
                                name="instagram"
                                placeholder={t("onboarding.fields.instagram_placeholder")}
                                value={formik.values.instagram}
                                onChange={formik.handleChange}
                                className="h-14 text-[16px] rounded-xl border-2 border-[#EBEBEB] transition-all focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10"
                            />
                        </Field>
                    </div>
                </div>
            );

            // Step 2 — Services & tarifs
            case 2: return (
                <div className="space-y-8">
                    <Field
                        label={t("onboarding.fields.price_range")}
                        error={formik.touched.priceRange ? formik.errors.priceRange : undefined}
                        required
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {PRICE_OPTIONS.map(({ value, labelKey, symbols }) => {
                                const selected = formik.values.priceRange === value;
                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => formik.setFieldValue("priceRange", value)}
                                        className={cn(
                                            "relative flex flex-col items-start p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-start",
                                            selected
                                                ? "border-[#E8472A] bg-[#FEF0ED] shadow-md shadow-[#E8472A]/10"
                                                : "border-[#EBEBEB] bg-white hover:border-[#D0D0D0] shadow-sm"
                                        )}
                                    >
                                        {selected && (
                                            <span className="absolute top-3 end-3 w-5 h-5 rounded-full bg-[#E8472A] flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </span>
                                        )}
                                        <span className="text-[16px] font-semibold tracking-wider mb-1">
                                            {Array.from({ length: 4 }).map((_, i) => (
                                                <span key={i} className={cn(
                                                    "transition-colors",
                                                    i < symbols
                                                        ? selected ? "text-[#E8472A]" : "text-[#1A1A1A]"
                                                        : "text-[#DDDDDD]"
                                                )}>د</span>
                                            ))}
                                        </span>
                                        <span className={cn("text-[14px] font-medium", selected ? "text-[#E8472A]" : "text-[#1A1A1A]")}>
                                            {t(`filters.price_labels.${labelKey}`)}
                                        </span>
                                        <span className="text-[12px] text-[#717171] mt-0.5">
                                            {t(`filters.price_desc_labels.${labelKey}`, "")}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </Field>

                    <Field label={t("onboarding.fields.starting_price")}>
                        <div className="relative">
                            <Input
                                id="startingPrice"
                                name="startingPrice"
                                type="number"
                                min={0}
                                placeholder="ex. 15000"
                                value={formik.values.startingPrice}
                                onChange={formik.handleChange}
                                className="h-14 text-[16px] rounded-xl border-2 border-[#EBEBEB] focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10 pe-16 transition-all"
                            />
                            <span className="absolute inset-y-0 end-3 flex items-center text-[13px] text-[#717171] pointer-events-none">
                                MAD
                            </span>
                        </div>
                    </Field>

                    <Field label={t("onboarding.fields.languages")}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {LANGUAGES.map(({ value, label }) => {
                                const checked = formik.values.languagesSpoken.includes(value);
                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => {
                                            const next = checked
                                                ? formik.values.languagesSpoken.filter((l) => l !== value)
                                                : [...formik.values.languagesSpoken, value];
                                            formik.setFieldValue("languagesSpoken", next);
                                        }}
                                        className={cn(
                                            "flex items-center gap-4 px-6 py-5 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-start shadow-sm",
                                            checked
                                                ? "border-[#E8472A] bg-[#FEF0ED] text-[#E8472A] shadow-md shadow-[#E8472A]/10"
                                                : "border-[#EBEBEB] bg-white text-[#484848] hover:border-[#D0D0D0]"
                                        )}
                                    >
                                        <span className={cn(
                                            "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                                            checked ? "bg-[#E8472A] border-[#E8472A]" : "border-[#DDDDDD] bg-white"
                                        )}>
                                            {checked && <Check className="w-3.5 h-3.5 text-white" />}
                                        </span>
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </Field>
                </div>
            );

            // Step 3 — Photos
            case 3: return (
                <div className="space-y-6">
                    <Field
                        label={t("onboarding.fields.cover_image")}
                        hint={t("onboarding.fields.cover_image_hint")}
                    >
                        <Input
                            id="coverImageUrl"
                            name="coverImageUrl"
                            type="url"
                            placeholder={t("onboarding.fields.cover_image_placeholder")}
                            value={formik.values.coverImageUrl}
                            onChange={formik.handleChange}
                            className="h-14 text-[16px] rounded-xl border-2 border-[#EBEBEB] transition-all focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10"
                        />
                        {formik.values.coverImageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={formik.values.coverImageUrl}
                                alt="Aperçu"
                                className="mt-3 w-full h-40 object-cover rounded-xl border border-[#EBEBEB]"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                        )}
                    </Field>

                    <Field
                        label={t("onboarding.fields.gallery")}
                        hint={t("onboarding.fields.gallery_hint")}
                    >
                        <div className="space-y-3">
                            {formik.values.galleryImages.map((url, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-[12px] text-[#B0B0B0] w-5 text-end shrink-0">{i + 1}</span>
                                    <Input
                                        type="url"
                                        placeholder={`https://…`}
                                        value={url}
                                        onChange={(e) => {
                                            const next = [...formik.values.galleryImages];
                                            next[i] = e.target.value;
                                            formik.setFieldValue("galleryImages", next);
                                        }}
                                        className="h-12 flex-1 text-[14px] rounded-xl border-2 border-[#EBEBEB] transition-all focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10"
                                    />
                                </div>
                            ))}
                        </div>
                    </Field>
                </div>
            );

            // Step 4 — Aperçu
            case 4: {
                const selectedCategory = categories.find(
                    (c) => `/api/categories/${c.id}` === formik.values.category
                );
                const selectedCities = cities.filter(
                    (c) => formik.values.cities.includes(`/api/cities/${c.id}`)
                );
                return (
                    <div className="space-y-5">
                        <p className="text-[14px] text-[#717171]">{t("onboarding.preview.subtitle")}</p>

                        {submitError && (
                            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-medium">
                                {submitError}
                            </div>
                        )}

                        <div className="space-y-4">
                            <PreviewRow label={t("onboarding.fields.business_name")} value={formik.values.businessName} onEdit={() => setCurrentStep(0)} t={t} />
                            {formik.values.tagline && <PreviewRow label={t("onboarding.fields.tagline")} value={formik.values.tagline} onEdit={() => setCurrentStep(0)} t={t} />}
                            <PreviewRow label={t("onboarding.fields.category")} value={selectedCategory ? `${selectedCategory.emoji ?? ""} ${selectedCategory.name}`.trim() : "—"} onEdit={() => setCurrentStep(0)} t={t} />
                            <PreviewRow label={t("onboarding.fields.description")} value={formik.values.description} onEdit={() => setCurrentStep(1)} t={t} />
                            <PreviewRow label={t("onboarding.fields.cities")} value={selectedCities.map((c) => c.name).join(", ") || "—"} onEdit={() => setCurrentStep(1)} t={t} />
                            <PreviewRow label={t("onboarding.fields.whatsapp")} value={formik.values.whatsapp} onEdit={() => setCurrentStep(1)} t={t} />
                            <PreviewRow label={t("onboarding.fields.price_range")} value={t(`filters.price_labels.${PRICE_OPTIONS.find((p) => p.value === formik.values.priceRange)?.labelKey ?? "standard"}`)} onEdit={() => setCurrentStep(2)} t={t} />
                            <PreviewRow label={t("onboarding.fields.languages")} value={formik.values.languagesSpoken.map((l) => LANGUAGES.find((lang) => lang.value === l)?.label ?? l).join(", ")} onEdit={() => setCurrentStep(2)} t={t} />
                            {formik.values.coverImageUrl && <PreviewRow label={t("onboarding.fields.cover_image")} value="✓" onEdit={() => setCurrentStep(3)} t={t} />}
                        </div>
                    </div>
                );
            }

            default: return null;
        }
    };

    const stepTitleKeys = [
        "onboarding.steps.basic",
        "onboarding.steps.zone",
        "onboarding.steps.services",
        "onboarding.steps.photos",
        "onboarding.steps.preview",
    ];

    return (
        <div className="min-h-screen bg-white flex w-full">
            <Head>
                <title>{t("onboarding.title")} — Farah.ma</title>
            </Head>

            {/* ── Left Pane (Image) ─────────────────────────────────────────── */}
            <div className="hidden lg:block lg:w-5/12 xl:w-1/2 relative bg-[#1A1A1A] overflow-hidden">
                {STEP_IMAGES.map((img, index) => (
                    <div
                        key={img}
                        className={cn(
                            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                            index === currentStep ? "opacity-100" : "opacity-0"
                        )}
                        style={{
                            backgroundImage: `url('${img}')`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        {/* 20% dark overlay to ensure feeling of luxury */}
                        <div className="absolute inset-0 bg-black/20" />
                    </div>
                ))}
                
                {/* Branding overlay */}
                <div className="absolute top-10 left-12 z-10">
                    <Link href="/" className="font-display italic text-white text-[28px] drop-shadow-md">
                        Farah.ma
                    </Link>
                </div>
            </div>

            {/* ── Right Pane (Form) ─────────────────────────────────────────── */}
            <div className="w-full lg:w-7/12 xl:w-1/2 flex flex-col relative h-screen bg-white">
                
                {/* Mobile top bar */}
                <div className="lg:hidden px-6 py-5 flex items-center justify-between border-b border-[#EBEBEB] bg-white sticky top-0 z-20">
                    <Link href="/" className="font-display italic text-[#E8472A] text-[22px]">
                        Farah.ma
                    </Link>
                    <span className="text-[13px] font-medium text-[#717171]">
                        {currentStep + 1} / {TOTAL_STEPS}
                    </span>
                </div>

                {/* Form scrollable area */}
                <div className="flex-1 overflow-y-auto px-6 py-10 md:px-16 lg:px-20 lg:py-16 pb-40">
                    <form onSubmit={formik.handleSubmit} className="max-w-xl mx-auto w-full">
                        
                        {/* Step indicator (Minimalist tracker) */}
                        <div className="mb-12">
                            <span className="text-[12px] font-bold tracking-widest uppercase text-[#B0B0B0] block mb-3">
                                {t("onboarding.step_of", { current: currentStep + 1, total: TOTAL_STEPS })}
                            </span>
                            <div className="flex items-center gap-2">
                                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={cn(
                                            "flex-1 h-1.5 rounded-full transition-all duration-300",
                                            i < currentStep ? "bg-[#E8472A]" : 
                                            i === currentStep ? "bg-[#1A1A1A]" : "bg-[#F0F0F0]"
                                        )} 
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Title area */}
                        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h1 className="font-display text-[36px] md:text-[48px] text-[#1A1A1A] leading-[1.05] tracking-tight">
                                {currentStep === 4 ? t("onboarding.preview.title") : t(stepTitleKeys[currentStep])}
                            </h1>
                            {currentStep === 0 && (
                                <p className="text-[16px] text-[#717171] mt-3 leading-relaxed">
                                    {t("onboarding.subtitle")}
                                </p>
                            )}
                        </div>

                        {/* Step fields */}
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {renderStep()}
                        </div>
                    </form>
                </div>

                {/* Glassmorphism Navigation Footer */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-[#EBEBEB] px-6 py-5 md:px-16 lg:px-20">
                    <div className="max-w-xl mx-auto flex items-center justify-between w-full">
                        {currentStep > 0 ? (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleBack}
                                className="flex items-center gap-1.5 text-[15px] font-medium text-[#1A1A1A] hover:bg-[#F7F7F7] px-5 h-12 rounded-full"
                            >
                                <ChevronLeft className="w-4 h-4 rtl:-scale-x-100" />
                                {t("onboarding.nav.back")}
                            </Button>
                        ) : (
                            <div />
                        )}

                        {currentStep < TOTAL_STEPS - 1 ? (
                            <Button
                                type="button"
                                onClick={handleNext}
                                className="flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-[#333333] text-white rounded-full px-8 h-12 text-[15px] shadow-lg shadow-black/10 transition-all active:scale-95"
                            >
                                {t("onboarding.nav.next")}
                                <ChevronRight className="w-4 h-4 rtl:-scale-x-100" />
                            </Button>
                        ) : (
                            <Button
                                type="button" // Change to simply trigger submit explicitly 
                                onClick={formik.submitForm}
                                disabled={createProfile.isPending}
                                className="flex items-center gap-2 bg-[#E8472A] hover:bg-[#C43A20] text-white rounded-full px-8 h-12 text-[15px] shadow-lg shadow-[#E8472A]/20 transition-all active:scale-95 disabled:opacity-60"
                            >
                                {createProfile.isPending
                                    ? t("onboarding.nav.submitting")
                                    : t("onboarding.nav.submit")
                                }
                            </Button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
    label,
    children,
    error,
    hint,
    required,
}: {
    label: string;
    children: React.ReactNode;
    error?: string;
    hint?: string;
    required?: boolean;
}) {
    return (
        <div className="space-y-1.5">
            <Label className="text-[13px] font-semibold text-[#1A1A1A]">
                {label}
                {required && <span className="text-[#E8472A] ms-0.5">*</span>}
            </Label>
            {hint && <p className="text-[12px] text-[#717171]">{hint}</p>}
            {children}
            {error && <p className="text-[12px] text-red-500 font-medium">{error}</p>}
        </div>
    );
}

function PreviewRow({
    label,
    value,
    onEdit,
    t,
}: {
    label: string;
    value: string;
    onEdit: () => void;
    t: (key: string) => string;
}) {
    return (
        <div className="flex items-start justify-between gap-4 py-3 border-b border-[#F7F7F7] last:border-0">
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

// ─── SSR ──────────────────────────────────────────────────────────────────────

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale ?? "fr", ["common"])),
    },
});
