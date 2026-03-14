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
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription } from "../../components/ui/alert";

const validationSchema = (t: any) => Yup.object({
    firstName: Yup.string().required(t("auth.first_name_req")),
    lastName:  Yup.string().required(t("auth.last_name_req")),
    email:     Yup.string().email(t("auth.invalid_email")).required(t("auth.required_email")),
    password:  Yup.string()
        .min(8, t("auth.password_min"))
        .required(t("auth.required_password")),
    userType: Yup.string().oneOf(["client", "caterer"]).required(),
});

// Shared input className helper (keeping for logic, but Input component will handle styling)
const inputCls = (hasError: boolean) =>
    hasError ? "border-[#C13030] focus-visible:ring-[#C13030]" : "";

// v3.0 — neutral card, 48px inputs, terracotta CTA
export default function RegisterPage() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { register } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const defaultType = (router.query.type as string) === "caterer" ? "caterer" : "client";
    const [userType, setUserType] = useState<"client" | "caterer">(defaultType);

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            userType,
        },
        validationSchema: validationSchema(t),
        enableReinitialize: true,
        onSubmit: async (values, helpers) => {
            setError(null);
            try {
                await register({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    plainPassword: values.password,
                    userType: values.userType,
                });
            } catch (err: any) {
                if (err instanceof ApiError && err.data.violations) {
                    const formErrors: Record<string, string> = {};
                    err.data.violations.forEach((v: any) => { formErrors[v.propertyPath] = v.message; });
                    helpers.setErrors(formErrors);
                } else {
                    setError(err.message || t("auth.register_error"));
                }
            } finally {
                helpers.setSubmitting(false);
            }
        },
    });

    const handleTypeSwitch = (type: "client" | "caterer") => {
        setUserType(type);
        formik.setFieldValue("userType", type);
    };

    return (
        <>
            <Head>
                <title>{`${t("auth.register_title")} — Farah.ma`}</title>
                <meta name="description" content={t("auth.register_subtitle")} />
            </Head>

            <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-4 pt-20 pb-12">
                <div className="w-full max-w-[480px]">

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
                            {t("auth.register_title")}
                        </h1>
                        <p className="text-[14px] text-[#717171] mt-1">
                            {t("auth.register_subtitle")}
                        </p>
                    </div>

                    {/* ── Card ── */}
                    <div className="bg-white rounded-[24px] border border-[#DDDDDD] shadow-[0_1px_2px_rgba(0,0,0,0.08)] p-8">

                        {/* Account type toggle */}
                        <div className="flex bg-[#F7F7F7] rounded-xl p-1 mb-6" role="group" aria-label="Type de compte">
                            {(["client", "caterer"] as const).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => handleTypeSwitch(type)}
                                    className={`flex-1 py-2.5 rounded-lg text-[14px] font-medium transition-all ${
                                        userType === type
                                            ? "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] text-[#1A1A1A]"
                                            : "text-[#717171] hover:text-[#484848]"
                                    }`}
                                    aria-pressed={userType === type}
                                >
                                    {type === "client" ? `💍 ${t("auth.planning_wedding")}` : `🏛️ ${t("nav.for_vendors")}`}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
                            {error && (
                                <Alert variant="destructive" className="bg-[#FEECEC] border-[#C13030]/20 text-[#C13030] rounded-xl">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Name row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="firstName" className="text-[14px] font-medium text-[#1A1A1A]">
                                        {t("auth.first_name")}
                                    </Label>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        autoComplete="given-name"
                                        {...formik.getFieldProps("firstName")}
                                        className={inputCls(!!(formik.touched.firstName && formik.errors.firstName))}
                                        placeholder="Yasmine"
                                    />
                                    {formik.touched.firstName && formik.errors.firstName && (
                                        <p className="text-[13px] text-[#C13030] mt-1">{formik.errors.firstName}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="lastName" className="text-[14px] font-medium text-[#1A1A1A]">
                                        {t("auth.last_name")}
                                    </Label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        autoComplete="family-name"
                                        {...formik.getFieldProps("lastName")}
                                        className={inputCls(!!(formik.touched.lastName && formik.errors.lastName))}
                                        placeholder="Benali"
                                    />
                                    {formik.touched.lastName && formik.errors.lastName && (
                                        <p className="text-[13px] text-[#C13030] mt-1">{formik.errors.lastName}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-[14px] font-medium text-[#1A1A1A]">
                                    {t("auth.email_label")}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    {...formik.getFieldProps("email")}
                                    className={inputCls(!!(formik.touched.email && formik.errors.email))}
                                    placeholder="vous@exemple.com"
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-[13px] text-[#C13030] mt-1">{formik.errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <Label htmlFor="password" title={t("auth.password_label")} className="text-[14px] font-medium text-[#1A1A1A]">
                                    {t("auth.password_label")}
                                    <span className="text-[#717171] font-normal ml-1">{t("auth.password_hint")}</span>
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    {...formik.getFieldProps("password")}
                                    className={inputCls(!!(formik.touched.password && formik.errors.password))}
                                    placeholder="••••••••"
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <p className="text-[13px] text-[#C13030] mt-1">{formik.errors.password}</p>
                                )}
                            </div>

                            {/* Vendor notice */}
                            {userType === "caterer" && (
                                <div className="p-3.5 bg-[#FEF0ED] border border-[#E8472A]/20 rounded-xl text-[13px] text-[#484848]">
                                    {t("auth.vendor_notice")}
                                </div>
                            )}

                            {/* Terms */}
                            <p className="text-[12px] text-[#717171] leading-relaxed">
                                <Trans 
                                    i18nKey="auth.terms_text"
                                    ns="common"
                                    components={{
                                        1: <Link href="/about#terms" className="text-[#484848] underline underline-offset-2 hover:text-[#1A1A1A]" />,
                                        2: <Link href="/about#privacy" className="text-[#484848] underline underline-offset-2 hover:text-[#1A1A1A]" />
                                    }}
                                />
                            </p>

                            {/* Submit */}
                            <Button
                                type="submit"
                                loading={formik.isSubmitting}
                                size="lg"
                                className="w-full"
                            >
                                {formik.isSubmitting ? t("auth.creating_acc") : t("auth.create_acc_btn")}
                            </Button>
                        </form>

                        <p className="text-center text-[14px] text-[#717171] mt-6">
                            {t("auth.already_registered")}{" "}
                            <Link href="/auth/login" className="text-[#E8472A] font-medium hover:text-[#C43A20] transition-colors">
                                {t("auth.login_btn")}
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
