import { useState } from "react";
import { useTranslation } from "next-i18next";
import { Check, X, Utensils, MessageSquare, ArrowRight, Heart, Sparkles } from "lucide-react";
import apiClient from "../../utils/apiClient";
import SuccessAnimation from "../../components/ui/SuccessAnimation";
import { cn } from "@/lib/utils";
import { Button } from "../../components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export interface GuestData {
    fullName: string;
    rsvpStatus: string;
    mealPreference?: string;
    notes?: string;
    guestToken: string;
}

interface RSVPFlowProps {
    initialGuest: GuestData;
    onComplete?: () => void;
}

export default function RSVPFlow({ initialGuest, onComplete }: RSVPFlowProps) {
    const { t } = useTranslation("common");

    const [step, setStep] = useState(1); // 1: Welcome/Confirm, 2: Preferences, 3: Success
    const [rsvp, setRsvp] = useState(initialGuest.rsvpStatus);
    const [meal, setMeal] = useState(initialGuest.mealPreference || "standard");
    const [notes, setNotes] = useState(initialGuest.notes || "");
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirmSelection = (status: "confirmed" | "declined") => {
        setRsvp(status);
        if (status === "declined") {
            handleFinalSubmit(status);
        } else {
            setStep(2);
        }
    };

    const handleFinalSubmit = async (finalRsvp?: string) => {
        setIsLoading(true);
        try {
            if (initialGuest.guestToken !== "fallback-token") {
                await apiClient.patch(`/api/public/guests/${initialGuest.guestToken}`, {
                    rsvpStatus: finalRsvp || rsvp,
                    mealPreference: meal,
                    notes: notes
                });
            } else {
                // Premium Mock Delay
                await new Promise(resolve => setTimeout(resolve, 1200));
            }
            setStep(3);
            if (onComplete) {
                setTimeout(onComplete, 3000); // Trigger close after 3 seconds of confetti
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0
        })
    };

    if (step === 3) {
        return (
            <div className="flex flex-col items-center justify-center p-6 h-full min-h-[400px]">
                <SuccessAnimation 
                    show={true} 
                    type="confetti" 
                    overlay={true}
                    title={t("rsvp.success_title")}
                    subtitle={rsvp === "confirmed" ? t("rsvp.success_desc_confirm") : t("rsvp.success_desc_decline")}
                />
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col relative bg-white pb-8">
            {/* Header Section */}
            <div className="p-8 pb-4 flex flex-col items-center text-center relative z-10">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-xl shadow-primary/5 border border-primary/20"
                >
                    <Heart className="w-8 h-8 fill-current" />
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-display text-3xl font-black text-neutral-900 mb-2 tracking-tight"
                >
                    {t("rsvp.welcome", { name: initialGuest.fullName })}
                </motion.h1>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 text-primary font-bold tracking-[0.2em] text-[10px] uppercase mt-2"
                >
                    <Sparkles className="w-3 h-3" />
                    {t("rsvp.wedding_notice")}
                    <Sparkles className="w-3 h-3" />
                </motion.div>
            </div>

            <div className="px-6 md:px-8 pt-6 flex-1 relative z-10 overflow-x-hidden min-h-[350px]">
                <AnimatePresence mode="wait" custom={step}>
                    {step === 1 && (
                        <motion.div 
                            key="step-1"
                            custom={step}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="space-y-6"
                        >
                            <h2 className="text-xl font-display font-bold text-center text-neutral-900 mb-6">
                                {t("rsvp.question_attendance")}
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    onClick={() => handleConfirmSelection("confirmed")}
                                    className="group relative flex items-center justify-between p-6 rounded-3xl border-2 border-neutral-100 hover:border-primary hover:bg-primary/[0.02] transition-all bg-white shadow-sm hover:shadow-xl hover:shadow-primary/5 text-start"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-neutral-50 group-hover:bg-primary/10 flex items-center justify-center text-neutral-400 group-hover:text-primary transition-colors shrink-0">
                                            <Check className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-display text-lg font-bold text-neutral-900">{t("rsvp.choice_yes")}</p>
                                            <p className="text-xs text-neutral-500 mt-1">{t("rsvp.choice_yes_desc")}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 rtl:-scale-x-100" />
                                </button>

                                <button
                                    onClick={() => handleConfirmSelection("declined")}
                                    disabled={isLoading}
                                    className="group flex items-center justify-between p-6 rounded-3xl border-2 border-neutral-100 hover:border-neutral-900 hover:bg-neutral-50 transition-all bg-white text-start"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-neutral-50 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center text-neutral-400 transition-colors shrink-0">
                                            <X className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-display text-lg font-bold text-neutral-900">{t("rsvp.choice_no")}</p>
                                            <p className="text-xs text-neutral-500 mt-1">{t("rsvp.choice_no_desc")}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all shrink-0 rtl:-scale-x-100" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div 
                            key="step-2"
                            custom={step}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                    <Utensils className="w-4 h-4" />
                                    {t("rsvp.meal_preference")}
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {["standard", "vegetarian", "children"].map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => setMeal(m)}
                                            className={cn(
                                                "px-4 py-4 rounded-xl border-2 font-display font-bold text-sm transition-all scale-100 active:scale-95 shadow-sm text-center",
                                                meal === m 
                                                    ? "border-primary bg-primary/5 text-primary shadow-primary/10" 
                                                    : "border-neutral-100 bg-white text-neutral-500 hover:border-neutral-200"
                                            )}
                                        >
                                            {t(`rsvp.meal_${m}`)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                    <MessageSquare className="w-4 h-4" />
                                    {t("rsvp.notes_label")}
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder={t("rsvp.notes_placeholder")}
                                    className="w-full p-6 rounded-2xl border-2 border-neutral-100 focus:border-primary focus:ring-0 text-neutral-900 text-base placeholder:text-neutral-200 transition-all resize-none h-32 bg-white shadow-sm"
                                />
                            </div>

                            <div className="flex flex-col gap-4 pt-4">
                                <Button
                                    onClick={() => handleFinalSubmit()}
                                    disabled={isLoading}
                                    className="w-full h-14 bg-[#1A1A1A] text-white rounded-2xl font-display text-lg font-bold shadow-xl shadow-black/10 hover:bg-black hover:scale-[1.02] transition-all"
                                >
                                    {isLoading ? t("common.loading") : t("rsvp.submit_btn")}
                                </Button>
                                <button 
                                    onClick={() => setStep(1)}
                                    className="text-sm font-bold text-neutral-400 hover:text-primary transition-colors flex items-center justify-center gap-1"
                                >
                                    ← {t("common.back")}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Horizontal progress bar mapping current step */}
            {step < 3 && (
                <div className="absolute bottom-0 start-0 w-full h-1 bg-neutral-100">
                    <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: step === 1 ? "50%" : "100%" }}
                        className="h-full bg-primary"
                    />
                </div>
            )}
        </div>
    );
}
