import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Heart } from "lucide-react";
import PlanningLayout from "../../components/layout/PlanningLayout";
import VendorCard from "../../components/vendors/VendorCard";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { useSavedVendors } from "../../lib/useSavedVendors";
import { PATHS } from "../../constants/paths";
import type { SavedVendor } from "../../types/api";

function SavedVendorGrid({ savedVendors, onToggle }: {
    savedVendors: SavedVendor[];
    onToggle: (vendorProfileId: number) => void;
}) {
    return (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {savedVendors.map(({ id, vendorProfile: v }) => (
                <VendorCard
                    key={id}
                    id={v.id}
                    slug={v.slug}
                    businessName={v.businessName}
                    tagline={v.tagline}
                    cities={v.cities?.map((c) => ({ name: c.name, slug: c.slug }))}
                    category={v.category ?? { name: "", slug: "" }}
                    priceRange={v.priceRange}
                    startingPrice={v.startingPrice ?? null}
                    coverImageUrl={v.coverImageUrl}
                    averageRating={v.averageRating ? parseFloat(v.averageRating) : undefined}
                    reviewCount={v.reviewCount}
                    isVerified={v.isVerified}
                    isFavorite
                    onFavoriteToggle={() => onToggle(v.id)}
                />
            ))}
        </div>
    );
}

function EmptyMoodboard() {
    const { t } = useTranslation("common");

    return (
        <div className="flex flex-col items-center justify-center text-center py-24 px-6 bg-white rounded-[24px] shadow-1">
            <div className="bg-[#FEF0ED] rounded-full p-5 mb-6">
                <Heart className="w-10 h-10 text-primary" strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-2xl text-[#1A1A1A] mb-2">
                {t("saved_vendors.empty_title")}
            </h2>
            <p className="text-[#717171] text-[15px] max-w-md mb-8">
                {t("saved_vendors.empty_description")}
            </p>
            <Button asChild>
                <Link href={PATHS.VENDORS}>{t("saved_vendors.empty_cta")}</Link>
            </Button>
        </div>
    );
}

export default function SavedVendorsPage() {
    const { t } = useTranslation("common");
    const { savedVendors, isLoading, toggleSave } = useSavedVendors();

    return (
        <PlanningLayout
            title={t("saved_vendors.title")}
            description={t("saved_vendors.description")}
        >
            <Head>
                <title>{t("saved_vendors.title")} — Farah.ma</title>
            </Head>

            {isLoading ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="aspect-[4/3] w-full rounded-[28px]" />
                            <Skeleton className="h-5 w-2/3" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            ) : savedVendors.length === 0 ? (
                <EmptyMoodboard />
            ) : (
                <SavedVendorGrid savedVendors={savedVendors} onToggle={toggleSave} />
            )}
        </PlanningLayout>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale || "fr", ["common"])),
    },
});
