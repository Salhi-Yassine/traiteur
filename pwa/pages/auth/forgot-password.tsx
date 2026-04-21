import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { CheckCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { FloatingInput } from "../../components/ui/floating-input";
import { AuthCard } from "../../components/auth/AuthCard";
import { fetchApi } from "../../utils/apiClient";

export default function ForgotPasswordPage() {
    const { t } = useTranslation("common");
    const [submitted, setSubmitted] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const schema = z.object({
        email: z.string().email(t("auth.invalid_email")),
    });
    type FormValues = z.infer<typeof schema>;

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (values: FormValues) => {
        setServerError(null);
        try {
            await fetchApi("/api/auth/forgot-password", {
                method: "POST",
                jsonld: false,
                body: JSON.stringify({ email: values.email }),
            });
            setSubmitted(true);
        } catch {
            setServerError(t("auth.register_error"));
        }
    };

    return (
        <>
            <Head>
                <title>{t("auth.forgot_password_title")} — Farah.ma</title>
            </Head>

            <AuthCard closeHref="/auth/login" closeLabelKey="auth.back_to_login">
                {submitted ? (
                    <div className="flex flex-col items-center text-center py-4 space-y-5">
                        <CheckCircle className="w-12 h-12 text-primary" strokeWidth={1.5} />
                        <p className="font-display text-[22px] text-neutral-900 leading-snug max-w-[380px]">
                            {t("auth.forgot_password_sent")}
                        </p>
                        <Link href="/auth/login" className="w-full">
                            <Button variant="secondary" className="w-full h-[52px] text-[15px] font-semibold rounded-xl">
                                {t("auth.back_to_login")}
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="font-display text-[26px] text-neutral-900 leading-tight mb-3">
                            {t("auth.forgot_password_title")}
                        </p>
                        <p className="text-[14px] text-neutral-500 mb-7 leading-relaxed">
                            {t("auth.forgot_password_desc")}
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
                                id="email"
                                label={t("auth.email_label")}
                                type="email"
                                autoComplete="email"
                                {...register("email")}
                                error={errors.email?.message}
                            />

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                loading={isSubmitting}
                                className="w-full h-[52px] mt-2 text-[15px] font-semibold rounded-xl"
                            >
                                {t("auth.forgot_password_btn")}
                            </Button>
                        </form>

                        <p className="text-center text-[14px] text-neutral-500 mt-6 pb-1">
                            <Link
                                href="/auth/login"
                                className="text-primary font-semibold underline underline-offset-2 hover:text-primary-dark transition-colors"
                            >
                                {t("auth.back_to_login")}
                            </Link>
                        </p>
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
