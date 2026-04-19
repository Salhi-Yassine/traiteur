import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "next-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HoneyFundItem } from "@/utils/invitationConfig";

interface HoneyFundRegistryProps {
    honeyFunds: HoneyFundItem[];
    fontTitle: string;
    onFundSelect: (fund: HoneyFundItem) => void;
}

export default function HoneyFundRegistry({ 
    honeyFunds, 
    fontTitle, 
    onFundSelect 
}: HoneyFundRegistryProps) {
    const { t } = useTranslation("common");

    if (!honeyFunds || honeyFunds.length === 0) return null;

    return (
        <section className="py-32 bg-neutral-50/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-end justify-between mb-12">
                    <div className="max-w-xl">
                        <Badge variant="outline" className="mb-4 text-primary border-primary/20 tracking-widest">
                            {t("event.registry_label", "REGISTRE DE CADEAUX")}
                        </Badge>
                        <h2 className={cn("text-5xl font-black text-neutral-900 leading-tight", fontTitle)}>
                            {t("event.registry_title", "Contribuer à notre Lune de Miel")}
                        </h2>
                    </div>
                    <div className="hidden md:flex gap-2">
                        <div className="p-3 rounded-full border border-neutral-200 bg-white text-neutral-400 cursor-not-allowed opacity-50">
                            <ChevronLeft className="w-5 h-5 rtl:-scale-x-100" />
                        </div>
                        <div className="p-3 rounded-full border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 transition-colors cursor-pointer">
                            <ChevronRight className="w-5 h-5 rtl:-scale-x-100" />
                        </div>
                    </div>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="flex gap-6 overflow-x-auto pb-8 -mx-6 px-6 no-scrollbar snap-x snap-mandatory">
                    {honeyFunds.map((fund) => (
                        <motion.div 
                            key={fund.id}
                            whileHover={{ y: -10 }}
                            className="relative flex-none w-[300px] md:w-[400px] aspect-[4/5] rounded-[2.5rem] overflow-hidden group snap-start cursor-pointer transition-shadow hover:shadow-2xl hover:shadow-black/10"
                            onClick={() => onFundSelect(fund)}
                        >
                            <Image 
                                src={fund.image} 
                                alt={fund.title} 
                                fill 
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Glass Overlay Logic */}
                            <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                <div className="flex flex-col gap-1">
                                    <Badge className="w-fit bg-primary text-white border-0 text-[10px] mb-2">
                                        {fund.contributionCount} {t("event.contributions", "CONTRIBUTIONS")}
                                    </Badge>
                                    <h3 className="text-2xl font-black text-white">{fund.title}</h3>
                                    <p className="text-white/80 text-sm line-clamp-2">{fund.description}</p>
                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">
                                                {t("event.target", "OBJECTIF")}
                                            </span>
                                            <span className="text-white font-bold text-xl">{fund.targetAmount}€</span>
                                        </div>
                                        <Button className="bg-white text-black hover:bg-neutral-100 rounded-2xl font-bold text-xs ring-offset-black transition-all group-hover:px-8">
                                            {t("event.gift_now", "OFFRIR")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
