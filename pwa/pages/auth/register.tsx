import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../utils/apiClient";
import { useTranslation, Trans } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { Button } from "../../components/ui/button";
import { FloatingInput } from "../../components/ui/floating-input";
import { AuthCard } from "../../components/auth/AuthCard";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, CheckCircle2, Circle, Camera, MessageSquare, BarChart2 } from "lucide-react";

// ── Google logo ──────────────────────────────────────────────────────────────
function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

// ── "── ou ──" separator ─────────────────────────────────────────────────────
function OrDivider({ label }: { label: string }) {
    return (
        <div className="relative flex items-center my-5" role="separator" aria-label={label}>
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="mx-4 text-[13px] font-bold text-neutral-500 uppercase tracking-wider select-none">{label}</span>
            <div className="flex-1 h-px bg-neutral-200" />
        </div>
    );
}

// ── Validation ───────────────────────────────────────────────────────────────
const validationSchema = (t: (key: string) => string) =>
    Yup.object({
        firstName: Yup.string().required(t("auth.first_name_req")),
        lastName:  Yup.string().required(t("auth.last_name_req")),
        email:     Yup.string().email(t("auth.invalid_email")).required(t("auth.required_email")),
        password:  Yup.string().min(8, t("auth.password_min")).required(t("auth.required_password")),
        userType:  Yup.string().oneOf(["couple", "vendor"]).required(),
    });

// ── Page ─────────────────────────────────────────────────────────────────────
export default function RegisterPage() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { register } = useAuth();
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const defaultType = (router.query.type as string) === "vendor" ? "vendor" : "couple";
    const [userType, setUserType] = useState<"couple" | "vendor">(defaultType);

    const formik = useFormik({
        initialValues: { firstName: "", lastName: "", email: "", password: "", userType },
        validationSchema: validationSchema(t),
        enableReinitialize: true,
        onSubmit: async (values, helpers) => {
            setServerError(null);
            try {
                await register({
                    firstName:     values.firstName,
                    lastName:      values.lastName,
                    email:         values.email,
                    plainPassword: values.password,
                    userType:      values.userType,
                });
            } catch (err: unknown) {
                if (err instanceof ApiError && err.data?.violations) {
                    const formErrors: Record<string, string> = {};
                    err.data.violations.forEach((v: { propertyPath: string; message: string }) => {
                        formErrors[v.propertyPath] = v.message;
                    });
                    helpers.setErrors(formErrors);
                } else {
                    const msg = err instanceof Error ? err.message : null;
                    setServerError(msg || t("auth.register_error"));
                }
            } finally {
                helpers.setSubmitting(false);
            }
        },
    });

    const handleTypeSwitch = (type: "couple" | "vendor") => {
        setUserType(type);
        formik.setFieldValue("userType", type);
    };

    return (
        <>
            <Head>
                <title>{t("auth.register_title")} — Farah.ma</title>
                <meta name="description" content={t("auth.register_subtitle")} />
            </Head>

            <AuthCard closeHref="/">
                <p className="font-display text-[26px] text-[#1A1A1A] leading-tight mb-6">
                    {t("auth.register_subtitle")}
                </p>

                {/* Account type toggle */}
                <div className="flex gap-2 mb-6" role="group" aria-label={t("auth.account_type")}>
                    <button
                        type="button"
                        onClick={() => handleTypeSwitch("couple")}
                        className={cn(
                            "flex-1 h-[52px] rounded-2xl text-[13px] font-bold border transition-all duration-200 flex flex-col items-center justify-center gap-0.5",
                            userType === "couple"
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "bg-white text-neutral-500 border-neutral-200 hover:border-primary hover:text-primary",
                        )}
                    >
                        <span>💍</span>
                        <span>{t("auth.planning_wedding")}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTypeSwitch("vendor")}
                        className={cn(
                            "flex-1 h-[52px] rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center gap-0",
                            userType === "vendor"
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "bg-white text-neutral-500 border-neutral-200 hover:border-primary hover:text-primary",
                        )}
                    >
                        <span className="text-[13px] font-bold">{t("auth.i_am_vendor")}</span>
                        <span className="text-[11px] font-medium opacity-80">{t("auth.vendor_sub_label")}</span>
                    </button>
                </div>

                {/* Vendor value card — shown only when vendor tab active */}
                {userType === "vendor" && (
                    <div className="mb-6 p-4 bg-[#FEF0ED] border border-[#E8472A]/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                        <p className="text-[12px] font-bold text-[#E8472A] uppercase tracking-wider mb-3">
                            {t("auth.vendor_value_title")}
                        </p>
                        <div className="space-y-2">
                            {[
                                { icon: Camera,        label: t("onboarding.vendor.welcome_bullet_1") },
                                { icon: MessageSquare, label: t("onboarding.vendor.welcome_bullet_2") },
                                { icon: BarChart2,     label: t("onboarding.vendor.welcome_bullet_3") },
                            ].map(({ icon: Icon, label }, i) => (
                                <div key={i} className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0">
                                        <Icon className="w-3.5 h-3.5 text-[#E8472A]" />
                                    </div>
                                    <span className="text-[13px] text-[#484848] font-medium">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {serverError && (
                    <div
                        role="alert"
                        className="mb-5 p-4 bg-[#FEECEC] border border-[#C13030]/20 rounded-xl text-[14px] text-[#C13030]"
                    >
                        {serverError}
                    </div>
                )}

                {/* Google OAuth */}
                <AuthCard.SocialButton
                    href="/api/auth/google"
                    onClick={() => {}}
                >
                    <GoogleIcon />
                    {t("auth.continue_with_google")}
                </AuthCard.SocialButton>

                <OrDivider label={t("auth.or")} />

                <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">

                    {/* Name row */}
                    <div className="grid grid-cols-2 gap-3">
                        <FloatingInput
                            id="firstName"
                            label={t("auth.first_name")}
                            type="text"
                            autoComplete="given-name"
                            autoFocus
                            {...formik.getFieldProps("firstName")}
                            error={
                                formik.touched.firstName && formik.errors.firstName
                                    ? formik.errors.firstName
                                    : undefined
                            }
                        />
                        <FloatingInput
                            id="lastName"
                            label={t("auth.last_name")}
                            type="text"
                            autoComplete="family-name"
                            {...formik.getFieldProps("lastName")}
                            error={
                                formik.touched.lastName && formik.errors.lastName
                                    ? formik.errors.lastName
                                    : undefined
                            }
                        />
                    </div>

                    <FloatingInput
                        id="email"
                        label={t("auth.email_label")}
                        type="email"
                        autoComplete="email"
                        {...formik.getFieldProps("email")}
                        error={
                            formik.touched.email && formik.errors.email
                                ? formik.errors.email
                                : undefined
                        }
                    />

                    <FloatingInput
                        id="password"
                        label={t("auth.password_label")}
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        {...formik.getFieldProps("password")}
                        error={
                            formik.touched.password && formik.errors.password
                                ? formik.errors.password
                                : undefined
                        }
                        trailingSlot={
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? t("auth.hide_password") : t("auth.show_password")}
                                className="p-1 rounded-full text-[#717171] hover:text-[#E8472A] transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        }
                    />
                    <div className="space-y-2.5 pb-2">
                        <p className="text-[12px] font-bold text-neutral-900 ps-1 uppercase tracking-wider">
                            {t("auth.password_requirements")}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 ps-1">
                            {[
                                { 
                                    label: t("auth.req_min_chars"), 
                                    met: formik.values.password.length >= 8 
                                },
                                { 
                                    label: t("auth.req_number"), 
                                    met: /[0-9]/.test(formik.values.password) 
                                },
                                { 
                                    label: t("auth.req_uppercase"), 
                                    met: /[A-Z]/.test(formik.values.password) 
                                },
                                { 
                                    label: t("auth.req_special"), 
                                    met: /[^A-Za-z0-9]/.test(formik.values.password) 
                                }
                            ].map((req, i) => (
                                <div 
                                    key={i} 
                                    className={cn(
                                        "flex items-center gap-2 text-[12px] transition-colors duration-300",
                                        req.met ? "text-green-600" : "text-neutral-400"
                                    )}
                                >
                                    {req.met ? (
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                    ) : (
                                        <Circle className="w-3.5 h-3.5" />
                                    )}
                                    <span className={cn(req.met ? "font-bold" : "font-medium")}>
                                        {req.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>


                    <p className="text-[12px] text-[#717171] leading-relaxed">
                        <Trans
                            i18nKey="auth.terms_text"
                            ns="common"
                            components={{
                                1: <Link href="/about#terms" className="text-[#484848] underline underline-offset-2 hover:text-[#E8472A]" />,
                                2: <Link href="/about#privacy" className="text-[#484848] underline underline-offset-2 hover:text-[#E8472A]" />,
                            }}
                        />
                    </p>

                    <Button
                        type="submit"
                        disabled={formik.isSubmitting}
                        loading={formik.isSubmitting}
                        className="w-full h-[52px] mt-2 text-[15px] font-semibold rounded-xl"
                    >
                        {t("auth.create_acc_btn")}
                    </Button>
                </form>

                <p className="text-center text-[14px] text-[#717171] mt-7 pb-1">
                    {t("auth.already_registered")}{" "}
                    <Link
                        href="/auth/login"
                        className="text-[#E8472A] font-semibold underline underline-offset-2 hover:text-[#C43A20] transition-colors"
                    >
                        {t("auth.login_btn")}
                    </Link>
                </p>
            </AuthCard>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale || "fr", ["common"])),
    },
});
