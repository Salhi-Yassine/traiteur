import Head from "next/head";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";

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

    return (
        <>
            <Head>
                <title>{t("nav.login")} — Farah.ma</title>
                <meta name="description" content={t("home.hero.subtitle")} />
            </Head>

            <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-4 pt-20 pb-12">
                <div className="w-full max-w-[440px]">

                    {/* ── Logo ── */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6">
                            <div className="w-9 h-9 rounded-xl bg-[#E8472A] flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
                                    <path d="M12 2l2.4 6.6H21l-5.4 4 2.1 6.4-5.7-4.1-5.7 4.1 2.1-6.4L3 8.6h6.6z" />
                                </svg>
                            </div>
                            <span className="font-display font-semibold text-[20px] text-[#1A1A1A]">
                                Farah<span className="text-[#E8472A]">.ma</span>
                            </span>
                        </Link>
                        <h1 className="font-display text-[28px] text-[#1A1A1A] leading-tight">
                            {t("auth.welcome")}
                        </h1>
                        <p className="text-[14px] text-[#717171] mt-1">
                            {t("auth.login_subtitle")}
                        </p>
                    </div>

                    {/* ── Card ── */}
                    <div className="bg-white rounded-[24px] border border-[#DDDDDD] shadow-[0_1px_2px_rgba(0,0,0,0.08)] p-8">
                        <form onSubmit={formik.handleSubmit} noValidate className="space-y-5">
                            {error && (
                                <div className="p-3.5 bg-[#FEECEC] border border-[#C13030]/20 rounded-xl text-[14px] text-[#C13030]" role="alert">
                                    {error}
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-[14px] font-medium text-[#1A1A1A] mb-1.5">
                                    {t("auth.email_label")}
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    {...formik.getFieldProps("email")}
                                    className={`w-full h-12 border rounded-lg px-4 text-[15px] text-[#1A1A1A] placeholder:text-[#B0B0B0] outline-none transition-all
                                        ${formik.touched.email && formik.errors.email
                                            ? "border-[#C13030] focus:shadow-[0_0_0_3px_rgba(193,48,48,0.12)]"
                                            : "border-[#DDDDDD] focus:border-[#1A1A1A] focus:shadow-[0_0_0_3px_rgba(26,26,26,0.08)]"
                                        }`}
                                    placeholder="vous@exemple.com"
                                    aria-invalid={!!(formik.touched.email && formik.errors.email)}
                                    aria-describedby={formik.touched.email && formik.errors.email ? "email-error" : undefined}
                                />
                                {formik.touched.email && formik.errors.email && formik.errors.email.trim() && (
                                    <p id="email-error" className="text-[13px] text-[#C13030] mt-1.5">{formik.errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label htmlFor="password" className="block text-[14px] font-medium text-[#1A1A1A]">
                                        {t("auth.password_label")}
                                    </label>
                                    <Link href="/auth/forgot-password" className="text-[13px] text-[#E8472A] hover:text-[#C43A20] transition-colors">
                                        {t("auth.forgot_password")}
                                    </Link>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    {...formik.getFieldProps("password")}
                                    className={`w-full h-12 border rounded-lg px-4 text-[15px] text-[#1A1A1A] placeholder:text-[#B0B0B0] outline-none transition-all
                                        ${formik.touched.password && formik.errors.password
                                            ? "border-[#C13030] focus:shadow-[0_0_0_3px_rgba(193,48,48,0.12)]"
                                            : "border-[#DDDDDD] focus:border-[#1A1A1A] focus:shadow-[0_0_0_3px_rgba(26,26,26,0.08)]"
                                        }`}
                                    placeholder="••••••••"
                                    aria-invalid={!!(formik.touched.password && formik.errors.password)}
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <p className="text-[13px] text-[#C13030] mt-1.5">{formik.errors.password}</p>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="w-full h-12 bg-[#E8472A] text-white rounded-lg text-[15px] font-semibold hover:bg-[#C43A20] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] mt-1"
                            >
                                {formik.isSubmitting ? t("auth.logging_in") : t("auth.login_btn")}
                            </button>
                        </form>

                        <p className="text-center text-[14px] text-[#717171] mt-6">
                            {t("auth.no_account")}{" "}
                            <Link href="/auth/register" className="text-[#E8472A] font-medium hover:text-[#C43A20] transition-colors">
                                {t("auth.register_link")}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale || "fr", ["common"])),
        },
    };
};
