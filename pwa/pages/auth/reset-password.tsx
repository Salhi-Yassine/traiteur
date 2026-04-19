import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { Button } from "../../components/ui/button";
import { FloatingInput } from "../../components/ui/floating-input";
import { AuthCard } from "../../components/auth/AuthCard";
import { fetchApi } from "../../utils/apiClient";
import { CheckCircle, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const token = router.isReady ? (router.query.token as string | undefined) : undefined;
    const tokenMissing = router.isReady && !token;

    const schema = z.object({
        password: z.string().min(8, t("auth.password_min")),
        confirmPassword: z.string().min(1, t("auth.required_password")),
    }).refine((d) => d.password === d.confirmPassword, {
        message: t("auth.passwords_dont_match"),
        path: ["confirmPassword"],
    });
    type FormValues = z.infer<typeof schema>;

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (values: FormValues) => {
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
        }
    };

    return (
        <>
            <Head>
                <title>{t("auth.reset_password_title")} — Farah.ma</title>
            </Head>

            <AuthCard closeHref="/auth/login" closeLabelKey="auth.back_to_login">
                {success ? (
                    <div className="flex flex-col items-center text-center py-4 space-y-5">
                        <CheckCircle className="w-12 h-12 text-primary" strokeWidth={1.5} />
                        <p className="font-display text-[22px] text-neutral-900 leading-snug max-w-[380px]">
                            {t("auth.reset_password_success")}
                        </p>
                        <Link href="/auth/login" className="w-full">
                            <Button className="w-full h-[52px] text-[15px] font-semibold rounded-xl">
                                {t("auth.login_btn")}
                            </Button>
                        </Link>
                    </div>
                ) : tokenMissing ? (
                    <div className="flex flex-col items-center text-center py-4 space-y-5">
                        <p className="font-display text-[22px] text-neutral-900 leading-snug max-w-[380px]">
                            {t("auth.reset_password_error_invalid")}
                        </p>
                        <Link href="/auth/forgot-password" className="w-full">
                            <Button variant="secondary" className="w-full h-[52px] text-[15px] font-semibold rounded-xl">
                                {t("auth.forgot_password_btn")}
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="font-display text-[26px] text-neutral-900 leading-tight mb-3">
                            {t("auth.reset_password_title")}
                        </p>
                        <p className="text-[14px] text-neutral-500 mb-7 leading-relaxed">
                            {t("auth.reset_password_desc")}
                        </p>

                        {serverError && (
                            <div
                                role="alert"
                                className="mb-5 p-4 bg-danger-bg border border-danger/20 rounded-xl text-[14px] text-danger"
                            >
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                            <FloatingInput
                                id="password"
                                label={t("auth.password_label")}
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                {...register("password")}
                                error={errors.password?.message}
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
                                {...register("confirmPassword")}
                                error={errors.confirmPassword?.message}
                                trailingSlot={
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm((v) => !v)}
                                        aria-label={showConfirm ? t("auth.hide_password") : t("auth.show_password")}
                                        className="p-1 rounded-full text-neutral-500 hover:text-primary transition-colors"
                                    >
                                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                }
                            />

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                loading={isSubmitting}
                                className="w-full h-[52px] mt-2 text-[15px] font-semibold rounded-xl"
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
