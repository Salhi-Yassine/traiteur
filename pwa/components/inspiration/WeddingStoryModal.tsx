import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, MapPin, Building2, Store, ExternalLink, Clock, Sparkles, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WeddingStory } from "./WeddingStoryCard";
import { Button } from "../ui/button";
import { useTranslation } from "next-i18next";
import { cn } from "@/lib/utils";

interface WeddingStoryModalProps {
    story: WeddingStory | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function WeddingStoryModal({ story, isOpen, onClose }: WeddingStoryModalProps) {
    // Prevent scroll on body when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const { t } = useTranslation("common");

    if (!story) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-neutral-900/90 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 end-6 z-50 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-110 md:text-[#1A1A1A] md:bg-[#F7F7F7] md:hover:bg-[#EBEBEB]"
                        >
                            <X size={24} />
                        </button>

                        {/* Left Side: Editorial Content */}
                        <div className="flex-1 overflow-y-auto scrollbar-hide p-8 md:p-16 space-y-12">
                            {/* Header */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-[#E8472A] font-bold text-[13px] uppercase tracking-widest">
                                    <MapPin size={16} />
                                    {story.location}
                                </div>
                                <h2 className="font-display text-[48px] md:text-[64px] text-[#1A1A1A] leading-[1.05]">
                                    {story.coupleNames}
                                </h2>
                                <p className="text-[18px] md:text-[20px] text-[#717171] font-medium italic">
                                    "{story.vibe}"
                                </p>
                            </div>

                            {/* Description */}
                            <div className="prose prose-neutral max-w-none">
                                <p className="text-[17px] leading-relaxed text-[#484848]">
                                    {story.description}
                                </p>
                            </div>

                            {/* Celebration Timeline */}
                            {story.celebrationTimeline && story.celebrationTimeline.length > 0 && (
                                <div className="space-y-12 py-12 border-y border-[#F1F1F1]">
                                    <div className="space-y-2">
                                        <h3 className="font-display text-[32px] text-[#1A1A1A]">
                                            {t("inspiration.celebration_flow")}
                                        </h3>
                                        <p className="text-[14px] text-[#717171] uppercase font-bold tracking-widest flex items-center gap-2">
                                            <Sparkles size={14} className="text-[#E8472A]" />
                                            {t("inspiration.anatomy_of_the_day")}
                                        </p>
                                    </div>

                                    <div className="space-y-10 relative before:absolute before:start-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-neutral-200">
                                        {story.celebrationTimeline?.map((item: any, i: number) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                className="relative ps-12 space-y-2 group"
                                            >
                                                <div className="absolute start-0 top-1 w-[24px] h-[24px] rounded-full bg-white border-2 border-[#E8472A] group-hover:bg-[#E8472A] group-hover:scale-110 transition-all z-10" />
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className="px-3 py-1 bg-[#FEF0ED] rounded-full text-[11px] font-black text-[#E8472A] flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {item.time}
                                                    </span>
                                                    <h4 className="font-display text-xl text-[#1A1A1A]">{item.event}</h4>
                                                </div>
                                                <p className="text-[15px] text-[#717171] leading-relaxed max-w-xl">
                                                    {item.description}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Simple Gallery Stack */}
                            <div className="grid grid-cols-1 gap-6">
                                {story.gallery.map((img, i) => (
                                    <div key={i} className="relative aspect-video w-full rounded-[2rem] overflow-hidden shadow-sm">
                                        <Image 
                                            src={img.startsWith('http') ? img : `/images/inspiration/${img}.png`} 
                                            alt="" 
                                            fill 
                                            className="object-cover" 
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* End Side: Vendor Showcase ("Shop the Look") */}
                        <div className="w-full md:w-[380px] bg-[#F7F7F7] p-8 md:p-12 flex flex-col gap-8 border-s border-[#EBEBEB] overflow-y-auto">
                            <div className="space-y-2">
                                <h3 className="font-display text-[28px] text-[#1A1A1A]">{t("inspiration.shop_the_look")}</h3>
                                <p className="text-[14px] text-[#717171]">{t("inspiration.vendors_made_it")}</p>
                            </div>

                            <div className="space-y-4">
                                {story.vendorCredits.map((vendor, i) => (
                                    <div 
                                        key={i} 
                                        className="group bg-white p-5 rounded-2xl shadow-sm border border-transparent hover:border-[#E8472A]/20 transition-all"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[11px] font-bold text-[#717171] uppercase tracking-widest">
                                                {vendor.role}
                                            </span>
                                            {vendor.slug && (
                                                <Link 
                                                    href={`/vendors/${vendor.slug}`}
                                                    className="w-8 h-8 rounded-full bg-[#FEF0ED] flex items-center justify-center text-[#E8472A] opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <ExternalLink size={14} />
                                                </Link>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-[#F7F7F7] flex items-center justify-center text-[#B0B0B0]">
                                                {vendor.role === "Venue" ? <Building2 size={24} /> : <Store size={24} />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#1A1A1A] leading-tight group-hover:text-[#E8472A] transition-colors">
                                                    {vendor.name}
                                                </h4>
                                                <p className="text-[13px] text-[#717171] mt-0.5">{t("inspiration.verified_partner")}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto pt-8 border-t border-[#DDDDDD] hidden md:block">
                                <Button className="w-full rounded-full h-14 font-bold text-[15px]" variant="secondary">
                                    {t("inspiration.plan_with_us")}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
