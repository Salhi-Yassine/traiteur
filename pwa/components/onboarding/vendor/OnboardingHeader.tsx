import { X } from "lucide-react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface OnboardingHeaderProps {
    stage: number;
    currentFlatScreen: number;
    totalScreens: number;
    autosaved: boolean;
}

export default function OnboardingHeader({
    stage,
    currentFlatScreen,
    totalScreens,
    autosaved,
}: OnboardingHeaderProps) {
    const { t } = useTranslation("common");
    const router = useRouter();
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    return (
        <>
            {/* Exit confirmation drawer */}
            {showExitConfirm && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowExitConfirm(false)} />
                    <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-sm p-8 mx-4 shadow-xl animate-in slide-in-from-bottom-4 duration-300">
                        <h3 className="font-display text-[22px] text-[#1A1A1A] mb-2">
                            {t("onboarding.exit_confirm_title")}
                        </h3>
                        <p className="text-[14px] text-[#717171] mb-6">{t("onboarding.exit_confirm_body")}</p>
                        <div className="flex flex-col gap-3">
                            <Button variant="ghost" onClick={() => router.push("/")} className="w-full h-12 border border-neutral-200 rounded-2xl text-[#1A1A1A]">
                                {t("onboarding.exit_confirm_cta")}
                            </Button>
                            <Button onClick={() => setShowExitConfirm(false)} className="w-full h-12 rounded-2xl">
                                {t("onboarding.exit_cancel")}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-neutral-100">
                <div className="max-w-2xl mx-auto px-6 h-[60px] flex items-center justify-between gap-4">
                    {/* Exit X */}
                    <button
                        type="button"
                        onClick={() => setShowExitConfirm(true)}
                        aria-label={t("auth.back_home")}
                        className="p-2 -ms-2 rounded-full hover:bg-neutral-100 transition-colors shrink-0"
                    >
                        <X className="w-5 h-5 text-[#717171]" />
                    </button>

                    {/* Stage progress dots */}
                    <div className="flex-1 flex items-center justify-center gap-3">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={cn(
                                    "w-2 h-2 rounded-full transition-all duration-300",
                                    s < stage  ? "bg-[#E8472A] scale-100" :
                                    s === stage ? "bg-[#E8472A] scale-125 ring-4 ring-[#E8472A]/20" :
                                                  "bg-neutral-200"
                                )} />
                                {s < 4 && <div className={cn(
                                    "w-8 h-px transition-colors duration-500",
                                    s < stage ? "bg-[#E8472A]" : "bg-neutral-200"
                                )} />}
                            </div>
                        ))}
                    </div>

                    {/* Autosave + screen count */}
                    <div className="shrink-0 flex items-center gap-2">
                        {autosaved && (
                            <span className="text-[11px] text-green-600 font-medium animate-in fade-in duration-300 hidden sm:block">
                                {t("onboarding.autosaved")}
                            </span>
                        )}
                        <span className="text-[12px] text-[#B0B0B0] font-medium">
                            {currentFlatScreen}/{totalScreens}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
