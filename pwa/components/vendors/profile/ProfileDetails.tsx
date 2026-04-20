import { useState, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { MapPin, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { VendorProfileData } from "./ProfileTypes";

interface ProfileDetailsProps {
    vendor: VendorProfileData;
}

export default function ProfileDetails({ vendor }: ProfileDetailsProps) {
    const { t } = useTranslation("common");
    const [kbygDrawer, setKbygDrawer] = useState<'rules' | 'safety' | 'cancellation' | null>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = useMemo(() => [
        { q: "Quelles sont vos conditions de réservation ?", a: `Pour valider la date, nous demandons un acompte de 30% du montant global. Le reste est réglable 1 semaine avant l'événement.` },
        { q: "Est-il possible de faire une dégustation ?", a: `Absolument. Une fois la réservation confirmée, nous organisons une séance de dégustation complète de votre menu.` },
        { q: "Proposez-vous des menus végétariens ou spéciaux ?", a: `Oui, notre chef peut adapter le menu pour inclure des options végétariennes, sans gluten ou selon vos exigences diététiques spécifiques.` },
        { q: "Quelle est votre capacité maximale ?", a: `Notre domaine peut accueillir jusqu'à 600 invités en format dîner assis et 800 personnes en format cocktail.` }
    ], []);

    return (
        <div className="space-y-12">
            {/* Location Section */}
            <div id="location" className="pb-12 border-b border-neutral-200 scroll-mt-24">
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                        <h3 className="font-display text-3xl font-black text-neutral-900 tracking-tight">
                            {t("vendor_profile.location.title", "Localisation")}
                        </h3>
                        <p className="text-neutral-500 font-medium flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-primary" />
                            {vendor.cities[0]?.name}, Maroc
                        </p>
                    </div>
                </div>
                
                <div className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden shadow-lg border-4 border-white ring-1 ring-neutral-200">
                    <iframe
                        className="w-full h-full border-0"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(vendor.businessName + ' ' + (vendor.cities[0]?.name || ''))}&output=embed`}
                    />
                </div>
            </div>

            {/* Know Before You Go Section */}
            <div className="pb-12 border-b border-neutral-200">
                 <h3 className="font-display text-3xl font-black text-neutral-900 tracking-tight">
                    {t("vendor_profile.know_before_you_go.title")}
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                    <div className="space-y-4">
                        <h4 className="font-bold text-neutral-900 uppercase text-[10px] tracking-widest font-black">
                            {t("vendor_profile.know_before_you_go.house_rules")}
                        </h4>
                        <ul className="space-y-3 text-neutral-600 font-medium text-sm">
                            <li>{t("vendor_profile.rules.check_in")}</li>
                            <li>{t("vendor_profile.rules.check_out")}</li>
                            <li>{t("vendor_profile.rules.parties")}</li>
                            <li>{t("vendor_profile.rules.smoking")}</li>
                        </ul>
                        <button onClick={() => setKbygDrawer('rules')} className="text-sm font-black underline underline-offset-4 pt-2">
                            {t("common.show_more")}
                        </button>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-bold text-neutral-900 uppercase text-[10px] tracking-widest font-black">
                            {t("vendor_profile.know_before_you_go.safety")}
                        </h4>
                        <ul className="space-y-3 text-neutral-600 font-medium text-sm">
                            <li>{t("vendor_profile.safety.exits")}</li>
                            <li>{t("vendor_profile.safety.alarm")}</li>
                            <li>{t("vendor_profile.safety.capacity")}</li>
                        </ul>
                        <button onClick={() => setKbygDrawer('safety')} className="text-sm font-black underline underline-offset-4 pt-2">
                            {t("common.show_more")}
                        </button>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-bold text-neutral-900 uppercase text-[10px] tracking-widest font-black">
                            {t("vendor_profile.know_before_you_go.cancellation")}
                        </h4>
                        <p className="text-neutral-600 font-medium text-sm leading-relaxed">
                            {t("vendor_profile.cancellation.standard_desc")}
                        </p>
                        <button onClick={() => setKbygDrawer('cancellation')} className="text-sm font-black underline underline-offset-4 pt-2">
                            {t("common.show_more")}
                        </button>
                    </div>
                 </div>

                 {/* KBYG Drawer */}
                 <Drawer open={kbygDrawer !== null} onOpenChange={(open) => { if (!open) setKbygDrawer(null); }}>
                    <DrawerContent className="px-6 py-4">
                        <DrawerHeader className="ps-0 pb-4 border-b border-neutral-100">
                            <DrawerTitle>
                                {kbygDrawer === 'rules' && t("vendor_profile.know_before_you_go.house_rules")}
                                {kbygDrawer === 'safety' && t("vendor_profile.know_before_you_go.safety")}
                                {kbygDrawer === 'cancellation' && t("vendor_profile.know_before_you_go.cancellation")}
                            </DrawerTitle>
                        </DrawerHeader>
                        <div className="py-6 overflow-y-auto max-h-[60vh]">
                            {kbygDrawer === 'rules' && (
                                <ul className="space-y-4 text-neutral-700 font-medium">
                                    <li>{t("vendor_profile.rules.check_in")}</li>
                                    <li>{t("vendor_profile.rules.check_out")}</li>
                                    <li>{t("vendor_profile.rules.parties")}</li>
                                    <li>{t("vendor_profile.rules.smoking")}</li>
                                </ul>
                            )}
                            {kbygDrawer === 'safety' && (
                                <ul className="space-y-4 text-neutral-700 font-medium">
                                    <li>{t("vendor_profile.safety.exits")}</li>
                                    <li>{t("vendor_profile.safety.alarm")}</li>
                                    <li>{t("vendor_profile.safety.capacity")}</li>
                                </ul>
                            )}
                            {kbygDrawer === 'cancellation' && (
                                <p className="text-neutral-700 font-medium leading-relaxed">
                                    {t("vendor_profile.cancellation.standard_desc")}
                                </p>
                            )}
                        </div>
                    </DrawerContent>
                 </Drawer>
            </div>

            {/* FAQ Section */}
            <div className="py-12 border-t border-neutral-200">
                <h3 className="font-display text-3xl font-black text-neutral-900 mb-8">{t("vendor_profile.faq.title")}</h3>
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="border border-neutral-200 rounded-2xl overflow-hidden bg-white hover:border-neutral-300 transition-colors">
                            <button 
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className="w-full text-start px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                            >
                                <span className="font-bold text-neutral-900 select-none">{faq.q}</span>
                                <ChevronDown className={cn("w-5 h-5 text-neutral-500 shrink-0 transition-transform duration-300", openFaq === idx && "rotate-180")} />
                            </button>
                            <div className={cn("px-6 overflow-hidden transition-all duration-300", openFaq === idx ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0")}>
                                <p className="text-neutral-600 leading-relaxed">{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
