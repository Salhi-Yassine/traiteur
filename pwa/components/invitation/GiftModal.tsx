import { useTranslation } from "next-i18next";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import SuccessAnimation from "@/components/ui/SuccessAnimation";
import { HoneyFundItem } from "@/utils/invitationConfig";
import { cn } from "@/lib/utils";

interface GiftModalProps {
    item: HoneyFundItem | null;
    open: boolean;
    onClose: () => void;
    giftSuccess: boolean;
    onGiftSuccessClose: () => void;
    contributionAmount: string;
    setContributionAmount: (val: string) => void;
    isGifting: boolean;
    onGiftSubmit: () => void;
    fontTitle: string;
}

export default function GiftModal({
    item,
    open,
    onClose,
    giftSuccess,
    onGiftSuccessClose,
    contributionAmount,
    setContributionAmount,
    isGifting,
    onGiftSubmit,
    fontTitle
}: GiftModalProps) {
    const { t } = useTranslation("common");

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-xl p-0 overflow-hidden bg-white md:rounded-[3rem] border-0 shadow-2xl">
                {giftSuccess ? (
                    <div className="p-16 flex flex-col items-center text-center">
                        <SuccessAnimation 
                            show={giftSuccess} 
                            overlay={false} 
                            type="checkmark"
                        />
                        <h3 className="mt-8 text-3xl font-black text-neutral-900 leading-tight">
                            {t("event.gift_success_title", "Un immense MERCI !")}
                        </h3>
                        <p className="mt-4 text-neutral-500 max-w-[280px]">
                            {t("event.gift_success_desc", "Votre contribution a été enregistrée avec succès. Merci !")}
                        </p>
                        <Button 
                            onClick={onGiftSuccessClose}
                            className="mt-12 w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-xl shadow-primary/20 transition-all active:scale-95"
                        >
                            {t("common.close", "Fermer")}
                        </Button>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="relative h-64 w-full">
                            <Image 
                                src={item?.image || ""} 
                                alt={item?.title || ""} 
                                fill 
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                        </div>
                        <div className="px-10 pb-12 -mt-16 relative z-10">
                            <Badge className="bg-primary text-white mb-4 border-0">{t("event.registry_gift", "CADEAU DE MARIAGE")}</Badge>
                            <h3 className={cn("text-4xl font-black text-neutral-900 leading-tight", fontTitle)}>
                                {item?.title}
                            </h3>
                            <p className="mt-3 text-neutral-500 leading-relaxed">
                                {item?.description}
                            </p>

                            <div className="mt-10 space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                                        {t("event.amount_label", "VOTRE CONTRIBUTION (€)")}
                                    </Label>
                                    <div className="relative">
                                        <Input 
                                            type="number"
                                            placeholder="50"
                                            value={contributionAmount}
                                            onChange={(e) => setContributionAmount(e.target.value)}
                                            className="h-20 text-4xl font-black rounded-2xl border-neutral-100 bg-neutral-50 focus:bg-white transition-colors"
                                        />
                                        <span className="absolute end-6 top-1/2 -translate-y-1/2 text-2xl font-black text-neutral-300">€</span>
                                    </div>
                                </div>

                                <Button 
                                    className="w-full h-20 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-2xl shadow-primary/20 transition-all active:scale-95"
                                    disabled={isGifting || !contributionAmount}
                                    onClick={onGiftSubmit}
                                >
                                    {isGifting ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        t("event.gift_confirm", "CONFIRMER L'OFFRE")
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
