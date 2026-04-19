import { useState } from "react";
import { Wifi, Wind, Car, Utensils, Sparkles, ShieldCheck } from "lucide-react";
import { useTranslation } from "next-i18next";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

export default function ProfileAmenities() {
    const { t } = useTranslation("common");
    const [showAllAmenities, setShowAllAmenities] = useState(false);

    const allAmenities = [
        { icon: Wifi, label: t("vendor_profile.amenities.wifi") },
        { icon: Wind, label: t("vendor_profile.amenities.ac") },
        { icon: Car, label: t("vendor_profile.amenities.parking") },
        { icon: Utensils, label: t("vendor_profile.amenities.kitchen") },
        { icon: Sparkles, label: t("vendor_profile.amenities.cleaning") },
        { icon: ShieldCheck, label: t("vendor_profile.amenities.security") },
    ];

    const visible = showAllAmenities ? allAmenities : allAmenities.slice(0, 4);

    return (
        <div className="pb-12 border-b border-neutral-200 mb-12">
            <h3 className="font-display text-3xl font-black text-neutral-900 mb-8 tracking-tight">
                {t("vendor_profile.amenities.title")}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 md:grid-cols-2">
                {visible.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                        <item.icon className="w-6 h-6 text-neutral-500" strokeWidth={1.5} />
                        <span className="text-neutral-700 font-medium">{item.label}</span>
                    </div>
                ))}
            </div>

            <Drawer>
                <DrawerTrigger asChild>
                    <Button variant="outline" className="md:hidden mt-8 rounded-xl border-neutral-900 h-12 px-8 font-bold hover:bg-neutral-100 transition-all shadow-sm w-full">
                        {t("vendor_profile.amenities.show_all")}
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="px-6 py-4">
                    <DrawerHeader className="ps-0 pb-4 border-b border-neutral-100">
                        <DrawerTitle>{t("vendor_profile.amenities.title")}</DrawerTitle>
                    </DrawerHeader>
                    <div className="py-6 overflow-y-auto max-h-[60vh]">
                        <div className="flex flex-col gap-y-6">
                            {allAmenities.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <item.icon className="w-6 h-6 text-neutral-500" strokeWidth={1.5} />
                                    <span className="text-neutral-700 font-medium">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>

            <Button
                variant="outline"
                onClick={() => setShowAllAmenities(prev => !prev)}
                className="hidden md:flex mt-10 rounded-xl border-neutral-900 h-12 px-8 font-bold hover:bg-neutral-100 transition-all shadow-sm"
            >
                {showAllAmenities ? t("vendor_profile.amenities.show_less") : t("vendor_profile.amenities.show_all")}
            </Button>
        </div>
    );
}
