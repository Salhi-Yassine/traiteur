import { Check, Lightbulb } from "lucide-react";
import { useTranslation } from "next-i18next";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category, WizardValues } from "./WizardTypes";

interface StepActivityProps {
    screen: number;
    values: WizardValues;
    errors: Record<string, string>;
    categories: Category[];
    set: <K extends keyof WizardValues>(key: K, val: WizardValues[K]) => void;
    showTagline: boolean;
    setShowTagline: (show: boolean) => void;
}

export default function StepActivity({
    screen,
    values,
    errors,
    categories,
    set,
    showTagline,
    setShowTagline,
}: StepActivityProps) {
    const { t } = useTranslation("common");

    if (screen === 0) {
        return (
            <>
                <div className="mb-8">
                    <h1 className="font-display text-[32px] leading-tight text-[#1A1A1A] mb-2">
                        {t("onboarding.fields.category_question")}
                    </h1>
                    <p className="text-[15px] text-[#717171] leading-relaxed">{t("onboarding.fields.category_sub")}</p>
                </div>
                {categories.length === 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-28 rounded-2xl bg-neutral-100 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {categories.map((cat) => {
                            const iri = `/api/categories/${cat.id}`;
                            const selected = values.category === iri;
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => set("category", iri)}
                                    className={cn(
                                        "relative flex flex-col items-center justify-center gap-2 p-4 h-28 rounded-2xl border-2 text-center transition-all duration-200",
                                        selected
                                            ? "border-[#E8472A] bg-[#FEF0ED] shadow-md"
                                            : "border-[#EBEBEB] bg-white hover:border-[#E8472A]/40 hover:shadow-sm"
                                    )}
                                >
                                    {selected && (
                                        <span className="absolute top-2 end-2 w-5 h-5 rounded-full bg-[#E8472A] flex items-center justify-center">
                                            <Check className="w-3 h-3 text-white" />
                                        </span>
                                    )}
                                    <span className="text-2xl">{cat.emoji || "🎉"}</span>
                                    <span className="text-[13px] font-semibold text-[#1A1A1A] leading-tight">
                                        {cat.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
                {errors.category && <p className="text-[12px] text-red-500 font-medium mt-1">{errors.category}</p>}
            </>
        );
    }

    if (screen === 1) {
        return (
            <>
                <div className="mb-8">
                    <h1 className="font-display text-[32px] leading-tight text-[#1A1A1A] mb-2">
                        {t("onboarding.fields.business_name_question")}
                    </h1>
                    <p className="text-[15px] text-[#717171] leading-relaxed">{t("onboarding.fields.business_name_sub")}</p>
                </div>
                <div className="space-y-4">
                    <div>
                        <Input
                            id="businessName"
                            value={values.businessName}
                            onChange={(e) => set("businessName", e.target.value)}
                            placeholder={t("onboarding.fields.business_name_placeholder")}
                            className={cn(
                                "h-14 text-[16px] border-2 rounded-2xl px-4",
                                errors.businessName ? "border-red-400 ring-4 ring-red-400/20" : "border-[#EBEBEB] focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10"
                            )}
                            autoFocus
                        />
                        {errors.businessName && <p className="text-[12px] text-red-500 font-medium mt-1">{errors.businessName}</p>}
                    </div>

                    {!showTagline ? (
                        <button
                            type="button"
                            onClick={() => setShowTagline(true)}
                            className="text-[13px] text-[#717171] hover:text-[#E8472A] underline underline-offset-2 transition-colors"
                        >
                            + {t("onboarding.fields.tagline_toggle")}
                        </button>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <Label className="text-[13px] font-semibold text-[#1A1A1A] mb-1.5 block">
                                {t("onboarding.fields.tagline")}
                            </Label>
                            <Input
                                id="tagline"
                                value={values.tagline}
                                onChange={(e) => set("tagline", e.target.value)}
                                placeholder={t("onboarding.fields.tagline_placeholder")}
                                className="h-12 text-[15px] border-2 border-[#EBEBEB] focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10 rounded-2xl px-4"
                            />
                        </div>
                    )}
                </div>
            </>
        );
    }

    if (screen === 2) {
        const charCount = values.description.trim().length;
        const isOk = charCount >= 50;
        return (
            <>
                <div className="mb-8">
                    <h1 className="font-display text-[32px] leading-tight text-[#1A1A1A] mb-2">
                        {t("onboarding.fields.description_question")}
                    </h1>
                    <p className="text-[15px] text-[#717171] leading-relaxed">{t("onboarding.fields.description_sub")}</p>
                </div>

                <div className="flex gap-3 p-4 bg-[#FEF0ED] rounded-2xl mb-6">
                    <Lightbulb className="w-4 h-4 text-[#E8472A] shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[12px] font-bold text-[#E8472A] mb-0.5">{t("onboarding.fields.description_tip_title")}</p>
                        <p className="text-[13px] text-[#484848]">{t("onboarding.fields.description_tip")}</p>
                    </div>
                </div>

                <div>
                    <textarea
                        id="description"
                        rows={6}
                        value={values.description}
                        onChange={(e) => set("description", e.target.value)}
                        placeholder={t("onboarding.fields.description_placeholder")}
                        className={cn(
                            "w-full text-[15px] border-2 rounded-2xl p-4 resize-none transition-all duration-150 outline-none leading-relaxed",
                            errors.description
                                ? "border-red-400 ring-4 ring-red-400/20"
                                : "border-[#EBEBEB] focus:border-[#E8472A] focus:ring-4 focus:ring-[#E8472A]/10"
                        )}
                        autoFocus
                    />
                    <div className="flex items-center justify-between mt-1.5">
                        {errors.description && <p className="text-[12px] text-red-500 font-medium mt-1">{errors.description}</p>}
                        <span className={cn(
                            "text-[12px] font-medium ms-auto",
                            isOk ? "text-green-600" : "text-[#B0B0B0]"
                        )}>
                            {charCount} {!isOk && `/ 50`}
                        </span>
                    </div>
                </div>
            </>
        );
    }

    return null;
}
