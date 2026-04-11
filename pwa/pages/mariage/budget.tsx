import { useTranslation } from "next-i18next";
import Head from "next/head";
import PlanningLayout from "../../components/layout/PlanningLayout";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";

interface BudgetItem {
    id: number;
    category: string;
    budgetedAmount: number;
    spentAmount: number;
}

interface WeddingProfile {
    id: number;
    totalBudgetMad: number;
}

export default function BudgetPage() {
    const { t } = useTranslation("common");
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({ category: "", budgetedAmount: 0 });

    const { data: profileData } = useQuery({
        queryKey: ["weddingProfile"],
        queryFn: () => apiClient.get("/api/wedding_profiles?itemsPerPage=1"),
    });

    const profile: WeddingProfile | null = profileData?.["hydra:member"]?.[0] ?? null;
    const profileId = profile?.id ?? null;

    const { data: budgetData } = useQuery({
        queryKey: ["budgetItems", profileId],
        queryFn: () => apiClient.get(`/api/budget_items?weddingProfile=${profileId}`),
        enabled: profileId !== null,
    });

    const items: BudgetItem[] = budgetData?.["hydra:member"] ?? [];
    const totalBudget = profile?.totalBudgetMad ?? 0;

    const addMutation = useMutation({
        mutationFn: (data: { category: string; budgetedAmount: number; weddingProfile: string; spentAmount: number; displayOrder: number }) =>
            apiClient.post("/api/budget_items", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgetItems", profileId] });
            setIsAdding(false);
            setNewItem({ category: "", budgetedAmount: 0 });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => apiClient.delete(`/api/budget_items/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budgetItems", profileId] }),
    });

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!profileId) return;
        addMutation.mutate({
            ...newItem,
            weddingProfile: `/api/wedding_profiles/${profileId}`,
            spentAmount: 0,
            displayOrder: items.length,
        });
    };

    const handleDeleteItem = (id: number) => {
        if (!window.confirm(t("budget.delete_confirm"))) return;
        deleteMutation.mutate(id);
    };

    const totalSpent = items.reduce((acc, curr) => acc + curr.spentAmount, 0);
    const totalBudgeted = items.reduce((acc, curr) => acc + curr.budgetedAmount, 0);
    const remainingBudget = totalBudget - totalSpent;

    return (
        <PlanningLayout
            title={t("budget.title")}
            description={t("budget.description")}
        >
            <Head>
                <title>{t("nav.budget")} — Farah.ma</title>
            </Head>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-8 rounded-[2.5rem] border border-[var(--color-charcoal-100)] shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)] mb-2">{t("budget.summary_total")}</p>
                    <div className="flex items-end gap-2 text-[var(--color-primary)]">
                        <span className="text-3xl font-black">{totalBudget.toLocaleString()}</span>
                        <span className="text-sm font-bold mb-1.5 opacity-60">{t("common.currency")}</span>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-[var(--color-charcoal-100)] shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)] mb-2">{t("budget.summary_spent")}</p>
                    <div className="flex items-end gap-2 text-[var(--color-accent)]">
                        <span className="text-3xl font-black">{totalSpent.toLocaleString()}</span>
                        <span className="text-sm font-bold mb-1.5 opacity-60">{t("common.currency")}</span>
                    </div>
                </div>
                <div className="bg-[var(--color-primary)] p-8 rounded-[2.5rem] shadow-xl shadow-[var(--color-primary)]/10 text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">{t("budget.summary_remaining")}</p>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-black">{remainingBudget.toLocaleString()}</span>
                        <span className="text-sm font-bold mb-1.5 opacity-60">{t("common.currency")}</span>
                    </div>
                </div>
            </div>

            {/* Delete error */}
            {deleteMutation.isError && (
                <div className="mb-6 px-6 py-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold">
                    {t("budget.error_delete")}
                </div>
            )}

            {/* Budget Table / List */}
            <div className="bg-white rounded-[2.5rem] border border-[var(--color-charcoal-100)] overflow-hidden shadow-sm">
                <div className="px-10 py-8 border-b border-[var(--color-background)] flex items-center justify-between">
                    <h3 className="font-display font-black text-2xl text-[var(--color-primary)]">{t("budget.postes_title")}</h3>
                    <Button
                        onClick={() => setIsAdding(true)}
                        className="bg-[var(--color-accent)] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[var(--color-accent-light)] transition-all shadow-lg shadow-[var(--color-accent)]/20 h-auto"
                    >
                        + {t("budget.add_poste")}
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--color-background)]/50">
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)]">{t("budget.col_category")}</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)] text-end">{t("budget.col_budgeted")}</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)] text-end">{t("budget.col_paid")}</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)] text-end">{t("budget.col_actions")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-background)]">
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-10 py-20 text-center text-[var(--color-charcoal-400)] italic font-medium">
                                        {t("budget.empty")}
                                    </td>
                                </tr>
                            )}
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-[var(--color-background)]/30 transition-colors group">
                                    <td className="px-10 py-6 font-bold text-[var(--color-primary)]">{item.category}</td>
                                    <td className="px-10 py-6 text-end font-bold text-[var(--color-charcoal-600)]">{item.budgetedAmount.toLocaleString()} MAD</td>
                                    <td className="px-10 py-6 text-end font-black text-[var(--color-accent)]">{item.spentAmount.toLocaleString()} MAD</td>
                                    <td className="px-10 py-6 text-end">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="text-[var(--color-charcoal-300)] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {items.length > 0 && (
                            <tfoot className="bg-[var(--color-background)]/20">
                                <tr>
                                    <td className="px-10 py-6 font-black text-[var(--color-primary)] uppercase tracking-widest text-xs">{t("budget.totals")}</td>
                                    <td className="px-10 py-6 text-end font-black text-[var(--color-primary)]">{totalBudgeted.toLocaleString()} MAD</td>
                                    <td className="px-10 py-6 text-end font-black text-[var(--color-accent)]">{totalSpent.toLocaleString()} MAD</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-[var(--color-primary)]/40 backdrop-blur-md" onClick={() => setIsAdding(false)} />
                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl border border-[var(--color-accent)]/10 animate-in fade-in zoom-in duration-300">
                        <h3 className="font-display font-black text-2xl text-[var(--color-primary)] mb-8">{t("budget.new_poste_title")}</h3>

                        {addMutation.isError && (
                            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold">
                                {t("budget.error_add")}
                            </div>
                        )}

                        <form onSubmit={handleAddItem} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">{t("budget.col_category")}</Label>
                                <Input
                                    type="text"
                                    required
                                    value={newItem.category}
                                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                                    placeholder={t("budget.category_placeholder")}
                                    className="w-full h-auto bg-[var(--color-background)] border-0.5 border-[var(--color-charcoal-100)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">{t("budget.budgeted_label")}</Label>
                                <Input
                                    type="number"
                                    required
                                    value={newItem.budgetedAmount}
                                    onChange={(e) => setNewItem({...newItem, budgetedAmount: Number(e.target.value)})}
                                    className="w-full h-auto bg-[var(--color-background)] border-0.5 border-[var(--color-charcoal-100)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] outline-none transition-all"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 py-6 border-2 border-[var(--color-primary)] rounded-2xl text-xs font-black uppercase tracking-widest text-[var(--color-primary)] hover:bg-[var(--color-background)] transition-all"
                                >
                                    {t("common.cancel")}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={addMutation.isPending}
                                    className="flex-1 py-6 bg-[var(--color-accent)] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[var(--color-accent-light)] transition-all shadow-xl shadow-[var(--color-accent)]/20 disabled:opacity-60"
                                >
                                    {addMutation.isPending ? t("common.loading") : t("common.save")}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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
