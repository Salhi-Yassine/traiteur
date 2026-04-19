import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useTranslation } from "next-i18next";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TimelineItem, ICON_MAP } from "@/utils/invitationConfig";

interface WeddingTimelineProps {
    items: TimelineItem[];
    fontTitle: string;
    bgLight: string;
}

export default function WeddingTimeline({ 
    items, 
    fontTitle, 
    bgLight 
}: WeddingTimelineProps) {
    const { t } = useTranslation("common");

    if (!items || items.length === 0) return null;

    return (
        <section className={cn("py-32", bgLight)}>
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-20">
                    <Badge variant="primary" className="mb-4">{t("event.programme_label").toUpperCase()}</Badge>
                    <h2 className={cn("text-5xl font-black text-neutral-900 leading-tight", fontTitle)}>
                        {t("event.programme_title")}
                    </h2>
                </div>

                <div className="relative border-s-2 border-primary/20 ms-6 md:ms-0 md:flex md:flex-col md:items-center">
                    {items.map((item, idx) => {
                        const IconComp = ICON_MAP[item.icon || "clock"] || Clock;
                        return (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className={cn(
                                    "relative md:w-[600px] mb-16 ps-12 md:ps-0",
                                    idx % 2 === 0 ? "md:me-auto md:pe-24 md:text-end" : "md:ms-auto md:ps-24 md:text-start"
                                )}
                            >
                                {/* Timeline Node */}
                                <div className="absolute start-[-11px] md:start-1/2 md:-translate-x-1/2 top-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 ring-8 ring-white">
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                </div>
                                
                                <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-black/5 hover:shadow-black/10 transition-shadow">
                                    <div className={cn("flex items-center gap-4 mb-4", idx % 2 === 0 ? "md:flex-row-reverse" : "")}>
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                            <IconComp className="w-6 h-6" />
                                        </div>
                                        <span className="text-primary font-black tracking-widest text-lg">{item.time}</span>
                                    </div>
                                    <h4 className={cn("text-2xl font-bold text-neutral-900 mb-2", fontTitle)}>{item.title}</h4>
                                    <p className="text-neutral-500 leading-relaxed text-sm">{item.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
