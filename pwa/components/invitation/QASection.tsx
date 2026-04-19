import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useTranslation } from "next-i18next";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QASectionProps {
    qa: { question: string; answer: string }[];
    fontTitle: string;
}

export default function QASection({ qa, fontTitle }: QASectionProps) {
    const { t } = useTranslation("common");
    const [openQA, setOpenQA] = useState<number | null>(null);

    if (!qa || qa.length === 0) return null;

    return (
        <section className="py-32 bg-white">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-20">
                    <Badge variant="outline" className="mb-4 text-primary border-primary/20">
                        {t("dashboard.event.qa").toUpperCase()}
                    </Badge>
                    <h2 className={cn("text-5xl font-black text-neutral-900", fontTitle)}>
                        {t("dashboard.event.qa")}
                    </h2>
                </div>

                <div className="space-y-4">
                    {qa.map((item, idx) => (
                        <div key={idx} className="border-b border-neutral-100 last:border-0">
                            <button
                                onClick={() => setOpenQA(openQA === idx ? null : idx)}
                                className="w-full py-8 flex items-center justify-between text-start group"
                            >
                                <h4 className="font-display text-xl font-bold group-hover:text-primary transition-colors">
                                    {item.question}
                                </h4>
                                <div className={cn(
                                    "w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center transition-transform", 
                                    openQA === idx ? "rotate-45" : ""
                                )}>
                                    <Plus className="w-4 h-4" />
                                </div>
                            </button>
                            <AnimatePresence>
                                {openQA === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="pb-8 text-neutral-500 leading-relaxed">
                                            {item.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
