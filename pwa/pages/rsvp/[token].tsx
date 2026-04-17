import { useState } from "react";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { Check, X, Utensils, MessageSquare, ArrowRight, Heart, Sparkles } from "lucide-react";
import apiClient from "../../utils/apiClient";
import SuccessAnimation from "../../components/ui/SuccessAnimation";
import { cn } from "@/lib/utils";
import { Button } from "../../components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface GuestData {
    fullName: string;
    rsvpStatus: string;
    mealPreference?: string;
    notes?: string;
    guestToken: string;
}

const FALLBACK_GUEST: GuestData = {
    fullName: "Yassine Salhi",
    rsvpStatus: "pending",
    guestToken: "fallback-token"
};

export default function RSVPPage({ initialGuest }: { initialGuest: GuestData | null }) {
    const { t } = useTranslation("common");
    const data = initialGuest || FALLBACK_GUEST;

    const [step, setStep] = useState(1); // 1: Welcome/Confirm, 2: Preferences, 3: Success
    const [rsvp, setRsvp] = useState(data.rsvpStatus);
    const [meal, setMeal] = useState(data.mealPreference || "standard");
    const [notes, setNotes] = useState(data.notes || "");
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
            if (data.guestToken !== "fallback-token") {
                await apiClient.patch(`/api/public/guests/${data.guestToken}`, {
                    rsvpStatus: finalRsvp || rsvp,
                    mealPreference: meal,
                    notes: notes
                });
            } else {
                // Premium Mock Delay
                await new Promise(resolve => setTimeout(resolve, 1200));
            }
            setStep(3);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 100 : -100,
            opacity: 0
        })
    };

    if (step === 3) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
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
        <div className="min-h-screen bg-white md:bg-neutral-50 flex items-center justify-center p-0 md:p-6 selection:bg-primary/20">
            <Head>
                <title>{t("rsvp.page_title")} — Farah.ma</title>
            </Head>

            <div className="w-full max-w-2xl bg-white md:rounded-[3rem] md:shadow-2xl md:shadow-black/5 overflow-hidden flex flex-col min-h-screen md:min-h-0 relative">
                
                {/* Background Blobs (Premium Touch) */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                {/* Vertical Step Progress */}
                <div className="absolute top-12 right-12 flex flex-col items-center gap-2 hidden md:flex">
                    {[1, 2].map(s => (
                        <div 
                            key={s} 
                            className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all duration-500",
                                step === s ? "h-6 bg-primary" : "bg-neutral-200"
                            )} 
                        />
                    ))}
                </div>

                {/* Header Section */}
                <div className="p-12 pb-6 flex flex-col items-center text-center relative z-10">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary mb-8 shadow-xl shadow-primary/5 border border-primary/20"
                    >
                        <Heart className="w-10 h-10 fill-current" />
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-display text-4xl font-black text-neutral-900 mb-4 tracking-tight"
                    >
                        {t("rsvp.welcome", { name: data.fullName })}
                    </motion.h1>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-2 text-primary font-bold tracking-[0.2em] text-xs uppercase"
                    >
                        <Sparkles className="w-3 h-3" />
                        {t("rsvp.wedding_notice")}
                        <Sparkles className="w-3 h-3" />
                    </motion.div>
                </div>

                <div className="p-12 pt-10 flex-1 relative z-10">
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
                                className="space-y-10"
                            >
                                <h2 className="text-2xl font-display font-bold text-center text-neutral-900">
                                    {t("rsvp.question_attendance")}
                                </h2>
                                <div className="grid grid-cols-1 gap-6">
                                    <button
                                        onClick={() => handleConfirmSelection("confirmed")}
                                        className="group relative flex items-center justify-between p-8 rounded-[2rem] border-2 border-neutral-100 hover:border-primary hover:bg-primary/[0.02] transition-all bg-white shadow-sm hover:shadow-xl hover:shadow-primary/5"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-neutral-50 group-hover:bg-primary/10 flex items-center justify-center text-neutral-400 group-hover:text-primary transition-colors">
                                                <Check className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <p className="font-display text-xl font-bold text-neutral-900">{t("rsvp.choice_yes")}</p>
                                                <p className="text-sm text-neutral-500 mt-1">{t("rsvp.choice_yes_desc")}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-6 h-6 text-neutral-300 group-hover:text-primary group-hover:translate-x-2 transition-all" />
                                    </button>

                                    <button
                                        onClick={() => handleConfirmSelection("declined")}
                                        disabled={isLoading}
                                        className="group flex items-center justify-between p-8 rounded-[2rem] border-2 border-neutral-100 hover:border-neutral-900 hover:bg-neutral-50 transition-all bg-white"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-neutral-50 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center text-neutral-400 transition-colors">
                                                <X className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <p className="font-display text-xl font-bold text-neutral-900">{t("rsvp.choice_no")}</p>
                                                <p className="text-sm text-neutral-500 mt-1">{t("rsvp.choice_no_desc")}</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-6 h-6 text-neutral-300 group-hover:text-neutral-900 group-hover:translate-x-2 transition-all" />
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
                                className="space-y-10"
                            >
                                <div className="space-y-6">
                                    <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                                        <Utensils className="w-4 h-4" />
                                        {t("rsvp.meal_preference")}
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {["standard", "vegetarian", "children"].map((m) => (
                                            <button
                                                key={m}
                                                onClick={() => setMeal(m)}
                                                className={cn(
                                                    "px-6 py-5 rounded-2xl border-2 font-display font-bold text-base transition-all scale-100 active:scale-95 shadow-sm",
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

                                <div className="space-y-6">
                                    <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-primary">
                                        <MessageSquare className="w-4 h-4" />
                                        {t("rsvp.notes_label")}
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder={t("rsvp.notes_placeholder")}
                                        className="w-full p-8 rounded-[2rem] border-2 border-neutral-100 focus:border-primary focus:ring-0 text-neutral-900 text-lg placeholder:text-neutral-200 transition-all resize-none h-40 bg-white shadow-sm"
                                    />
                                </div>

                                <div className="flex flex-col gap-6 pt-4">
                                    <Button
                                        onClick={() => handleFinalSubmit()}
                                        disabled={isLoading}
                                        className="w-full h-16 bg-[#1A1A1A] text-white rounded-[2rem] font-display text-xl font-bold shadow-2xl shadow-black/20 hover:bg-black hover:scale-[1.02] transition-all"
                                    >
                                        {isLoading ? t("common.loading") : t("rsvp.submit_btn")}
                                    </Button>
                                    <button 
                                        onClick={() => setStep(1)}
                                        className="text-base font-bold text-neutral-400 hover:text-primary transition-colors flex items-center justify-center gap-2"
                                    >
                                        ← {t("common.back")}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
    try {
        const { token } = params as { token: string };
        const response = await apiClient.get(`/api/public/guests/${token}`);
        
        return {
            props: {
                initialGuest: response,
                ...(await serverSideTranslations(locale || "fr", ["common"])),
            },
        };
    } catch (error) {
        return {
            props: {
                initialGuest: null,
                ...(await serverSideTranslations(locale || "fr", ["common"])),
            },
        };
    }
};
