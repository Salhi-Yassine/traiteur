import Image from "next/image";
import { Heart, MapPin, ExternalLink, Calendar, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "next-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn, getInspirationImageUrl } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/utils/apiClient";
import { useColorSignature } from "@/hooks/useColorSignature";

export interface InspirationPhoto {
    id: number;
    imagePath: string;
    caption: string;
    style: string;
    "@id": string;
    category?: { name: string; slug: string };
    city?: { name: string; slug: string };
    vendor?: {
        "@id": string;
        businessName: string;
        slug: string;
        coverImageUrl?: string;
        category?: { name: string };
    };
}

interface InspirationPhotoModalProps {
    photo: InspirationPhoto | null;
    isOpen: boolean;
    onClose: () => void;
    isSaved?: boolean;
    toggleSave?: () => void;
}

export default function InspirationPhotoModal({
    photo,
    isOpen,
    onClose,
    isSaved,
    toggleSave
}: InspirationPhotoModalProps) {
    const { t } = useTranslation("common");
    const { palette, isExtracting } = useColorSignature(photo?.imagePath || null);

    if (!photo) return null;

    const imageUrl = photo.imagePath.startsWith('http')
        ? photo.imagePath
        : getInspirationImageUrl(photo.imagePath);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl p-0 overflow-hidden rounded-[2rem] border-none bg-white shadow-2xl">
                <div className="flex flex-col md:flex-row h-full max-h-[90vh]">

                    {/* Start: Image Canvas */}
                    <div className="relative flex-[1.4] bg-neutral-100 min-h-[400px] md:min-h-0">
                        <Image
                            src={imageUrl}
                            alt={photo.caption}
                            fill
                            className="object-cover"
                            priority
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleSave?.();
                            }}
                            className={cn(
                                "absolute top-6 start-6 p-4 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-lg",
                                isSaved
                                    ? "bg-[#E8472A] border-[#E8472A] text-white"
                                    : "bg-white/40 border-white/20 text-white hover:bg-white/60"
                            )}
                        >
                            <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
                        </button>
                    </div>

                    {/* End: Editorial & Shop */}
                    <div className="flex-1 flex flex-col bg-white p-8 md:p-12 overflow-y-auto">
                        <div className="flex flex-col h-full space-y-10">

                            {/* Metadata */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-[#F7F7F7] text-[#1A1A1A] text-[10px] font-bold uppercase tracking-widest rounded-full">
                                        {photo.style}
                                    </span>
                                    {photo.city && (
                                        <div className="flex items-center gap-1.5 text-[#717171] text-[12px] font-medium">
                                            <MapPin size={14} className="text-[#E8472A]" />
                                            {photo.city.name}
                                        </div>
                                    )}
                                </div>
                                <DialogTitle className="font-display text-4xl md:text-5xl text-[#1A1A1A] leading-tight">
                                    {photo.caption}
                                </DialogTitle>
                            </div>

                            {/* Section: AI Color Signature */}
                            <div className="space-y-6">
                                <h5 className="font-bold text-[13px] uppercase tracking-widest text-[#1A1A1A] flex items-center gap-2">
                                    <Sparkles size={14} className="text-[#E8472A]" />
                                    {t("inspiration.color_signature")}
                                </h5>
                                <div className="flex items-center gap-3">
                                    {isExtracting ? (
                                        Array(5).fill(0).map((_, i) => (
                                            <div key={i} className="w-12 h-12 rounded-2xl bg-neutral-100 animate-pulse" />
                                        ))
                                    ) : (
                                        palette.map((color, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    navigator.clipboard.writeText(color);
                                                    toast.success(`${t("inspiration.copied")}: ${color}`);
                                                }}
                                                className="group relative w-12 h-12 rounded-2xl transition-all hover:scale-110 shadow-sm border border-black/5"
                                                style={{ backgroundColor: color }}
                                                title={t("inspiration.copy_hex")}
                                            >
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity text-[10px] text-white font-bold">
                                                    HEX
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                                <p className="text-[12px] text-[#717171]">{t("inspiration.palette_desc")}</p>
                            </div>

                            {/* Section: Shop the Look / Vendor */}
                            {photo.vendor ? (
                                <div className="p-8 rounded-[2rem] bg-[#F7F7F7] border border-[#EBEBEB] space-y-6">
                                    <div className="flex items-center gap-2 text-[#E8472A] font-bold text-[11px] uppercase tracking-[0.2em]">
                                        <CheckCircle2 size={16} />
                                        {t("inspiration.verified_professional")}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white shadow-sm">
                                            <Image
                                                src={photo.vendor.coverImageUrl || "/images/placeholder-vendor.png"}
                                                alt={photo.vendor.businessName}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-display text-2xl text-[#1A1A1A] truncate">
                                                {photo.vendor.businessName}
                                            </h4>
                                            <p className="text-[#717171] text-sm uppercase font-bold tracking-tight">
                                                {photo.vendor.category?.name || t("inspiration.wedding_expert")}
                                            </p>
                                        </div>
                                    </div>
                                    <Button asChild className="w-full rounded-xl bg-[#1A1A1A] text-white hover:bg-[#2A2A2A] h-14 text-[15px] font-bold gap-2 shadow-lg shadow-black/5">
                                        <Link href={`/vendors/${photo.vendor.slug}`}>
                                            {t("inspiration.book_this_style")}
                                            <ArrowRight size={18} className="rtl:-scale-x-100" />
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="p-8 rounded-[2rem] bg-[#FFF5F2] border border-[#FFE4DB] space-y-4">
                                    <p className="text-[#1A1A1A] font-medium">{t("inspiration.love_this_style")}</p>
                                    <p className="text-[#717171] text-sm leading-relaxed">
                                        {t("inspiration.find_pro_desc")}
                                    </p>
                                    <Button asChild variant="outline" className="w-full rounded-xl border-[#E8472A] text-[#E8472A] hover:bg-[#E8472A] hover:text-white h-12">
                                        <Link href="/vendors">{t("inspiration.find_similar_vendors")}</Link>
                                    </Button>
                                </div>
                            )}

                            {/* Section: Sharing */}
                            <div className="pt-6 space-y-6">
                                <h5 className="font-bold text-[13px] uppercase tracking-widest text-[#1A1A1A]">{t("inspiration.share_discovery")}</h5>
                                <div className="flex items-center gap-3">
                                    <Button variant="outline" className="rounded-full gap-2 px-6">
                                        {t("inspiration.invite_partner")}
                                    </Button>
                                    <Button variant="ghost" className="rounded-full w-12 h-12 p-0 text-[#717171]">
                                        <ExternalLink size={20} />
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
