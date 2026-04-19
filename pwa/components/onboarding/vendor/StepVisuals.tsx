import { Camera, ImagePlus, Upload, X } from "lucide-react";
import { useTranslation } from "next-i18next";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { WizardValues } from "./WizardTypes";

interface StepVisualsProps {
    screen: number;
    values: WizardValues;
    handleCoverFile: (file: File) => void;
    handleGalleryFile: (index: number, file: File) => void;
    removeGallerySlot: (index: number) => void;
}

export default function StepVisuals({
    screen,
    values,
    handleCoverFile,
    handleGalleryFile,
    removeGallerySlot,
}: StepVisualsProps) {
    const { t } = useTranslation("common");
    const coverInputRef = useRef<HTMLInputElement>(null);
    const [coverDragOver, setCoverDragOver] = useState(false);

    if (screen === 0) {
        return (
            <>
                <div className="mb-8">
                    <h1 className="font-display text-[32px] leading-tight text-[#1A1A1A] mb-2">
                        {t("onboarding.fields.cover_question")}
                    </h1>
                    <p className="text-[15px] text-[#717171] leading-relaxed">{t("onboarding.fields.cover_sub")}</p>
                </div>

                <div
                    onClick={() => coverInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setCoverDragOver(true); }}
                    onDragLeave={() => setCoverDragOver(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setCoverDragOver(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleCoverFile(file);
                    }}
                    className={cn(
                        "group relative aspect-[16/9] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden",
                        coverDragOver ? "border-[#E8472A] bg-[#FEF0ED]" : "border-[#EBEBEB] hover:border-[#E8472A]/40 hover:bg-neutral-50"
                    )}
                >
                    {values.coverPreview ? (
                        <>
                            <img src={values.coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-neutral-900 font-bold text-sm flex items-center gap-2">
                                    <Camera className="w-4 h-4" />
                                    {t("onboarding.fields.change_photo")}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-[#FEF0ED] flex items-center justify-center">
                                <Upload className="w-6 h-6 text-[#E8472A]" />
                            </div>
                            <div className="text-center">
                                <p className="text-[15px] font-bold text-[#1A1A1A]">{t("onboarding.fields.upload_cta")}</p>
                                <p className="text-[12px] text-[#717171] mt-1">{t("onboarding.fields.upload_sub")}</p>
                            </div>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={coverInputRef}
                        onChange={(e) => e.target.files?.[0] && handleCoverFile(e.target.files[0])}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
            </>
        );
    }

    if (screen === 1) {
        return (
            <>
                <div className="mb-8">
                    <h1 className="font-display text-[32px] leading-tight text-[#1A1A1A] mb-2">
                        {t("onboarding.fields.gallery_question")}
                    </h1>
                    <p className="text-[15px] text-[#717171] leading-relaxed">{t("onboarding.fields.gallery_sub")}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {values.galleryPreviews.map((p, i) => (
                        <div
                            key={i}
                            className={cn(
                                "group relative aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden",
                                p ? "border-solid border-[#EBEBEB]" : "border-[#EBEBEB] hover:border-[#E8472A]/40 hover:bg-neutral-50"
                            )}
                            onClick={() => !p && document.getElementById(`gall-${i}`)?.click()}
                        >
                            {p ? (
                                <>
                                    <img src={p} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeGallerySlot(i); }}
                                        className="absolute top-2 end-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4 text-neutral-900" />
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <ImagePlus className="w-6 h-6 text-[#B0B0B0]" />
                                    <span className="text-[11px] font-bold text-[#B0B0B0]">{i === 0 ? t("onboarding.fields.primary") : i + 1}</span>
                                </div>
                            )}
                            <input
                                id={`gall-${i}`}
                                type="file"
                                onChange={(e) => e.target.files?.[0] && handleGalleryFile(i, e.target.files[0])}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                    ))}
                </div>
            </>
        );
    }

    return null;
}
