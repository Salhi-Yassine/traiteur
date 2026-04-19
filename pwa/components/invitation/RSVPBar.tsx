import { useTranslation } from "next-i18next";
import { Button } from "@/components/ui/button";
import { 
    Drawer, 
    DrawerContent, 
    DrawerTrigger, 
    DrawerTitle, 
    DrawerDescription 
} from "@/components/ui/drawer";
import RSVPSearchWidget from "@/components/guest/RSVPSearchWidget";
import { PublicWeddingData } from "@/utils/invitationConfig";

interface RSVPBarProps {
    data: PublicWeddingData;
}

export default function RSVPBar({ data }: RSVPBarProps) {
    const { t } = useTranslation("common");

    return (
        <div className="md:hidden fixed bottom-0 start-0 end-0 z-50 p-4 animate-in slide-in-from-bottom-full duration-700">
            <div className="bg-white/90 backdrop-blur-2xl border border-neutral-100 p-4 rounded-[2rem] flex items-center justify-between shadow-[0_-8px_40px_-15px_rgba(0,0,0,0.1)]">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                        {t("event.ready_label")}
                    </p>
                    <p className="font-bold text-neutral-900">{t("event.rsvp_btn")}</p>
                </div>
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button 
                            className="bg-primary text-white px-8 py-6 rounded-[1.5rem] font-bold text-sm shadow-xl shadow-primary/20 transition-all active:scale-95"
                        >
                            {t("event.rsvp_btn")}
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="bg-neutral-50 px-6 pb-12 pt-6 rounded-t-[2.5rem]">
                        <DrawerTitle className="sr-only">RSVP</DrawerTitle>
                        <DrawerDescription className="sr-only">Find your invitation</DrawerDescription>
                        
                        <div className="w-full flex justify-center mt-4">
                            <RSVPSearchWidget slug={data.slug} initialGuest={data.preloadedGuest} />
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </div>
    );
}
