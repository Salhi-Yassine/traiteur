import { useTranslation } from "next-i18next";
import Head from "next/head";
import PlanningLayout from "../../components/layout/PlanningLayout";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import SuccessAnimation from "../../components/ui/SuccessAnimation";
import apiClient from "../../utils/apiClient";
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
}

export default function WeddingDashboard() {
    const { t } = useTranslation("common");
    const { user } = useAuth();
    const [showSuccess, setShowSuccess] = useState(false);

    const { data: profileData } = useQuery({
        queryKey: ["weddingProfile"],
        queryFn: () => apiClient.get("/api/wedding_profiles?itemsPerPage=1"),
    });

    const wp: WeddingProfileDashboard | null = profileData?.["hydra:member"]?.[0] ?? null;

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

            {/* Setup Progress Header */}
            {setupPercent < 100 && (
                <div className="mb-10 p-8 bg-white rounded-xl border border-neutral-200 shadow-sm relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                                    {t("dashboard.onboarding")}
                                </span>
                                <h2 className="text-xl font-display font-bold text-neutral-900">
                                    {t("dashboard.complete_setup")}
                                </h2>
                            </div>
                            <p className="text-neutral-500 text-sm mb-4">
                                {t("dashboard.setup_desc", { count: setupSteps.length - setupDoneCount })}
                            </p>
                            
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-primary transition-all duration-1000 ease-out"
                                        style={{ width: `${setupPercent}%` }}
                                    />
                                </div>
                                <span className="text-sm font-black text-neutral-900">{Math.round(setupPercent)}%</span>
                            </div>
                        </div>

                        {nextStep && (
                            <Link 
                                href={nextStep.href}
                                className="inline-flex items-center justify-center px-6 h-12 bg-neutral-900 text-white rounded-full text-sm font-bold hover:bg-black transition-colors shadow-lg shadow-black/10 shrink-0"
                            >
                                {nextStep.label} →
                            </Link>
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Budget Card */}
                <Link href="/mariage/budget" className="group p-8 bg-white rounded-xl border border-neutral-200 hover:shadow-3 transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("dashboard.manage")}</span>
                    </div>
                    <h3 className="font-display font-bold text-2xl text-neutral-900 mb-2">{t("nav.budget")}</h3>
                    <div className="space-y-4">
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-black text-neutral-900">{budgetSpent.toLocaleString()}</span>
                            <span className="text-sm font-bold text-neutral-500 mb-1.5">/ {budgetTotal.toLocaleString()} MAD</span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-1000"
                                style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                            />
                        </div>
                    </div>
                </Link>

                {/* Guests Card */}
                <Link href="/mariage/invites" className="group p-8 bg-white rounded-xl border border-neutral-200 hover:shadow-3 transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("dashboard.list")}</span>
                    </div>
                    <h3 className="font-display font-bold text-2xl text-neutral-900 mb-2">{t("nav.guests")}</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-black text-neutral-900">{guestsCount}</span>
                        <span className="text-sm font-bold text-neutral-500 mb-1.5">{t("dashboard.guests_unit")}</span>
                    </div>
                </Link>

                {/* Checklist Card */}
                <Link href="/mariage/checklist" className="group p-8 bg-white rounded-xl border border-neutral-200 hover:shadow-3 transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("dashboard.tasks")}</span>
                    </div>
                    <h3 className="font-display font-bold text-2xl text-neutral-900 mb-2">{t("nav.checklist")}</h3>
                    <div className="space-y-4">
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-black text-neutral-900">{tasksDone}</span>
                            <span className="text-sm font-bold text-neutral-500 mb-1.5">/ {t("dashboard.tasks_done", { count: tasksTotal })}</span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-neutral-900 transition-all duration-1000"
                                style={{ width: `${Math.min(tasksPercent, 100)}%` }}
                            />
                        </div>
                    </div>
                </Link>
            </div>

            {/* Tip of the day */}
            <div className="mt-12 bg-white rounded-xl p-10 border border-neutral-200 relative overflow-hidden shadow-2">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">{t("dashboard.expert_tip")}</h4>
                <p className="font-display text-2xl text-neutral-900 leading-relaxed italic max-w-2xl relative z-10">
                    "{t("dashboard.tip_content")}"
                </p>
                <p className="mt-6 text-neutral-500 font-bold text-sm">— {t("dashboard.tip_author")}</p>
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
