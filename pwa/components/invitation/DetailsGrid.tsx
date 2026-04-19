import { MapPin, Gift } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { Badge } from "@/components/ui/badge";
import { PublicWeddingData } from "@/utils/invitationConfig";

interface DetailsGridProps {
    data: PublicWeddingData;
}

export default function DetailsGrid({ data }: DetailsGridProps) {
    const { t } = useTranslation("common");

    return (
        <section className="py-32 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Registry */}
            <div className="bg-[#1A1A1A] text-white p-12 rounded-[3rem] relative overflow-hidden group">
                <div className="absolute top-0 end-0 p-8 transform group-hover:scale-110 transition-transform">
                    <Gift className="w-24 h-24 text-white/10" />
                </div>
                <div className="relative z-10 space-y-6">
                    <Badge className="bg-primary/20 text-primary border-transparent">
                        {t("event.registry_label").toUpperCase()}
                    </Badge>
                    <h3 className="font-display text-4xl font-bold">{t("event.registry_title")}</h3>
                    <p className="text-white/60 text-lg max-w-md leading-relaxed">
                        {t("event.registry_desc")}
                    </p>
                    <Link
                        href={data.registryUrl || "#"}
                        className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-neutral-100 transition-all shadow-xl shadow-black/20"
                    >
                        {t("event.registry_btn")} →
                    </Link>
                </div>
            </div>

            {/* Accomodation & Travel */}
            <div className="bg-primary/5 p-12 rounded-[3rem] relative overflow-hidden group border border-primary/10">
                <div className="absolute top-0 end-0 p-8 transform group-hover:scale-110 transition-transform">
                    <MapPin className="w-24 h-24 text-primary/10" />
                </div>
                <div className="relative z-10 space-y-6">
                    <Badge className="bg-primary/10 text-primary border-transparent">
                        {t("event.accommodation_label").toUpperCase()}
                    </Badge>
                    <h3 className="font-display text-4xl font-bold text-neutral-900">{t("event.accommodation_title")}</h3>
                    
                    <div className="space-y-6">
                        <p className="text-neutral-500 text-lg max-w-md leading-relaxed">
                            {data.accommodationInfo || t("event.accommodation_fallback")}
                        </p>

                        {data.travelInfo && (
                            <div className="pt-6 border-t border-primary/10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">
                                    {t("dashboard.event.travel")}
                                </p>
                                <p className="text-neutral-500 text-sm leading-relaxed">
                                    {data.travelInfo}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-8">
                        <span className="bg-white px-4 py-2 rounded-full text-xs font-bold shadow-sm border border-neutral-100">Four Seasons ★★★★★</span>
                        <span className="bg-white px-4 py-2 rounded-full text-xs font-bold shadow-sm border border-neutral-100">Pestana CR7 ★★★★</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
