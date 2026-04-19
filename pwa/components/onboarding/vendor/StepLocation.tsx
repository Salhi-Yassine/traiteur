import { Check, MessageSquare } from "lucide-react";
import { useTranslation } from "next-i18next";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { City, WizardValues } from "./WizardTypes";

interface StepLocationProps {
    screen: number;
    values: WizardValues;
    errors: Record<string, string>;
    cities: City[];
    set: <K extends keyof WizardValues>(key: K, val: WizardValues[K]) => void;
}

const PRICE_OPTIONS = [
    { value: "MAD",        labelKey: "budget",    symbols: 1, descKey: "budget_desc" },
    { value: "MADMAD",     labelKey: "standard",  symbols: 2, descKey: "standard_desc" },
    { value: "MADMADMAD",  labelKey: "premium",   symbols: 3, descKey: "premium_desc" },
    { value: "MADMADMAD+", labelKey: "exclusif",  symbols: 4, descKey: "exclusif_desc" },
];

export default function StepLocation({
    screen,
    values,
    errors,
    cities,
    set,
}: StepLocationProps) {
    const { t } = useTranslation("common");

    if (screen === 0) {
        return (
            <>
                <div className="mb-8">
                    <h1 className="font-display text-[32px] leading-tight text-[#1A1A1A] mb-2">
                        {t("onboarding.fields.cities_question")}
                    </h1>
                    <p className="text-[15px] text-[#717171] leading-relaxed">{t("onboarding.fields.cities_sub")}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-start">
                    {cities.map((city) => {
                        const iri = `/api/cities/${city.id}`;
                        const selected = values.cities.includes(iri);
                        return (
                            <button
                                key={city.id}
                                type="button"
                                onClick={() =>
                                    set(
                                        "cities",
                                        selected
                                            ? values.cities.filter((c) => c !== iri)
                                            : [...values.cities, iri]
                                    )
                                }
                                className={cn(
                                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-[14px] font-semibold border-2 transition-all duration-150",
                                    selected
                                        ? "border-[#E8472A] bg-[#FEF0ED] text-[#E8472A]"
                                        : "border-[#EBEBEB] bg-white text-[#484848] hover:border-[#E8472A]/40"
                                )}
                            >
                                {selected && <Check className="w-3 h-3" />}
                                {city.name}
                            </button>
                        );
                    })}
                </div>
                {errors.cities && <p className="text-[12px] text-red-500 font-medium mt-1">{errors.cities}</p>}
            </>
        );
    }

    if (screen === 1) {
        return (
            <>
                <div className="mb-8">
                    <h1 className="font-display text-[32px] leading-tight text-[#1A1A1A] mb-2">
                        {t("onboarding.fields.price_range_question")}
                    </h1>
                    <p className="text-[15px] text-[#717171] leading-relaxed">{t("onboarding.fields.price_range_sub")}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {PRICE_OPTIONS.map((opt) => {
                        const selected = values.priceRange === opt.value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => set("priceRange", opt.value)}
                                className={cn(
                                    "relative flex flex-col gap-2 p-5 rounded-2xl border-2 text-start transition-all duration-200",
                                    selected ? "border-[#E8472A] bg-[#FEF0ED] shadow-md" : "border-[#EBEBEB] bg-white hover:border-[#E8472A]/40"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-0.5">
                                        {[...Array(4)].map((_, i) => (
                                            <span key={i} className={cn(
                                                "text-[16px] font-bold",
                                                i < opt.symbols 
                                                    ? (selected ? "text-[#E8472A]" : "text-[#1A1A1A]")
                                                    : "text-[#EBEBEB]"
                                            )}>
                                                $
                                            </span>
                                        ))}
                                    </div>
                                    {selected && <div className="w-5 h-5 rounded-full bg-[#E8472A] flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                                </div>
                                <div>
                                    <p className="font-bold text-[15px] text-[#1A1A1A]">{t(`onboarding.price_options.${opt.labelKey}`)}</p>
                                    <p className="text-[12px] text-[#717171] mt-0.5">{t(`onboarding.price_options.${opt.descKey}`)}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label className="text-[13px] font-semibold text-[#1A1A1A] mb-1.5 block">
                        {t("onboarding.fields.starting_price")}
                    </Label>
                    <div className="relative">
                        <Input
                            id="startingPrice"
                            type="number"
                            value={values.startingPrice}
                            onChange={(e) => set("startingPrice", e.target.value)}
                            placeholder="ex: 5000"
                            className="h-12 text-[15px] border-2 border-[#EBEBEB] focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10 rounded-2xl ps-4 pe-14"
                        />
                        <span className="absolute end-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#717171]">MAD</span>
                    </div>
                </div>
            </>
        );
    }

    if (screen === 2) {
        return (
            <>
                <div className="mb-8">
                    <h1 className="font-display text-[32px] leading-tight text-[#1A1A1A] mb-2">
                        {t("onboarding.fields.contact_question")}
                    </h1>
                    <p className="text-[15px] text-[#717171] leading-relaxed">{t("onboarding.fields.contact_sub")}</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <Label className="text-[13px] font-semibold text-[#1A1A1A] mb-1.5 block flex items-center gap-2">
                            <MessageSquare className="w-3.5 h-3.5" />
                            {t("onboarding.fields.whatsapp")}
                        </Label>
                        <Input
                            id="whatsapp"
                            value={values.whatsapp}
                            onChange={(e) => set("whatsapp", e.target.value)}
                            placeholder="06..."
                            className={cn(
                                "h-14 text-[16px] border-2 rounded-2xl px-4",
                                errors.whatsapp ? "border-red-400 ring-4 ring-red-400/20" : "border-[#EBEBEB] focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10"
                            )}
                            autoFocus
                        />
                        {errors.whatsapp && <p className="text-[12px] text-red-500 font-medium mt-1">{errors.whatsapp}</p>}
                    </div>

                    <div>
                        <Label className="text-[13px] font-semibold text-[#1A1A1A] mb-1.5 block">
                            {t("onboarding.fields.website")}
                        </Label>
                        <Input
                            id="website"
                            value={values.website}
                            onChange={(e) => set("website", e.target.value)}
                            placeholder="https://..."
                            className="h-12 text-[15px] border-2 border-[#EBEBEB] focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10 rounded-2xl px-4"
                        />
                    </div>
                </div>
            </>
        );
    }

    return null;
}
