import { useTranslation } from "next-i18next";
import Head from "next/head";
import PlanningLayout from "../../components/layout/PlanningLayout";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import SuccessAnimation from "../../components/ui/SuccessAnimation";
import apiClient from "../../utils/apiClient";
import { cn } from "@/lib/utils";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";

interface BudgetItemSummary {
    spentAmount: number;
}

interface ChecklistTaskSummary {
    isCompleted: boolean;
}

interface WeddingProfileDashboard {
    weddingDate?: string;
    totalBudgetMad?: number;
    budgetItems?: BudgetItemSummary[];
    guests?: unknown[];
    checklistTasks?: ChecklistTaskSummary[];
    ourStory?: string;
    galleryImages?: string[];
}

export default function WeddingDashboard() {
    const { t } = useTranslation("common");
    const { user } = useAuth();
    const [showSuccess, setShowSuccess] = useState(false);

    const { data: profileData } = useQuery({
        queryKey: ["weddingProfile"],
        queryFn: () => apiClient.get("/api/wedding_profiles?itemsPerPage=1"),
    });

    const wp: WeddingProfileDashboard | null = (profileData as any)?.["hydra:member"]?.[0] ?? null;

    const budgetSpent = (wp?.budgetItems ?? []).reduce((acc, item) => acc + item.spentAmount, 0);
    const budgetTotal = wp?.totalBudgetMad ?? 0;
    const guestsCount = wp?.guests?.length ?? 0;
    const tasksTotal = wp?.checklistTasks?.length ?? 0;
    const tasksDone = (wp?.checklistTasks ?? []).filter((task) => task.isCompleted).length;

    const budgetPercent = budgetTotal > 0 ? (budgetSpent / budgetTotal) * 100 : 0;
    const tasksPercent = tasksTotal > 0 ? (tasksDone / tasksTotal) * 100 : 0;

    // ── Setup Progress Calculation ──────────────────────────────────────────
    const setupSteps = [
        { key: "date", met: !!wp?.weddingDate, label: t("dashboard.setup_date"), href: "/mariage/profil" },
        { key: "budget", met: (wp?.totalBudgetMad ?? 0) > 0, label: t("dashboard.setup_budget"), href: "/mariage/budget" },
        { key: "guests", met: (wp?.guests?.length ?? 0) > 0, label: t("dashboard.setup_guests"), href: "/mariage/invites" },
        { key: "tasks", met: tasksDone > 0, label: t("dashboard.setup_tasks"), href: "/mariage/checklist" },
        { key: "website", met: !!wp?.ourStory || (wp?.galleryImages?.length ?? 0) > 0, label: t("dashboard.setup_website"), href: "/mariage/site" },
    ];
    
    const setupDoneCount = setupSteps.filter(s => s.met).length;
    const setupPercent = (setupDoneCount / setupSteps.length) * 100;
    const nextStep = setupSteps.find(s => !s.met);

    // ── Success Ceremony Logic ──────────────────────────────────────────────
    useEffect(() => {
        if (setupPercent === 100) {
            const ceremonyShown = localStorage.getItem(`ceremony_shown_${user?.id}`);
            if (!ceremonyShown) {
                setShowSuccess(true);
                localStorage.setItem(`ceremony_shown_${user?.id}`, "true");
            }
        }
    }, [setupPercent, user?.id]);

    return (
        <PlanningLayout
            title={t("dashboard.welcome", { name: user?.firstName })}
            description={t("dashboard.subtitle")}
        >
            <Head>
                <title>{t("nav.dashboard")} — Farah.ma</title>
            </Head>

            <SuccessAnimation 
                show={showSuccess} 
                onComplete={() => setShowSuccess(false)}
                title={t("dashboard.setup_success_title")}
                subtitle={t("dashboard.setup_success_desc")}
            />

            {/* Next Priority Hero */}
            <div className="mb-12 relative">
                <div className={cn(
                    "p-10 md:p-14 rounded-[3rem] overflow-hidden relative shadow-3 transition-all",
                    setupPercent < 100 ? "bg-neutral-900 text-white" : "bg-white border border-neutral-100"
                )}>
                    {/* Background decoration */}
                    <div className="absolute top-0 end-0 w-96 h-96 bg-primary/10 rounded-full -me-32 -mt-32 blur-3xl opacity-50" />
                    <div className="absolute bottom-0 start-0 w-64 h-64 bg-primary/5 rounded-full -ms-32 -mb-32 blur-3xl opacity-30" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div className="max-w-xl space-y-6">
                            <div className="flex items-center gap-3">
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]",
                                    setupPercent < 100 ? "bg-primary text-white" : "bg-green-500/10 text-green-500"
                                )}>
                                    {setupPercent < 100 ? t("dashboard.onboarding") : "✓ Finalisé"}
                                </span>
                                <span className={cn(
                                    "text-sm font-bold",
                                    setupPercent < 100 ? "text-white/60" : "text-neutral-400"
                                )}>
                                    {Math.round(setupPercent)}% {t("dashboard.complete_setup")}
                                </span>
                            </div>

                            <h2 className={cn(
                                "font-display text-4xl md:text-5xl leading-[1.1]",
                                setupPercent < 100 ? "text-white" : "text-neutral-900"
                            )}>
                                {setupPercent < 100 
                                    ? t("dashboard.complete_setup")
                                    : t("dashboard.ready_title", "Votre mariage est prêt !")
                                }
                            </h2>

                            <p className={cn(
                                "text-lg leading-relaxed",
                                setupPercent < 100 ? "text-white/70" : "text-neutral-500"
                            )}>
                                {setupPercent < 100 
                                    ? t("dashboard.setup_desc", { count: setupSteps.length - setupDoneCount })
                                    : t("dashboard.ready_desc", "Tout est en place. Vous pouvez maintenant partager votre site et suivre vos invités.")
                                }
                            </p>

                            {nextStep && (
                                <Link 
                                    href={nextStep.href}
                                    className="inline-flex items-center justify-center px-10 h-16 bg-white text-neutral-900 rounded-full text-[15px] font-black hover:scale-105 transition-all shadow-xl shadow-black/20"
                                >
                                    {nextStep.label} →
                                </Link>
                            )}
                        </div>

                        {/* Radial Progress Graphic */}
                        <div className="relative w-40 h-40 shrink-0 hidden md:flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    className={setupPercent < 100 ? "text-white/10" : "text-neutral-100"}
                                />
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    strokeDasharray={440}
                                    strokeDashoffset={440 - (440 * setupPercent) / 100}
                                    strokeLinecap="round"
                                    className="text-primary transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <span className={cn(
                                "absolute text-3xl font-black",
                                setupPercent < 100 ? "text-white" : "text-neutral-900"
                            )}>
                                {Math.round(setupPercent)}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Budget Card */}
                <Link href="/mariage/budget" className="group p-10 bg-white rounded-[2.5rem] border border-neutral-100 hover:shadow-3 transition-all duration-500 overflow-hidden relative">
                    <div className="absolute top-0 end-0 p-8 opacity-5 group-hover:scale-110 transition-transform text-primary">
                        <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-[#FEF0ED] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full">{t("dashboard.manage")}</span>
                    </div>
                    
                    <h3 className="font-display font-bold text-3xl text-neutral-900 mb-2">{t("nav.budget")}</h3>
                    <div className="space-y-6">
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-neutral-900">{budgetSpent.toLocaleString()}</span>
                            <span className="text-[15px] font-bold text-[#717171] mb-2">/ {budgetTotal.toLocaleString()} MAD</span>
                        </div>
                        <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-1000 shadow-lg shadow-primary/20"
                                style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                            />
                        </div>
                    </div>
                </Link>

                {/* Guests Card */}
                <Link href="/mariage/invites" className="group p-10 bg-white rounded-[2.5rem] border border-neutral-100 hover:shadow-3 transition-all duration-500 overflow-hidden relative">
                    <div className="absolute top-0 end-0 p-8 opacity-5 group-hover:scale-110 transition-transform text-primary">
                        <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>

                    <div className="flex items-center justify-between mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-[#FEF0ED] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full">{t("dashboard.list")}</span>
                    </div>
                    <h3 className="font-display font-bold text-3xl text-neutral-900 mb-2">{t("nav.guests")}</h3>
                    <div className="flex items-end gap-3">
                        <span className="text-4xl font-black text-neutral-900">{guestsCount}</span>
                        <span className="text-[15px] font-bold text-[#717171] mb-2">{t("dashboard.guests_unit")}</span>
                    </div>
                </Link>

                {/* Checklist Card */}
                <Link href="/mariage/checklist" className="group p-10 bg-white rounded-[2.5rem] border border-neutral-100 hover:shadow-3 transition-all duration-500 overflow-hidden relative">
                    <div className="absolute top-0 end-0 p-8 opacity-5 group-hover:scale-110 transition-transform text-neutral-900">
                        <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>

                    <div className="flex items-center justify-between mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900 group-hover:bg-neutral-900 group-hover:text-white transition-all shadow-sm">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">{t("dashboard.tasks")}</span>
                    </div>
                    <h3 className="font-display font-bold text-3xl text-neutral-900 mb-2">{t("nav.checklist")}</h3>
                    <div className="space-y-6">
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-black text-neutral-900">{tasksDone}</span>
                            <span className="text-[15px] font-bold text-[#717171] mb-2">/ {t("dashboard.tasks_done", { count: tasksTotal })}</span>
                        </div>
                        <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-neutral-900 transition-all duration-1000"
                                style={{ width: `${Math.min(tasksPercent, 100)}%` }}
                            />
                        </div>
                    </div>
                </Link>

                {/* Wedding Website Card */}
                <Link href="/mariage/site" className="group p-10 bg-neutral-900 text-white rounded-[2.5rem] border border-neutral-800 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                    <div className="absolute top-0 end-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                        <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9c1.657 0 3 1.343 3 3s-1.343 3-3 3m0-6c-1.657 0-3 1.343-3 3s1.343 3 3 3m-3-7V7m0 0l-1 1m1-1l1 1m0 0v2" />
                        </svg>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t("dashboard.website")}</span>
                        </div>
                        <h3 className="font-display font-bold text-3xl mb-2">{t("dashboard.my_website")}</h3>
                        <p className="text-neutral-400 text-[15px] leading-relaxed">{t("dashboard.website_desc")}</p>
                    </div>
                </Link>
            </div>

            {/* Tip of the day */}
            <div className="mt-12 bg-white rounded-[3rem] p-12 md:p-16 border border-neutral-100 relative overflow-hidden shadow-2">
                <div className="absolute top-0 end-0 w-80 h-80 bg-primary/5 rounded-full -me-40 -mt-40 blur-3xl opacity-50" />
                <h4 className="text-primary text-[11px] font-black uppercase tracking-[0.4em] mb-6">{t("dashboard.expert_tip")}</h4>
                <p className="font-display text-3xl md:text-4xl text-neutral-900 leading-[1.3] italic max-w-3xl relative z-10">
                    &ldquo;{t("dashboard.tip_content")}&rdquo;
                </p>
                <div className="mt-10 flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                    <p className="text-[#717171] font-bold text-[15px]">— {t("dashboard.tip_author")}</p>
                </div>
            </div>
        </PlanningLayout>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale || "fr", ["common"])),
        },
    };
};
