import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, MapPin, Building2, Store, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WeddingStory } from "./WeddingStoryCard";
import { Button } from "../ui/button";

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
                            className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-110 md:text-[#1A1A1A] md:bg-[#F7F7F7] md:hover:bg-[#EBEBEB]"
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

                            {/* Simple Gallery Stack */}
                            <div className="grid grid-cols-1 gap-6">
                                {story.gallery.map((img, i) => (
                                    <div key={i} className="relative aspect-video w-full rounded-[2rem] overflow-hidden shadow-sm">
                                        <Image src={img} alt="" fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Vendor Showcase ("Shop the Look") */}
                        <div className="w-full md:w-[380px] bg-[#F7F7F7] p-8 md:p-12 flex flex-col gap-8 border-l border-[#EBEBEB] overflow-y-auto">
                            <div className="space-y-2">
                                <h3 className="font-display text-[28px] text-[#1A1A1A]">Shop the look</h3>
                                <p className="text-[14px] text-[#717171]">The professionals who made this dream a reality.</p>
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
                                                <p className="text-[13px] text-[#717171] mt-0.5">Verified Partner</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto pt-8 border-t border-[#DDDDDD] hidden md:block">
                                <Button className="w-full rounded-full h-14 font-bold text-[15px]" variant="secondary">
                                    Plan your wedding with us
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
