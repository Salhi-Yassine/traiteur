import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useTranslation } from "next-i18next";
import { cn } from "@/lib/utils";

interface OurStoryProps {
    story: string | undefined;
    fontTitle: string;
}

export default function OurStory({ story, fontTitle }: OurStoryProps) {
    const { t } = useTranslation("common");

    if (!story) return null;

    return (
        <section className="py-32 bg-white overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <Heart className="w-8 h-8 text-primary mx-auto mb-8" />
                    <h2 className={cn("text-5xl md:text-6xl font-black mb-12", fontTitle)}>
                        {t("dashboard.event.story")}
                    </h2>
                    <div className="relative">
                        <span className="absolute -top-10 -start-10 text-9xl text-neutral-50 font-serif opacity-50 z-0">“</span>
                        <p className="text-xl md:text-2xl text-neutral-600 leading-relaxed italic font-serif relative z-10">
                            {story}
                        </p>
                        <span className="absolute -bottom-20 -end-10 text-9xl text-neutral-50 font-serif opacity-50 z-0">”</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
