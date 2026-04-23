import { useState } from "react";
import { Sparkles, Users, MapPin, Crown } from "lucide-react";
import { useTranslation } from "next-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BudgetAssistantProps {
    onGenerate: (data: { guestCount: number; city: string; tier: string }) => void;
}

export default function BudgetAssistant({ onGenerate }: BudgetAssistantProps) {
    const { t } = useTranslation("common");
    const [guestCount, setGuestCount] = useState<number>(150);
    const [city, setCity] = useState<string>("fes");
    const [tier, setTier] = useState<string>("premium");

    const handleGenerate = () => {
        onGenerate({ guestCount, city, tier });
    };

    return (
        <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-neutral-100 shadow-xl shadow-primary/5 max-w-2xl mx-auto my-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
                <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Sparkles size={28} />
                </div>

                <h3 className="font-display text-3xl text-neutral-900 mb-3">
                    {t("budget.empty_title", "Commençons votre budget")}
                </h3>
                <p className="text-[#717171] mb-8 max-w-md mx-auto">
                    {t("budget.empty_sub", "Répondez à 3 questions et nous générerons une structure budgétaire adaptée.")}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#B0B0B0]">
                            <Users size={14} />
                            {t("budget.empty_guests", "Invités")}
                        </Label>
                        <Input
                            type="number"
                            value={guestCount}
                            onChange={(e) => setGuestCount(Number(e.target.value))}
                            className="h-12 rounded-xl bg-[#F7F7F7] border-0 focus:ring-2 focus:ring-primary font-bold text-lg"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#B0B0B0]">
                            <MapPin size={14} />
                            {t("budget.empty_city", "Ville")}
                        </Label>
                        <Select value={city} onValueChange={setCity}>
                            <SelectTrigger className="h-12 rounded-xl bg-[#F7F7F7] border-0 focus:ring-2 focus:ring-primary font-bold text-lg">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="fes">Fès / Meknès</SelectItem>
                                <SelectItem value="casablanca">Casablanca / Rabat</SelectItem>
                                <SelectItem value="marrakech">Marrakech</SelectItem>
                                <SelectItem value="tanger">Tanger / Tétouan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#B0B0B0]">
                            <Crown size={14} />
                            {t("budget.empty_tier", "Prestige")}
                        </Label>
                        <Select value={tier} onValueChange={setTier}>
                            <SelectTrigger className="h-12 rounded-xl bg-[#F7F7F7] border-0 focus:ring-2 focus:ring-primary font-bold text-lg">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="standard">{t("budget.tier_standard", "Standard")}</SelectItem>
                                <SelectItem value="premium">{t("budget.tier_premium", "Premium")}</SelectItem>
                                <SelectItem value="luxe">{t("budget.tier_luxe", "Luxe Absolu")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button
                    onClick={handleGenerate}
                    className="w-full sm:w-auto px-10 h-14 rounded-full font-black text-[13px] uppercase shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all"
                >
                    {t("budget.empty_generate", "Générer mon budget")}
                </Button>
            </div>
        </div>
    );
}
