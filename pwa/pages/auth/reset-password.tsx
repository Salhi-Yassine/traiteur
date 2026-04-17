import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { Button } from "../../components/ui/button";
import { FloatingInput } from "../../components/ui/floating-input";
import { AuthCard } from "../../components/auth/AuthCard";
import { fetchApi } from "../../utils/apiClient";
import { CheckCircle, Eye, EyeOff } from "lucide-react";

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ResetPasswordPage() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Token comes from ?token= query param — same pattern as callback.tsx
    const token = router.isReady ? (router.query.token as string | undefined) : undefined;
    const tokenMissing = router.isReady && !token;

    const formik = useFormik({
        initialValues: { password: "", confirmPassword: "" },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(8, t("auth.password_min"))
                .required(t("auth.required_password")),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password")], t("auth.passwords_dont_match"))
                .required(t("auth.required_password")),
        }),
        onSubmit: async (values, helpers) => {
            setServerError(null);
            try {
                await fetchApi("/api/auth/reset-password", {
                    method: "POST",
                    jsonld: false,
                    body: JSON.stringify({ token, password: values.password }),
                });
                setSuccess(true);
            } catch {
                setServerError(t("auth.reset_password_error_invalid"));
            } finally {
                helpers.setSubmitting(false);
            }
        },
    });

    return (
        <>
            <Head>
                <title>{t("auth.reset_password_title")} — Farah.ma</title>
            </Head>

            <AuthCard closeHref="/auth/login" closeLabelKey="auth.back_to_login">
                {success ? (
                    /* ── Success state ── */
                    <div className="flex flex-col items-center text-center py-4 space-y-5">
                        <CheckCircle className="w-12 h-12 text-[#E8472A]" strokeWidth={1.5} />
                        <p className="font-display text-[22px] text-[#1A1A1A] leading-snug max-w-[380px]">
                            {t("auth.reset_password_success")}
                        </p>
                        <Link href="/auth/login" className="w-full">
                            <Button
                                className="w-full h-[52px] text-[15px] font-semibold rounded-xl bg-[#E8472A] hover:bg-[#C43A20] text-white border-transparent"
                            >
                                {t("auth.login_btn")}
                            </Button>
                        </Link>
                    </div>
                ) : tokenMissing ? (
                    /* ── Invalid / missing token state ── */
                    <div className="flex flex-col items-center text-center py-4 space-y-5">
                        <p className="font-display text-[22px] text-[#1A1A1A] leading-snug max-w-[380px]">
                            {t("auth.reset_password_error_invalid")}
                        </p>
                        <Link href="/auth/forgot-password" className="w-full">
                            <Button
                                variant="secondary"
                                className="w-full h-[52px] text-[15px] font-semibold rounded-xl"
                            >
                                {t("auth.forgot_password_btn")}
                            </Button>
                        </Link>
                    </div>
                ) : (
                    /* ── Form state ── */
                    <>
                        <p className="font-display text-[26px] text-[#1A1A1A] leading-tight mb-3">
                            {t("auth.reset_password_title")}
                        </p>
                        <p className="text-[14px] text-[#717171] mb-7 leading-relaxed">
                            {t("auth.reset_password_desc")}
                        </p>

                        {serverError && (
                            <div
                                role="alert"
                                className="mb-5 p-4 bg-[#FEECEC] border border-[#C13030]/20 rounded-xl text-[14px] text-[#C13030]"
                            >
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
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

                            <FloatingInput
                                id="confirmPassword"
                                label={t("auth.confirm_password_label")}
                                type={showConfirm ? "text" : "password"}
                                autoComplete="new-password"
                                {...formik.getFieldProps("confirmPassword")}
                                error={
                                    formik.touched.confirmPassword && formik.errors.confirmPassword
                                        ? formik.errors.confirmPassword
                                        : undefined
                                }
                                trailingSlot={
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm((v) => !v)}
                                        aria-label={showConfirm ? t("auth.hide_password") : t("auth.show_password")}
                                        className="p-1 rounded-full text-[#717171] hover:text-[#E8472A] transition-colors"
                                    >
                                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                }
                            />

                            <Button
                                type="submit"
                                disabled={formik.isSubmitting}
                                loading={formik.isSubmitting}
                                className="w-full h-[52px] mt-2 text-[15px] font-semibold rounded-xl bg-[#E8472A] hover:bg-[#C43A20] text-white border-transparent"
                            >
                                {t("auth.reset_password_btn")}
                            </Button>
                        </form>
                    </>
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
