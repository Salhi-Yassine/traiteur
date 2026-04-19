import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { Button } from "../../components/ui/button";
import { FloatingInput } from "../../components/ui/floating-input";
import { AuthCard } from "../../components/auth/AuthCard";
import SuccessAnimation from "../../components/ui/SuccessAnimation";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../utils/apiClient";
import { cn } from "@/lib/utils";
import { Heart, MapPin, Wallet, Users, CheckCircle2, Calendar } from "lucide-react";

const TOTAL_STEPS = 4;

function StepDots({ current, total }: { current: number; total: number }) {
    return (
        <div className="flex items-center justify-center gap-2 mb-6">
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "rounded-full transition-all duration-300",
                        i < current ? "w-2 h-2 bg-primary" : i === current ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-neutral-200",
                    )}
                />
            ))}
        </div>
    );
}

function StepHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
    return (
        <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                {icon}
            </div>
            <h2 className="font-display text-[24px] text-neutral-900 leading-tight">{title}</h2>
            {subtitle && <p className="text-[14px] text-neutral-500 mt-1">{subtitle}</p>}
        </div>
    );
}

export default function CoupleOnboardingPage() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { user, refreshUser } = useAuth();
    const [step, setStep] = useState(0);
    const [isSubmittingApi, setIsSubmittingApi] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const schema = z.object({
        brideName:      z.string().min(1, t("onboarding.couple.bride_name_req")),
        groomName:      z.string().min(1, t("onboarding.couple.groom_name_req")),
        weddingDate:    z.string().optional(),
        weddingCity:    z.string().optional(),
        totalBudgetMad: z.string().optional(),
        guestCountEst:  z.string().optional(),
    });
    type FormValues = z.infer<typeof schema>;

    const { register, trigger, watch, getValues, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            brideName:      user?.firstName ?? "",
            groomName:      "",
            weddingDate:    "",
            weddingCity:    "",
            totalBudgetMad: "",
            guestCountEst:  "",
        },
    });

    const values = watch();

    const skip = () => void router.push("/mariage");

    const nextStep = async () => {
        if (step === 0) {
            const valid = await trigger(["brideName", "groomName"]);
            if (!valid) return;
        }
        if (step === 2) {
            await handleSubmit();
        } else {
            setStep((s) => s + 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmittingApi(true);
        setSubmitError(null);
        const vals = getValues();
        try {
            await apiClient.post("/api/wedding_profiles", {
                brideName: vals.brideName,
                groomName: vals.groomName,
                ...(vals.weddingDate    && { weddingDate:    vals.weddingDate }),
                ...(vals.weddingCity    && { weddingCity:    vals.weddingCity }),
                ...(vals.totalBudgetMad && { totalBudgetMad: parseInt(vals.totalBudgetMad, 10) }),
                ...(vals.guestCountEst  && { guestCountEst:  parseInt(vals.guestCountEst, 10) }),
            });
            await refreshUser();
            setStep(3);
        } catch {
            setSubmitError(t("onboarding.errors.submit_failed"));
        } finally {
            setIsSubmittingApi(false);
        }
    };

    const renderStep0 = () => (
        <>
            <StepHeader icon={<Heart className="w-7 h-7" />} title={t("onboarding.couple.welcome_title")} subtitle={t("onboarding.couple.names_subtitle")} />
            <div className="grid grid-cols-2 gap-3">
                <FloatingInput id="brideName" label={t("onboarding.couple.bride_name")} type="text" autoFocus {...register("brideName")} error={errors.brideName?.message} />
                <FloatingInput id="groomName" label={t("onboarding.couple.groom_name")} type="text" {...register("groomName")} error={errors.groomName?.message} />
            </div>
        </>
    );

    const renderStep1 = () => (
        <>
            <StepHeader icon={<Calendar className="w-7 h-7" />} title={t("onboarding.couple.date_city_title")} />
            <div className="space-y-4">
                <FloatingInput id="weddingDate" label={t("onboarding.couple.wedding_date")} type="date" {...register("weddingDate")} />
                <FloatingInput id="weddingCity" label={t("onboarding.couple.wedding_city")} type="text" {...register("weddingCity")} />
                <p className="text-[12px] text-neutral-500 ps-1 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    {t("onboarding.couple.date_hint")}
                </p>
            </div>
        </>
    );

    const renderStep2 = () => (
        <>
            <StepHeader icon={<Wallet className="w-7 h-7" />} title={t("onboarding.couple.budget_title")} />
            <div className="space-y-4">
                <FloatingInput
                    id="totalBudgetMad"
                    label={t("onboarding.couple.total_budget")}
                    type="number"
                    min="0"
                    step="5000"
                    {...register("totalBudgetMad")}
                    trailingSlot={<span className="text-[13px] font-semibold text-neutral-500 pe-1">{t("onboarding.couple.budget_suffix")}</span>}
                />
                <FloatingInput
                    id="guestCountEst"
                    label={t("onboarding.couple.guest_count")}
                    type="number"
                    min="1"
                    {...register("guestCountEst")}
                    trailingSlot={<Users className="w-4 h-4 text-neutral-400" />}
                />
                <p className="text-[12px] text-neutral-500 ps-1">{t("onboarding.couple.budget_hint")}</p>
                {submitError && (
                    <div className="p-3.5 bg-[#FEECEC] border border-[#C13030]/20 rounded-xl text-[13px] text-[#C13030]">
                        {submitError}
                    </div>
                )}
            </div>
        </>
    );

    const renderStep3 = () => (
        <div className="text-center py-4">
            <div className="flex justify-center mb-4"><SuccessAnimation show={step === 3} /></div>
            <h2 className="font-display text-[26px] text-neutral-900 leading-tight mb-2">{t("onboarding.couple.success_title")}</h2>
            <p className="text-[14px] text-neutral-500 mb-8">{t("onboarding.couple.success_subtitle")}</p>

            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 text-start mb-8 space-y-3">
                <p className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider">{t("onboarding.couple.success_summary")}</p>
                {[
                    { label: `${values.brideName} & ${values.groomName}`, icon: <Heart className="w-4 h-4 text-primary" /> },
                    values.weddingDate
                        ? { label: new Date(values.weddingDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }), icon: <Calendar className="w-4 h-4 text-primary" /> }
                        : null,
                    values.weddingCity  ? { label: values.weddingCity, icon: <MapPin className="w-4 h-4 text-primary" /> } : null,
                    values.totalBudgetMad ? { label: `${parseInt(values.totalBudgetMad).toLocaleString("fr-FR")} MAD`, icon: <Wallet className="w-4 h-4 text-primary" /> } : null,
                    values.guestCountEst  ? { label: `${values.guestCountEst} ${t("onboarding.couple.guest_count").toLowerCase()}`, icon: <Users className="w-4 h-4 text-primary" /> } : null,
                ]
                    .filter(Boolean)
                    .map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            {item!.icon}
                            <span className="text-[14px] text-neutral-700">{item!.label}</span>
                        </div>
                    ))}
            </div>

            <Button onClick={() => void router.push("/mariage")} className="w-full h-[52px] text-[15px] font-semibold rounded-xl">
                <CheckCircle2 className="w-5 h-5 me-2" />
                {t("onboarding.couple.start_planning")}
            </Button>
        </div>
    );

    const isSuccess = step === 3;

    return (
        <>
            <Head>
                <title>{t("onboarding.couple.welcome_title")} — Farah.ma</title>
            </Head>

            <AuthCard closeHref="/" closeLabelKey="auth.back_home">
                {!isSuccess && (
                    <>
                        <StepDots current={step} total={TOTAL_STEPS - 1} />
                        <p className="text-center text-[12px] text-neutral-400 mb-6">
                            {t("onboarding.step_of", { current: step + 1, total: TOTAL_STEPS - 1 })}
                        </p>
                    </>
                )}

                {step === 0 && renderStep0()}
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}

                {!isSuccess && (
                    <div className="mt-8 space-y-3">
                        <Button
                            type="button"
                            onClick={() => void nextStep()}
                            loading={isSubmittingApi}
                            disabled={isSubmittingApi}
                            className="w-full h-[52px] text-[15px] font-semibold rounded-xl"
                        >
                            {step === 2 ? t("onboarding.couple.start_planning") : t("onboarding.continue")}
                        </Button>
                        <button
                            type="button"
                            onClick={skip}
                            className="w-full text-center text-[13px] text-neutral-500 hover:text-neutral-700 underline underline-offset-2 transition-colors py-1"
                        >
                            {t("onboarding.skip")}
                        </button>
                    </div>
                )}
            </AuthCard>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale || "fr", ["common"])),
    },
});
