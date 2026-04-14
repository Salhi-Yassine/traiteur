import Head from "next/head";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { cn } from "@/lib/utils";

const validationSchema = (t: any) => Yup.object({
    email:    Yup.string().email(t("auth.invalid_email")).required(t("auth.required_email")),
    password: Yup.string().required(t("auth.required_password")),
});

// v3.0 — white card, neutral-200 borders, terracotta focus, black submit button
export default function LoginPage() {
    const { t } = useTranslation("common");
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: validationSchema(t),
        onSubmit: async (values, helpers) => {
            setError(null);
            try {
                await login({ email: values.email, password: values.password });
            } catch (err: any) {
                setError(err.message || t("auth.login_error"));
                helpers.setErrors({ email: " " });
            } finally {
                helpers.setSubmitting(false);
            }
        },
    });

    const LOGIN_IMAGE = "https://images.unsplash.com/photo-1621532050212-e58f000fc7eb?w=1920&q=80"; // Beautiful Moroccan wedding / romantic ambiance

    return (
        <div className="min-h-screen bg-white flex w-full">
            <Head>
                <title>{t("nav.login")} — Farah.ma</title>
                <meta name="description" content={t("home.hero.subtitle")} />
            </Head>

            {/* ── Left Pane (Image) ─────────────────────────────────────────── */}
            <div className="hidden lg:block lg:w-5/12 xl:w-1/2 relative bg-[#1A1A1A] overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url('${LOGIN_IMAGE}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="absolute inset-0 bg-black/20" />
                </div>
                
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
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-12 md:px-16 lg:px-20 lg:py-24 flex items-center">
                    <div className="max-w-md w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        
                        {/* Title area */}
                        <div className="mb-10">
                            <h1 className="font-display text-[36px] md:text-[44px] text-[#1A1A1A] leading-[1.05] tracking-tight">
                                {t("auth.welcome")}
                            </h1>
                            <p className="text-[16px] text-[#717171] mt-3 leading-relaxed">
                                {t("auth.login_subtitle")}
                            </p>
                        </div>

                        {/* Form area */}
                        <form onSubmit={formik.handleSubmit} noValidate className="space-y-6">
                            {error && (
                                <div className="p-4 bg-[#FEECEC] border border-[#C13030]/20 rounded-xl text-[14px] text-[#C13030]" role="alert">
                                    {error}
                                </div>
                            )}

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[14px] font-medium text-[#1A1A1A]">
                                    {t("auth.email_label")}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    {...formik.getFieldProps("email")}
                                    className={cn(
                                        "h-14 text-[16px] rounded-xl border-2 transition-all focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10",
                                        formik.touched.email && formik.errors.email
                                            ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                                            : "border-[#EBEBEB]"
                                    )}
                                    placeholder="vous@exemple.com"
                                    aria-invalid={!!(formik.touched.email && formik.errors.email)}
                                    aria-describedby={formik.touched.email && formik.errors.email ? "email-error" : undefined}
                                />
                                {formik.touched.email && formik.errors.email && formik.errors.email.trim() && (
                                    <p id="email-error" className="text-[13px] text-[#C13030] mt-1.5">{formik.errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center mb-1.5">
                                    <Label htmlFor="password" className="text-[14px] font-medium text-[#1A1A1A]">
                                        {t("auth.password_label")}
                                    </Label>
                                    <Link href="/auth/forgot-password" className="text-[13px] text-[#E8472A] font-medium hover:text-[#C43A20] transition-colors">
                                        {t("auth.forgot_password")}
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    {...formik.getFieldProps("password")}
                                    className={cn(
                                        "h-14 text-[16px] rounded-xl border-2 transition-all focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10",
                                        formik.touched.password && formik.errors.password
                                            ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                                            : "border-[#EBEBEB]"
                                    )}
                                    placeholder="••••••••"
                                    aria-invalid={!!(formik.touched.password && formik.errors.password)}
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <p className="text-[13px] text-[#C13030] mt-1.5">{formik.errors.password}</p>
                                )}
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="w-full h-14 mt-2 text-[15px] font-medium rounded-xl bg-[#1A1A1A] hover:bg-[#333333] text-white transition-all active:scale-[0.98] shadow-lg shadow-black/10"
                            >
                                {formik.isSubmitting ? t("auth.logging_in") : t("auth.login_btn")}
                            </Button>
                        </form>

                        <p className="text-center text-[15px] text-[#717171] mt-10">
                            {t("auth.no_account")}{" "}
                            <Link href="/auth/register" className="text-[#E8472A] font-medium hover:text-[#C43A20] transition-colors underline underline-offset-4">
                                {t("auth.register_link")}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale || "fr", ["common"])),
        },
    };
};
