import Head from "next/head";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/ui/button";
import { FloatingInput } from "../../components/ui/floating-input";
import { AuthCard } from "../../components/auth/AuthCard";
import { useAuth } from "../../context/AuthContext";

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

function OrDivider({ label }: { label: string }) {
    return (
        <div className="relative flex items-center my-5" role="separator" aria-label={label}>
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="mx-4 text-[13px] font-bold text-neutral-500 uppercase tracking-wider select-none">{label}</span>
            <div className="flex-1 h-px bg-neutral-200" />
        </div>
    );
}

export default function LoginPage() {
    const { t } = useTranslation("common");
    const { login } = useAuth();
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const schema = z.object({
        email:    z.string().email(t("auth.invalid_email")),
        password: z.string().min(1, t("auth.required_password")),
    });
    type FormValues = z.infer<typeof schema>;

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (values: FormValues) => {
        setServerError(null);
        try {
            await login({ email: values.email, password: values.password });
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : null;
            setServerError(msg || t("auth.login_error"));
        }
    };

    return (
        <>
            <Head>
                <title>{t("auth.login_btn")} — Farah.ma</title>
                <meta name="description" content={t("auth.login_subtitle")} />
            </Head>

            <AuthCard closeHref="/">
                <p className="font-display text-[26px] text-[#1A1A1A] leading-tight mb-7">
                    {t("auth.welcome")}
                </p>

                {serverError && (
                    <div
                        role="alert"
                        className="mb-5 p-4 bg-[#FEECEC] border border-[#C13030]/20 rounded-xl text-[14px] text-[#C13030]"
                    >
                        {serverError}
                    </div>
                )}

                <AuthCard.SocialButton href="/api/auth/google" onClick={() => {}}>
                    <GoogleIcon />
                    {t("auth.continue_with_google")}
                </AuthCard.SocialButton>

                <OrDivider label={t("auth.or")} />

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                    <FloatingInput
                        id="email"
                        label={t("auth.email_label")}
                        type="email"
                        autoComplete="email"
                        autoFocus
                        {...register("email")}
                        error={errors.email?.message}
                    />

                    <div className="space-y-1">
                        <FloatingInput
                            id="password"
                            label={t("auth.password_label")}
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
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
                        <div className="flex justify-end pt-1">
                            <Link
                                href="/auth/forgot-password"
                                className="text-[13px] text-[#717171] underline underline-offset-2 hover:text-[#E8472A] transition-colors"
                            >
                                {t("auth.forgot_password")}
                            </Link>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        className="w-full h-[52px] mt-2 text-[15px] font-semibold rounded-xl"
                    >
                        {t("auth.login_btn")}
                    </Button>
                </form>

                <p className="text-center text-[14px] text-[#717171] mt-7 pb-1">
                    {t("auth.no_account")}{" "}
                    <Link
                        href="/auth/register"
                        className="text-[#E8472A] font-semibold underline underline-offset-2 hover:text-[#C43A20] transition-colors"
                    >
                        {t("auth.register_link")}
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
