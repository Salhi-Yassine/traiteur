import Image from "next/image";
import { Grid, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslation } from "next-i18next";
import { cn } from "@/lib/utils";
import { VendorProfileData } from "./ProfileTypes";

interface ProfileGalleryProps {
    vendor: VendorProfileData;
    allMedia: { type: 'image' | 'video'; url: string }[];
    gridMedia: { type: 'image' | 'video'; url: string }[];
    galleryIndex: number | null;
    setGalleryIndex: (index: number | null) => void;
}

export default function ProfileGallery({
    vendor,
    allMedia,
    gridMedia,
    galleryIndex,
    setGalleryIndex
}: ProfileGalleryProps) {
    const { t } = useTranslation("common");

    return (
        <>
            <div id="photos" className="group relative h-[300px] md:h-[500px] flex md:grid grid-cols-4 grid-rows-2 gap-2 overflow-x-auto md:overflow-hidden snap-x snap-mandatory mx-[-1.5rem] px-[1.5rem] md:mx-0 md:px-0 mb-12 scroll-mt-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:rounded-2xl">
                {gridMedia.length > 0 && (
                    <>
                        <div className="shrink-0 w-[90vw] md:w-auto h-full snap-center col-span-4 md:col-span-2 row-span-1 md:row-span-2 relative overflow-hidden bg-neutral-100 group/item cursor-pointer rounded-xl md:rounded-none" onClick={() => setGalleryIndex(0)}>
                            {gridMedia[0].type === 'video' ? (
                                <video
                                    src={gridMedia[0].url}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-full h-full object-cover transition-all duration-700 group-hover/item:scale-105"
                                />
                            ) : (
                                <Image
                                    src={gridMedia[0].url}
                                    alt={`${vendor.businessName} photo 1`}
                                    fill
                                    className="object-cover transition-all duration-700 group-hover/item:scale-105"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/10 transition-colors" />
                        </div>
                        
                        {gridMedia.slice(1, 5).map((media, idx) => (
                            <div key={idx} className={`shrink-0 w-[90vw] md:w-auto h-full snap-center relative overflow-hidden bg-neutral-100 cursor-pointer group/item${idx + 2} rounded-xl md:rounded-none`} onClick={() => setGalleryIndex(idx + 1)}>
                                {media.type === 'video' ? (
                                    <video src={media.url} autoPlay muted loop playsInline className="w-full h-full object-cover transition-all duration-700 hover:scale-105" />
                                ) : (
                                    <Image
                                        src={media.url}
                                        alt={`${vendor.businessName} photo ${idx + 2}`}
                                        fill
                                        className="object-cover transition-all duration-700 hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                    />
                                )}
                            </div>
                        ))}
                    </>
                )}
                
                <button 
                    onClick={() => setGalleryIndex(0)}
                    className="absolute bottom-6 end-6 bg-white border border-neutral-900 rounded-lg px-4 py-2 text-xs font-bold hover:bg-neutral-50 flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                    <Grid className="w-4 h-4" />
                    {t("vendor_profile.gallery.show_all")}
                </button>
            </div>

            {/* Lightbox */}
            {galleryIndex !== null && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-in fade-in zoom-in-95 duration-300 backdrop-blur-sm">
                    <div className="absolute top-6 end-6 z-50 flex items-center gap-4">
                        <span className="text-white/60 font-medium tracking-widest text-sm">{galleryIndex + 1} / {allMedia.length}</span>
                        <button onClick={() => setGalleryIndex(null)} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors active:scale-95">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <button onClick={(e) => { e.stopPropagation(); setGalleryIndex((galleryIndex - 1 + allMedia.length) % allMedia.length); }} className="absolute start-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50 md:block hidden active:scale-90">
                        <ChevronLeft className="w-8 h-8 rtl:rotate-180" />
                    </button>

                    <button onClick={(e) => { e.stopPropagation(); setGalleryIndex((galleryIndex + 1) % allMedia.length); }} className="absolute end-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50 md:block hidden active:scale-90">
                        <ChevronRight className="w-8 h-8 rtl:rotate-180" />
                    </button>

                    <div className="flex-1 overflow-hidden relative flex items-center justify-center p-4 md:p-12 w-full h-full" onClick={() => setGalleryIndex(null)}>
                        <div className="relative w-full h-full max-w-7xl" onClick={(e) => e.stopPropagation()}>
                            {allMedia[galleryIndex].type === 'video' ? (
                                <video src={allMedia[galleryIndex].url} controls autoPlay playsInline className="w-full h-full object-contain animate-in fade-in duration-500 rounded-xl" />
                            ) : (
                                <Image src={allMedia[galleryIndex].url} alt={`Gallery image`} fill className="object-contain animate-in fade-in duration-500" sizes="100vw" priority />
                            )}
                        </div>
                    </div>
                    
                    <div className="absolute bottom-8 start-0 end-0 flex justify-center md:hidden pointer-events-none">
                        <div className="bg-black/50 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full flex gap-2 items-center">
                            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                            {t("vendor_profile.gallery.tap_hint")}
                            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                        </div>
                    </div>
                    
                    <div className="absolute inset-y-0 start-0 w-1/3 z-40 md:hidden" onClick={() => setGalleryIndex((galleryIndex! - 1 + allMedia.length) % allMedia.length)} />
                    <div className="absolute inset-y-0 end-0 w-1/3 z-40 md:hidden" onClick={() => setGalleryIndex((galleryIndex! + 1) % allMedia.length)} />
                </div>
            )}
        </>
    );
}
