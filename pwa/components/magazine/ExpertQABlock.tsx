import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, Star } from "lucide-react";
import { useState } from "react";

const BLUR_PLACEHOLDER =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

export interface ExpertProfile {
    name: string;
    title: string;
    yearsExperience: number;
    avatarUrl: string;
    quote: string;
    qa: Array<{ question: string; answer: string }>;
}

interface ExpertQABlockProps {
    expert: ExpertProfile;
}

export default function ExpertQABlock({ expert }: ExpertQABlockProps) {
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="my-12 bg-gradient-to-br from-neutral-50 to-white border border-neutral-100 rounded-[2.5rem] overflow-hidden shadow-sm"
        >
            {/* Expert Header */}
            <div className="flex items-center gap-6 p-8 border-b border-neutral-100">
                <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 ring-2 ring-primary/20">
                    <Image
                        src={expert.avatarUrl}
                        alt={expert.name}
                        fill
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                        sizes="64px"
                    />
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                            🎤 Expert en résidence
                        </span>
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                            ))}
                        </div>
                    </div>
                    <p className="font-semibold text-neutral-900 text-[15px]">{expert.name}</p>
                    <p className="text-neutral-500 text-[13px]">
                        {expert.title} · {expert.yearsExperience} ans d&apos;expérience
                    </p>
                </div>
            </div>

            {/* Expert Quote */}
            <blockquote className="px-8 py-6 text-[17px] font-display text-neutral-700 leading-relaxed border-b border-neutral-100 italic">
                &ldquo;{expert.quote}&rdquo;
            </blockquote>

            {/* Q&A Accordion */}
            <div className="p-8 space-y-3">
                <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-5 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Questions fréquentes
                </p>
                {expert.qa.map((item, idx) => (
                    <div key={idx} className="border border-neutral-100 rounded-2xl overflow-hidden">
                        <button
                            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                            className="w-full text-start px-6 py-4 flex items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
                        >
                            <span className="font-semibold text-[14px] text-neutral-800">
                                {item.question}
                            </span>
                            <motion.span
                                animate={{ rotate: openIdx === idx ? 45 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-neutral-400 text-xl shrink-0 leading-none"
                            >
                                +
                            </motion.span>
                        </button>
                        <motion.div
                            initial={false}
                            animate={openIdx === idx ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                            className="overflow-hidden"
                        >
                            <p className="px-6 pb-5 text-[14px] text-neutral-600 leading-relaxed">
                                {item.answer}
                            </p>
                        </motion.div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
