import { useTranslation } from "next-i18next";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VendorProfileData } from "./ProfileTypes";

interface ProfileHostProps {
    vendor: VendorProfileData;
    rating: number;
}

export default function ProfileHost({ vendor, rating }: ProfileHostProps) {
    const { t } = useTranslation("common");

    const whatsappUrl = vendor.whatsapp 
        ? `https://wa.me/${vendor.whatsapp.replace(/\D/g, '')}`
        : null;

    const contactMessage = encodeURIComponent(`Bonjour, je vous contacte depuis votre profil Farah.ma (${vendor.businessName}). J'aimerais avoir plus de détails concernant une réservation.`);

    return (
        <div className="pb-12 border-b border-neutral-200 mb-12">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center font-black text-2xl text-neutral-900 border border-neutral-200 overflow-hidden ring-4 ring-white shadow-md">
                    {vendor.owner.firstName[0]}
                </div>
                <div>
                    <h3 className="text-2xl font-black text-neutral-900 leading-tight">
                        {t("vendor_profile.host.meet_title", { name: vendor.owner.firstName })}
                    </h3>
                    <p className="text-neutral-500 font-medium">
                        {t("vendor_profile.host.member_since", "Membre depuis")} {new Date(vendor.owner.createdAt).getFullYear()}
                    </p>
                </div>
            </div>
            <div className="flex flex-wrap gap-8 mb-8">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-neutral-900" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-sm font-bold text-neutral-900">{rating} {t("vendor_profile.review_label", "Note")}</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="text-sm font-bold text-neutral-900">{vendor.reviewCount} {t("vendor_profile.reviews_count")}</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-bold text-neutral-900">{t("vendor_profile.highlights.response_time_short", "Réponse: ~1h")}</span>
                </div>
            </div>
            <p className="text-neutral-700 leading-relaxed font-medium">
                {vendor.owner.firstName}{" s\u2019engage à faire de votre événement une réussite totale. \u201cNous mettons un point d\u2019honneur à offrir un service personnalisé pour chaque couple, en veillant aux moindres détails pour que votre grand jour soit parfait.\u201d"}
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
                {whatsappUrl ? (
                    <a
                        href={`${whatsappUrl}?text=${contactMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-12 px-8 rounded-xl border border-neutral-900 bg-white hover:bg-neutral-100 text-neutral-900 flex items-center gap-2 font-bold transition-all active:scale-95"
                    >
                        {t("vendor_profile.host.contact_label")}
                    </a>
                ) : (
                    <Button variant="outline" className="rounded-xl border-neutral-900 h-12 px-8 font-bold hover:bg-neutral-100 flex items-center gap-2" disabled>
                        {t("vendor_profile.host.contact_label")}
                    </Button>
                )}
                {whatsappUrl && (
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-12 px-8 rounded-xl bg-[#25D366] hover:bg-[#20bd5c] text-white flex items-center gap-2 font-bold shadow-md transition-all active:scale-95"
                    >
                        <MessageCircle className="w-5 h-5 fill-current" />
                        {t("vendor_profile.host.contact")}
                    </a>
                )}
            </div>
        </div>
    );
}
