import Image from "next/image";
import { Camera } from "lucide-react";
import { useTranslation } from "next-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WeddingGalleryProps {
    images: string[] | undefined;
    fontTitle: string;
}

export default function WeddingGallery({ images, fontTitle }: WeddingGalleryProps) {
    const { t } = useTranslation("common");

    const displayImages = images || [];

    return (
        <section className="py-24 max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
                <h2 className={cn("text-3xl font-black", fontTitle)}>{t("event.gallery_title")}</h2>
                {displayImages.length > 5 && (
                    <Button variant="outline" className="rounded-full shadow-sm">
                        {t("vendor_profile.gallery.show_all")}
                    </Button>
                )}
            </div>
            {displayImages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 md:gap-3 h-[600px] md:h-[500px]">
                    {displayImages.slice(0, 5).map((img, idx) => {
                        const isFirst = idx === 0;
                        return (
                            <div 
                                key={idx} 
                                className={cn(
                                    "relative overflow-hidden group cursor-pointer",
                                    isFirst ? "md:col-span-2 md:row-span-2 rounded-t-[2rem] md:rounded-t-none md:rounded-s-[2rem]" : "hidden md:block",
                                    idx === 2 ? "md:rounded-se-[2rem]" : "",
                                    idx === 4 ? "md:rounded-ee-[2rem]" : ""
                                )}
                            >
                                <Image src={img} alt={t("event.gallery_photo_alt")} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="h-64 bg-neutral-50 rounded-[2rem] flex items-center justify-center border border-dashed border-neutral-200">
                    <div className="text-center text-neutral-400">
                        <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>{t("event.gallery_desc")}</p>
                    </div>
                </div>
            )}
        </section>
    );
}
