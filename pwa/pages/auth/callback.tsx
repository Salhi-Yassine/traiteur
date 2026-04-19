import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { useAuth } from "../../context/AuthContext";
import { setRefreshToken } from "../../utils/apiClient";

/**
 * /auth/callback
 *
 * Landing page after Google OAuth.
 * Symfony redirects here with:   ?token=<JWT>
 * On error Symfony redirects with: ?error=google_failed
 *
 * This page is intentionally minimal — it just handles the token hand-off
 * and redirects to the dashboard. It is never linked to directly by users.
 */
export default function AuthCallbackPage() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { loginWithToken } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Wait for the router to be ready so query params are available
        if (!router.isReady) return;

        const { token, refresh_token, error: oauthError } = router.query;

        if (oauthError || !token || typeof token !== "string") {
            const detail = typeof oauthError === "string" ? oauthError : "";
            setError(`${t("auth.google_callback_error")}${detail ? ` — ${detail}` : ""}`);
            return;
        }

        if (refresh_token && typeof refresh_token === "string") {
            setRefreshToken(refresh_token);
        }

        loginWithToken(token).catch(() => {
            setError(t("auth.google_callback_error"));
        });
    }, [router.isReady, router.query]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="min-h-screen bg-[#F7F7F7] flex flex-col items-center justify-center px-4">
            <Head>
                <title>Connexion — Farah.ma</title>
            </Head>

            {error ? (
                <div className="w-full max-w-[400px] bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.12)] p-8 text-center">
                    <p className="text-[15px] text-[#C13030] mb-6">{error}</p>
                    <Link
                        href="/auth/login"
                        className="text-[14px] text-[#E8472A] font-semibold underline underline-offset-2 hover:text-[#C43A20] transition-colors"
                    >
                        {t("auth.login_btn")}
                    </Link>
                </div>
            ) : (
                /* Spinner while the token is being stored and /me is fetched */
                <div className="flex flex-col items-center gap-4">
                    <svg
                        className="w-10 h-10 animate-spin text-[#E8472A]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-label="Chargement…"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <p className="text-[14px] text-[#717171]">{t("auth.logging_in")}</p>
                </div>
            )}
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale || "fr", ["common"])),
    },
});
