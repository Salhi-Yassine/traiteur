import { Heart, Sparkles, MoveDown } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { cn } from "@/lib/utils";

export type ThemeId = 'modern' | 'romantic' | 'classic' | 'boho' | 'dark' | 'moroccan';

export interface TemplateCardProps {
    id: ThemeId;
    title: string;
    description: string;
    imageSrc?: string;
    isActive?: boolean;
    isPremium?: boolean;
    brideName: string;
    groomName: string;
    onSelect: () => void;
    onQuickView: () => void;
}

export const TemplateCard = ({
    id,
    title,
    description,
    imageSrc,
    isActive,
    isPremium,
    brideName,
    groomName,
    onSelect,
    onQuickView
}: TemplateCardProps) => {
    const { t } = useTranslation("common");
    
    // Derived default names if none exist
    const bName = brideName || t("onboarding.fields.bride_name");
    const gName = groomName || t("onboarding.fields.groom_name");

    // Dynamic styles based on theme ID
    const getThemeStyles = (themeId: ThemeId) => {
        switch (themeId) {
            case 'modern': return "bg-neutral-900 text-white font-sans tracking-tight";
            case 'romantic': return "bg-[#FDF9F7] text-[#5C4033] font-serif italic";
            case 'classic': return "bg-blue-900 text-white font-serif uppercase tracking-widest";
            case 'boho': return "bg-[#F4E3D7] text-[#8C6239] font-serif border-2 border-[#D4A373]";
            case 'dark': return "bg-black text-[#D4AF37] font-serif uppercase tracking-widest";
            case 'moroccan': return "bg-emerald-900 text-amber-500 font-serif border-4 border-amber-500/30";
            default: return "bg-neutral-100 text-neutral-900";
        }
    };

    return (
        <div className="group relative flex flex-col pt-4">
            {/* The actual Card Preview */}
            <div 
                className={cn(
                    "relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden border-2 transition-all duration-500 cursor-pointer shadow-lg",
                    isActive ? "border-primary ring-4 ring-primary/20 shadow-primary/20" : "border-neutral-200 hover:border-neutral-300 hover:shadow-xl"
                )}
                onClick={onQuickView}
            >
                {/* Scroll Wrapper: Replicates the hovering scroll (Parallax effect) */}
                <div className="w-full h-full relative overflow-hidden group-hover:[&>.scroll-container]:-translate-y-1/2">
                    <div className="scroll-container w-full h-[200%] transition-transform duration-[3000ms] ease-out absolute top-0 start-0 bg-neutral-100">
                        {/* Hero Section Mockup - Dynamic live rendering */}
                        <div className={cn("w-full h-1/2 relative flex flex-col items-center justify-center p-6 text-center shadow-lg", getThemeStyles(id))}>
                            {imageSrc && (
                                <>
                                    <Image src={imageSrc} fill alt={title} className="object-cover opacity-60" />
                                    <div className="absolute inset-0 bg-black/20" />
                                </>
                            )}
                            <div className="relative z-10 w-full">
                                {id === 'modern' && (
                                    <>
                                        <h3 className="text-4xl font-black mb-2">{bName}</h3>
                                        <div className="text-primary font-serif italic text-xl my-1">&amp;</div>
                                        <h3 className="text-4xl font-black">{gName}</h3>
                                        <div className="mt-8 text-[10px] uppercase tracking-[0.3em] font-bold border border-white/30 px-3 py-1 inline-block rounded-full">Save the Date</div>
                                    </>
                                )}
                                {(id === 'romantic' || id === 'boho') && (
                                    <>
                                        <h3 className="text-5xl font-light mb-4">{bName} <span className="mx-2 text-primary">&</span> {gName}</h3>
                                        <div className="mt-4 text-sm uppercase tracking-widest font-sans opacity-80 border-t border-current pt-4 w-1/2 mx-auto">12 Juin 2026</div>
                                    </>
                                )}
                                {(id === 'classic' || id === 'dark' || id === 'moroccan') && (
                                    <>
                                        <div className="w-12 h-12 mx-auto border border-current rounded-full flex items-center justify-center mb-6">
                                            <span className="text-xl">{bName[0]}&{gName[0]}</span>
                                        </div>
                                        <h3 className="text-3xl leading-relaxed">{bName} <br/> {gName}</h3>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Dummy Continuation to show scrollable content */}
                        <div className="w-full h-1/2 bg-white flex flex-col items-center justify-start py-10 px-4 space-y-6">
                            <div className="w-16 h-8 bg-neutral-200 rounded-full animate-pulse" />
                            <div className="w-3/4 h-4 bg-neutral-100 rounded-full" />
                            <div className="w-2/3 h-4 bg-neutral-100 rounded-full" />
                            <div className="grid grid-cols-2 gap-2 w-full mt-4">
                                <div className="h-20 bg-neutral-100 rounded-xl" />
                                <div className="h-20 bg-neutral-100 rounded-xl" />
                                <div className="col-span-2 h-20 bg-neutral-100 rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overlays & Badges */}
                {isPremium && (
                    <div className="absolute top-4 end-4 bg-black/80 backdrop-blur-md text-[#D4AF37] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        {t("website.templates_gallery.badge_premium")}
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <button 
                        className="bg-white text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    >
                        {t("website.templates_gallery.preview_theme")}
                        <MoveDown className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Metadatas */}
            <div className="mt-4 flex items-start justify-between">
                <div>
                    <h4 className="font-bold text-neutral-900 text-lg">{title}</h4>
                    <p className="text-sm text-neutral-500 mt-1 max-w-[200px] leading-snug">{description}</p>
                </div>
                {isActive ? (
                    <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0">
                        <Heart className="w-3 h-3 fill-current" />
                        {t("website.templates_gallery.current_theme")}
                    </div>
                ) : (
                    <button 
                        onClick={onSelect}
                        className="text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-full transition-colors shrink-0"
                    >
                        {t("website.templates_gallery.use_theme")}
                    </button>
                )}
            </div>
        </div>
    );
};
