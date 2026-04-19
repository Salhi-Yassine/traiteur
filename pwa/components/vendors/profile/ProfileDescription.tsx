import { useTranslation } from "next-i18next";
import { ChevronRight } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { VendorProfileData } from "./ProfileTypes";

interface ProfileDescriptionProps {
    vendor: VendorProfileData;
}

export default function ProfileDescription({ vendor }: ProfileDescriptionProps) {
    const { t } = useTranslation("common");

    return (
        <div className="pb-12 border-b border-neutral-200 mb-12">
            <div className="pb-8 border-b border-neutral-200 mb-8">
                <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-neutral-900 leading-tight">
                            {vendor.category} {t("common.in", "à")} {t(`search_bar.cities.${vendor.cities[0]?.slug}`, vendor.cities[0]?.name)}
                        </h2>
                        <p className="text-neutral-500 font-medium">
                            {vendor.maxGuests ? t("vendor_profile.capacity_max", { max: vendor.maxGuests }) : t("vendor_profile.all_events", 'Tous types d\'événements')}
                        </p>
                    </div>
                    <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-7 h-7 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                </div>
            </div>

            {vendor.tagline && (
                <p className="text-xl font-black text-neutral-900 italic mb-6">&quot;{vendor.tagline}&quot;</p>
            )}
            <p className="text-neutral-700 leading-relaxed text-lg font-medium whitespace-pre-wrap md:line-clamp-none line-clamp-4">
                {vendor.description}
            </p>
            <Drawer>
                <DrawerTrigger asChild>
                    <button className="mt-4 flex items-center gap-1.5 text-neutral-900 font-black underline underline-offset-4 hover:decoration-2 md:hidden">
                        {t("common.read_more", "En savoir plus")}
                        <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                </DrawerTrigger>
                <DrawerContent className="px-6 py-4">
                    <DrawerHeader className="ps-0 pb-4 border-b border-neutral-100">
                        <DrawerTitle>{t("vendor_profile.about.title", "À propos")}</DrawerTitle>
                    </DrawerHeader>
                    <div className="py-6 overflow-y-auto max-h-[60vh] text-neutral-700 leading-relaxed font-medium whitespace-pre-wrap">
                        {vendor.description}
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
