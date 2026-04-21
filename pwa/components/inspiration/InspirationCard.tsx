import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, MapPin } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import apiClient from "@/utils/apiClient";
import { useAuth } from "@/context/AuthContext";
import { cn, getInspirationImageUrl } from "@/lib/utils";

interface InspirationCardProps {
    photo: {
        id: number;
        imagePath: string;
        caption: string;
        style: string;
        "@id": string; // API Platform IRI
        category?: { name: string };
        city?: { name: string };
    };
    onClick: () => void;
}

export default function InspirationCard({ photo, onClick }: InspirationCardProps) {
    const { t } = useTranslation("common");
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const router = useRouter();

    // Check if this photo is already saved by the user
    const { data: savedPhotos } = useQuery({
        queryKey: ["saved-photos"],
        queryFn: () => apiClient.get<any>("/api/saved_photos"),
        enabled: !!user,
    });

    const isSavedAlready = (savedPhotos?.member || []).find(
        (sp: any) => sp.photo?.["@id"] === photo["@id"]
    );

    const saveMutation = useMutation({
        mutationFn: (photoIri: string) =>
            apiClient.post("/api/saved_photos", { photo: photoIri }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saved-photos"] });
            toast.success(t("inspiration.save_to_moodboard_success"));
        },
        onError: () => {
            toast.error(t("inspiration.save_to_moodboard_error"));
        }
    });

    const unsaveMutation = useMutation({
        mutationFn: (savedPhotoId: string) =>
            apiClient.delete(savedPhotoId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saved-photos"] });
            toast.success(t("inspiration.remove_from_moodboard_success"));
        },
        onError: () => {
            toast.error(t("inspiration.remove_from_moodboard_error"));
        }
    });

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!user) {
            toast.error(t("inspiration.login_to_save"), {
                action: {
                    label: t("inspiration.login"),
                    onClick: () => router.push("/auth/login")
                }
            });
            return;
        }

        if (isSavedAlready) {
            unsaveMutation.mutate(isSavedAlready["@id"]);
        } else {
            saveMutation.mutate(photo["@id"]);
        }
    };

    const isSaving = saveMutation.isPending || unsaveMutation.isPending;
    const isSaved = !!isSavedAlready;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="group relative cursor-pointer overflow-hidden rounded-[1.5rem] bg-neutral-100 shadow-sm transition-all hover:shadow-xl"
            onClick={onClick}
        >
            <div className="relative aspect-auto min-h-[200px]">
                <Image
                    src={photo.imagePath.startsWith('http') ? photo.imagePath : getInspirationImageUrl(photo.imagePath)}
                    alt={photo.caption}
                    width={500}
                    height={700}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Save Button (Top End) */}
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={cn(
                        "absolute top-4 end-4 p-3 rounded-full backdrop-blur-md border transition-all duration-300",
                        isSaved
                            ? "bg-[#E8472A] border-[#E8472A] text-white"
                            : "bg-white/20 border-white/40 text-white hover:bg-white/40",
                        isSaving && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <Heart size={18} fill={isSaved ? "currentColor" : "none"} className={cn(isSaving && "animate-pulse")} />
                </button>

                {/* Info (Bottom) - Visual hint */}
                <div className="absolute bottom-4 inset-x-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 space-y-1">
                        <div className="flex items-center gap-1.5 text-white/90 text-[11px] font-bold uppercase tracking-wider">
                            <MapPin size={10} className="text-[#E8472A]" />
                            {photo.city?.name || t("inspiration.morocco")}
                        </div>
                        <p className="text-white text-[14px] font-medium leading-snug line-clamp-2">
                            {photo.caption}
                        </p>
                        <div className="flex gap-2 pt-1">
                            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase">
                                {photo.style}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
