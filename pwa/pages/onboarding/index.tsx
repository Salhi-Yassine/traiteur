import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { useAuth } from "../../context/AuthContext";

/**
 * /onboarding — smart guard that reads user type + profile state and
 * redirects to the correct wizard or dashboard. Handles the broken
 * vendor redirect that previously pointed here from AuthContext.
 */
export default function OnboardingIndexPage() {
    const { t } = useTranslation("common");
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            router.replace("/auth/login");
            return;
        }

        if (user.userType === "couple") {
            router.replace(user.weddingProfile ? "/mariage" : "/onboarding/couple");
        } else if (user.userType === "vendor") {
            router.replace(user.vendorProfile ? "/dashboard/vendor" : "/onboarding/vendor");
        } else {
            router.replace("/admin");
        }
    }, [isLoading, user]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
            <Head>
                <title>Farah.ma</title>
            </Head>
            <svg
                className="w-10 h-10 animate-spin text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-label={t("auth.logging_in")}
            >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale || "fr", ["common"])),
    },
});
