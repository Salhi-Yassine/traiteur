import { useTranslation } from "next-i18next";
import Head from "next/head";
import PlanningLayout from "../../components/layout/PlanningLayout";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
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
    totalBudgetMad?: number;
    budgetItems?: BudgetItemSummary[];
    guests?: unknown[];
    checklistTasks?: ChecklistTaskSummary[];
}

export default function WeddingDashboard() {
    const { t } = useTranslation("common");
    const { user } = useAuth();

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

    return (
        <PlanningLayout
            title={t("dashboard.welcome", { name: user?.firstName })}
            description={t("dashboard.subtitle")}
        >
            <Head>
                <title>{t("nav.dashboard")} — Farah.ma</title>
            </Head>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Budget Card */}
                <Link href="/mariage/budget" className="group p-10 bg-white rounded-[3rem] border border-[var(--color-charcoal-100)] hover:border-[var(--color-accent)]/30 hover:shadow-2xl hover:shadow-[var(--color-accent)]/10 transition-all">
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--color-background)] flex items-center justify-center text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-white transition-all">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-[var(--color-accent)]">{t("dashboard.manage")}</span>
                    </div>
                    <h3 className="font-display font-black text-2xl text-[var(--color-primary)] mb-2">{t("nav.budget")}</h3>
                    <div className="space-y-4">
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-black text-[var(--color-primary)]">{budgetSpent.toLocaleString()}</span>
                            <span className="text-sm font-bold text-[var(--color-charcoal-400)] mb-1.5">/ {budgetTotal.toLocaleString()} MAD</span>
                        </div>
                        <div className="h-2 w-full bg-[var(--color-background)] rounded-full overflow-hidden">
                            {/* Dynamic width is a runtime value — inline style is the correct approach here */}
                            <div
                                className="h-full bg-[var(--color-accent)] transition-all duration-1000"
                                style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                            />
                        </div>
                    </div>
                </Link>

                {/* Guests Card */}
                <Link href="/mariage/invites" className="group p-10 bg-white rounded-[3rem] border border-[var(--color-charcoal-100)] hover:border-[var(--color-accent)]/30 hover:shadow-2xl hover:shadow-[var(--color-accent)]/10 transition-all">
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--color-background)] flex items-center justify-center text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-white transition-all">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-[var(--color-accent)]">{t("dashboard.list")}</span>
                    </div>
                    <h3 className="font-display font-black text-2xl text-[var(--color-primary)] mb-2">{t("nav.guests")}</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-black text-[var(--color-primary)]">{guestsCount}</span>
                        <span className="text-sm font-bold text-[var(--color-charcoal-400)] mb-1.5">{t("dashboard.guests_unit")}</span>
                    </div>
                </Link>

                {/* Checklist Card */}
                <Link href="/mariage/checklist" className="group p-10 bg-white rounded-[3rem] border border-[var(--color-charcoal-100)] hover:border-[var(--color-accent)]/30 hover:shadow-2xl hover:shadow-[var(--color-accent)]/10 transition-all">
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--color-background)] flex items-center justify-center text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-white transition-all">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-[var(--color-accent)]">{t("dashboard.tasks")}</span>
                    </div>
                    <h3 className="font-display font-black text-2xl text-[var(--color-primary)] mb-2">{t("nav.checklist")}</h3>
                    <div className="space-y-4">
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-black text-[var(--color-primary)]">{tasksDone}</span>
                            <span className="text-sm font-bold text-[var(--color-charcoal-400)] mb-1.5">/ {t("dashboard.tasks_done", { count: tasksTotal })}</span>
                        </div>
                        <div className="h-2 w-full bg-[var(--color-background)] rounded-full overflow-hidden">
                            {/* Dynamic width is a runtime value — inline style is the correct approach here */}
                            <div
                                className="h-full bg-[var(--color-primary)] transition-all duration-1000"
                                style={{ width: `${Math.min(tasksPercent, 100)}%` }}
                            />
                        </div>
                    </div>
                </Link>
            </div>

            {/* Tip of the day */}
            <div className="mt-12 bg-[var(--color-accent)]/5 rounded-[3rem] p-12 border border-[var(--color-accent)]/10 relative overflow-hidden">
                <div className="absolute top-0 end-0 w-64 h-64 bg-[var(--color-accent)]/5 rounded-full -me-32 -mt-32 blur-3xl" />
                <h4 className="text-[var(--color-accent)] text-xs font-black uppercase tracking-[0.3em] mb-4">{t("dashboard.expert_tip")}</h4>
                <p className="font-display text-2xl text-[var(--color-primary)] italic max-w-2xl leading-relaxed">
                    {t("dashboard.tip_content")}
                </p>
                <p className="mt-4 text-[var(--color-charcoal-400)] font-bold">— {t("dashboard.tip_author")}</p>
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
