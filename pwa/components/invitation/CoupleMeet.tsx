import { motion } from "framer-motion";
import { MapPin, Heart } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { PublicWeddingData } from "@/utils/invitationConfig";

interface CoupleMeetProps {
    data: PublicWeddingData;
    formattedDate: string;
}

export default function CoupleMeet({ data, formattedDate }: CoupleMeetProps) {
    const { t } = useTranslation("common");

    return (
        <section className="py-24 bg-white border-b border-neutral-100">
            <div className="max-w-3xl mx-auto px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-neutral-50 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 border border-neutral-100 shadow-sm"
                >
                    <div className="flex -space-x-8 rtl:space-x-reverse relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden bg-primary/20 flex items-center justify-center text-4xl text-primary font-serif font-black shadow-lg">
                            {data.brideName[0]}
                        </div>
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden bg-secondary/20 flex items-center justify-center text-4xl text-secondary font-serif font-black shadow-lg z-10">
                            {data.groomName[0]}
                        </div>
                        <div className="absolute -bottom-4 start-1/2 -translate-x-1/2 z-20 bg-white px-4 py-1 rounded-full shadow-md text-xs font-bold whitespace-nowrap">
                            {formattedDate}
                        </div>
                    </div>
                    <div className="text-center md:text-start flex-1">
                        <h2 className="text-3xl font-black text-neutral-900 mb-2">
                            {data.brideName} &amp; {data.groomName}
                        </h2>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-neutral-500 font-medium mb-6">
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {data.weddingCity}
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4 text-primary" />
                                En couple
                            </div>
                        </div>
                        <p className="text-neutral-600 leading-relaxed max-w-lg mb-6">
                            Nous sommes tellement impatients de partager ce moment unique de notre vie avec vous. Votre présence est notre plus beau cadeau.
                        </p>
                        <Link 
                            href="#rsvp" 
                            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-primary/90 transition-all text-sm"
                        >
                            {t("event.rsvp_btn")}
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
