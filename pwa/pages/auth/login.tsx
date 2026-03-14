import Head from "next/head";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

export default function LoginPage() {
    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema,
        onSubmit: async (values, helpers) => {
            try {
                const res = await fetch("/api/auth", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: values.email, password: values.password }),
                });
                if (!res.ok) throw new Error("Invalid credentials");
                // TODO: Store token in cookie/context and redirect
                window.location.href = "/";
            } catch {
                helpers.setErrors({ email: "Invalid email or password" });
            } finally {
                helpers.setSubmitting(false);
            }
        },
    });

    return (
        <>
            <Head>
                <title>Sign In — Traiteur</title>
            </Head>
            <div className="min-h-screen bg-[var(--color-sand-50)] flex items-center justify-center px-4 pt-20 pb-12">
                <div className="w-full max-w-md">
                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-[var(--shadow-card-hover)] p-8 md:p-10">
                        {/* Logo */}
                        <div className="text-center mb-8">
                            <div className="w-12 h-12 rounded-full bg-[var(--color-teal-700)] flex items-center justify-center mx-auto mb-3">
                                <span className="text-white text-xl font-bold font-display">T</span>
                            </div>
                            <h1 className="font-display text-2xl font-bold text-[var(--color-charcoal-900)]">
                                Welcome back
                            </h1>
                            <p className="text-[var(--color-charcoal-500)] text-sm mt-1">
                                Sign in to your Traiteur account
                            </p>
                        </div>

                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[var(--color-charcoal-700)] mb-1.5">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    {...formik.getFieldProps("email")}
                                    className="w-full border border-[var(--color-sand-200)] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-teal-500)] focus:border-transparent outline-none transition"
                                    placeholder="you@example.com"
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex justify-between mb-1.5">
                                    <label htmlFor="password" className="block text-sm font-medium text-[var(--color-charcoal-700)]">
                                        Password
                                    </label>
                                    <Link href="#" className="text-xs text-[var(--color-teal-700)] hover:text-[var(--color-teal-900)]">
                                        Forgot password?
                                    </Link>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    {...formik.getFieldProps("password")}
                                    className="w-full border border-[var(--color-sand-200)] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-teal-500)] focus:border-transparent outline-none transition"
                                    placeholder="••••••••"
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="w-full bg-[var(--color-teal-700)] text-white py-3.5 rounded-xl font-semibold hover:bg-[var(--color-teal-800)] transition-colors disabled:opacity-60 mt-2"
                            >
                                {formik.isSubmitting ? "Signing in…" : "Sign In"}
                            </button>
                        </form>

                        <p className="text-center text-sm text-[var(--color-charcoal-500)] mt-6">
                            Don't have an account?{" "}
                            <Link href="/auth/register" className="text-[var(--color-teal-700)] font-semibold hover:text-[var(--color-teal-900)]">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
