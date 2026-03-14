import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";

const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    userType: Yup.string().oneOf(["client", "caterer"]).required(),
});

export default function RegisterPage() {
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
        validationSchema,
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
                setError(err.message || "Registration failed");
                helpers.setErrors({ email: " " });
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
                <title>Create Account — Traiteur</title>
            </Head>
            <div className="min-h-screen bg-[var(--color-sand-50)] flex items-center justify-center px-4 pt-20 pb-12">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-[var(--shadow-card-hover)] p-8 md:p-10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-12 h-12 rounded-full bg-[var(--color-teal-700)] flex items-center justify-center mx-auto mb-3">
                                <span className="text-white text-xl font-bold font-display">T</span>
                            </div>
                            <h1 className="font-display text-2xl font-bold text-[var(--color-charcoal-900)]">
                                Create your account
                            </h1>
                            <p className="text-[var(--color-charcoal-500)] text-sm mt-1">
                                Join Algeria's premier catering marketplace
                            </p>
                        </div>

                        {/* Account type toggle */}
                        <div className="flex bg-[var(--color-sand-100)] rounded-xl p-1 mb-6">
                            {(["client", "caterer"] as const).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => handleTypeSwitch(type)}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${userType === type
                                        ? "bg-white shadow-sm text-[var(--color-teal-800)]"
                                        : "text-[var(--color-charcoal-500)] hover:text-[var(--color-charcoal-700)]"
                                        }`}
                                >
                                    {type === "client" ? "🍽 I'm looking for a caterer" : "👨‍🍳 I'm a caterer"}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                                    {error}
                                </div>
                            )}
                            {/* Name row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-[var(--color-charcoal-700)] mb-1.5">
                                        First name
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        {...formik.getFieldProps("firstName")}
                                        className="w-full border border-[var(--color-sand-200)] rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-teal-500)] focus:border-transparent outline-none"
                                        placeholder="Yasmine"
                                    />
                                    {formik.touched.firstName && formik.errors.firstName && (
                                        <p className="text-red-500 text-xs mt-1">{formik.errors.firstName}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-[var(--color-charcoal-700)] mb-1.5">
                                        Last name
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        {...formik.getFieldProps("lastName")}
                                        className="w-full border border-[var(--color-sand-200)] rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-teal-500)] focus:border-transparent outline-none"
                                        placeholder="Benali"
                                    />
                                    {formik.touched.lastName && formik.errors.lastName && (
                                        <p className="text-red-500 text-xs mt-1">{formik.errors.lastName}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[var(--color-charcoal-700)] mb-1.5">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    {...formik.getFieldProps("email")}
                                    className="w-full border border-[var(--color-sand-200)] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-teal-500)] focus:border-transparent outline-none"
                                    placeholder="you@example.com"
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-[var(--color-charcoal-700)] mb-1.5">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    {...formik.getFieldProps("password")}
                                    className="w-full border border-[var(--color-sand-200)] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-teal-500)] focus:border-transparent outline-none"
                                    placeholder="Min. 8 characters"
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
                                )}
                            </div>

                            {userType === "caterer" && (
                                <div className="p-3 bg-[var(--color-teal-50)] border border-[var(--color-teal-200)] rounded-xl text-sm text-[var(--color-teal-800)]">
                                    ✓ After registering, you'll be able to create your caterer profile from your dashboard.
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="w-full bg-[var(--color-teal-700)] text-white py-3.5 rounded-xl font-semibold hover:bg-[var(--color-teal-800)] transition-colors disabled:opacity-60 mt-2"
                            >
                                {formik.isSubmitting ? "Creating account…" : "Create Account"}
                            </button>
                        </form>

                        <p className="text-center text-sm text-[var(--color-charcoal-500)] mt-6">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="text-[var(--color-teal-700)] font-semibold hover:text-[var(--color-teal-900)]">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
