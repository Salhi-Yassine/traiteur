import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import apiClient from "../../utils/apiClient";
import RSVPFlow, { GuestData } from "../../components/guest/RSVPFlow";

const FALLBACK_GUEST: GuestData = {
    fullName: "Yassine Salhi",
    rsvpStatus: "pending",
    guestToken: "fallback-token"
};

export default function RSVPPage({ initialGuest }: { initialGuest: GuestData | null }) {
    const { t } = useTranslation("common");
    const data = initialGuest || FALLBACK_GUEST;

    return (
        <div className="min-h-screen bg-white md:bg-neutral-50 flex items-center justify-center p-0 md:p-6 selection:bg-primary/20">
            <Head>
                <title>{t("rsvp.page_title")} — Farah.ma</title>
            </Head>

            <div className="w-full max-w-xl bg-white md:rounded-[3rem] md:shadow-2xl md:shadow-black/5 overflow-hidden flex flex-col min-h-screen md:min-h-0 relative">
                
                {/* Background Blobs (Premium Touch) */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <RSVPFlow initialGuest={data} />
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
    try {
        const { token } = params as { token: string };
        const response = await apiClient.get(`/api/public/guests/${token}`);
        
        return {
            props: {
                initialGuest: response,
                ...(await serverSideTranslations(locale || "fr", ["common"])),
            },
        };
    } catch (error) {
        return {
            props: {
                initialGuest: null,
                ...(await serverSideTranslations(locale || "fr", ["common"])),
            },
        };
    }
};
