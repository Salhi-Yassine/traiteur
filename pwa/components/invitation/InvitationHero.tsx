import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Calendar, MapPin, Heart, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PublicWeddingData } from "@/utils/invitationConfig";
import { useTranslation } from "next-i18next";
import WeddingCountdown from "./WeddingCountdown";

interface InvitationHeroProps {
    data: PublicWeddingData;
    formattedDate: string;
    isSaved: boolean;
    onSaveToggle: () => void;
    onShare: () => void;
}

export default function InvitationHero({ 
    data, 
    formattedDate, 
    isSaved, 
    onSaveToggle, 
    onShare 
}: InvitationHeroProps) {
    const { t } = useTranslation("common");
    const { scrollYProgress } = useScroll();
    
    const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);

    return (
        <section className="relative h-screen w-full overflow-hidden">
            <motion.div 
                style={{ scale: imageScale }}
                className="absolute inset-0"
            >
                {data.coverImage ? (
                    <Image
                        src={data.coverImage}
                        alt={`${data.brideName} & ${data.groomName}`}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                        <Heart className="w-24 h-24 text-primary/20" />
                    </div>
                )}
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
            
            {/* Action Bar */}
            <div className="absolute top-10 end-6 flex items-center gap-2 md:top-24 z-20">
                <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={onShare}
                    className="rounded-full bg-white/20 backdrop-blur-md border-0 hover:bg-white/30 text-white font-bold gap-2 px-4 shadow-xl"
                >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden md:inline underline text-xs uppercase tracking-widest">{t("nav.share")}</span>
                </Button>
                <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={onSaveToggle}
                    className={cn(
                        "rounded-full bg-white/20 backdrop-blur-md border-0 hover:bg-white/30 text-white font-bold gap-2 px-4 shadow-xl",
                        isSaved && "text-primary"
                    )}
                >
                    <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
                    <span className="hidden md:inline underline text-xs uppercase tracking-widest">{isSaved ? t("common.saved") : t("common.save")}</span>
                </Button>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-6 w-full max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <Badge variant="outline" className="mb-6 px-4 py-2 text-xs uppercase tracking-[0.3em] font-bold border-white/40 text-white backdrop-blur-md">
                        {t("event.save_the_date")}
                    </Badge>
                    <h1 className="font-display text-7xl md:text-[120px] font-black mb-8 leading-[0.9] tracking-tighter">
                        {data.brideName} <br />
                        <span className="text-primary italic font-serif">&</span> <br />
                        {data.groomName}
                    </h1>

                    <div className="mb-12">
                        <WeddingCountdown targetDate={data.weddingDate!} />
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-lg font-medium opacity-90 tracking-wide mt-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-primary" />
                            <span>{data.weddingCity}</span>
                        </div>
                    </div>
                </motion.div>
            </div>
            
            {/* Scroll Indicator */}
            <motion.div 
                animate={{ y: [0, 10, 0] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-8 start-1/2 -translate-x-1/2 z-10"
            >
                <div className="w-[1px] h-12 bg-white/40 relative">
                    <div className="absolute top-0 start-0 w-full h-4 bg-primary rounded-full" />
                </div>
            </motion.div>
        </section>
    );
}
