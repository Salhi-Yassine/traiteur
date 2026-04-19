import { useTranslation } from "next-i18next";
import Head from "next/head";
import PlanningLayout from "../../components/layout/PlanningLayout";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Wallet, TrendingUp, Plus, PieChart, ArrowUpRight, Trash2 } from "lucide-react";

interface BudgetItem {
    id: number;
    title: string;
    category: string;
    estimatedAmount: number;
    spentAmount: number;
    isPaid: boolean;
}

interface WeddingProfile {
    id: number;
    totalBudgetMad: number;
}

export default function BudgetPage() {
    const { t } = useTranslation("common");
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({ title: "", category: "", estimatedAmount: 0 });

    const { data: profileData } = useQuery({
        queryKey: ["weddingProfile"],
        queryFn: () => apiClient.get("/api/wedding_profiles?itemsPerPage=1"),
    });

    const wp: WeddingProfile | null = (profileData as any)?.["hydra:member"]?.[0] ?? null;
    const profileId = wp?.id ?? null;

    const { data: budgetData } = useQuery({
        queryKey: ["budgetItems", profileId],
        queryFn: () => apiClient.get(`/api/budget_items?weddingProfile=${profileId}`),
        enabled: profileId !== null,
    });

    const items: BudgetItem[] = (budgetData as any)?.["hydra:member"] ?? [];
    const totalBudget = wp?.totalBudgetMad ?? 0;

    const addMutation = useMutation({
        mutationFn: (data: { title: string; category: string; estimatedAmount: number; weddingProfile: string; spentAmount: number; isPaid: boolean }) =>
            apiClient.post("/api/budget_items", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgetItems", profileId] });
            setIsAdding(false);
            setNewItem({ title: "", category: "", estimatedAmount: 0 });
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
            isPaid: false,
        });
    };

    const totalSpent = items.reduce((acc, curr) => acc + curr.spentAmount, 0);
    const progressPercent = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

    return (
        <PlanningLayout
            title={t("budget.title")}
            description={t("budget.description")}
        >
            <Head>
                <title>{t("nav.budget")} — Farah.ma</title>
            </Head>

            {/* Premium Financial Overview */}
            <div className="bg-neutral-900 p-12 md:p-16 rounded-[3rem] text-white shadow-3 mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-primary font-bold text-[13px] uppercase tracking-widest">
                            <Wallet size={16} />
                            Financial Hub
                        </div>
                        <h3 className="font-display text-5xl md:text-6xl">{t("budget.summary_title")}</h3>
                        <div className="flex items-center gap-6">
                            <div>
                                <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1">Total Spent</p>
                                <span className="text-3xl font-black text-white">{totalSpent.toLocaleString()} MAD</span>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div>
                                <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1">Remaining</p>
                                <span className="text-3xl font-black text-primary">{(totalBudget - totalSpent).toLocaleString()} MAD</span>
                            </div>
                        </div>
                    </div>

                    {/* Circular Chart */}
                    <div className="flex items-center gap-10 bg-white/5 p-8 rounded-[2.5rem] backdrop-blur-md border border-white/10">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/10" />
                                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={352} strokeDashoffset={352 - (352 * progressPercent) / 100} strokeLinecap="round" className="text-primary transition-all duration-1000" />
                            </svg>
                            <span className="absolute text-2xl font-black">{Math.round(progressPercent)}%</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <TrendingUp size={16} className="text-primary" />
                                <span className="text-sm font-bold">{t("budget.total_label")}:</span>
                            </div>
                            <p className="text-2xl font-black text-white">{totalBudget.toLocaleString()} MAD</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 mb-8">
                <h4 className="font-display text-3xl text-neutral-900">{t("budget.items_title")}</h4>
                <Button
                    onClick={() => setIsAdding(true)}
                    className="rounded-full px-10 h-14 font-black text-[13px] uppercase shadow-xl shadow-primary/20"
                >
                    <Plus size={18} className="mr-2" />
                    {t("budget.add_item")}
                </Button>
            </div>

            {/* Budget Grid */}
            <div className="bg-white rounded-[3rem] border border-neutral-100 overflow-hidden shadow-sm divide-y divide-neutral-50">
                {items.length === 0 ? (
                    <div className="p-20 text-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center mx-auto text-[#B0B0B0]">
                            <PieChart size={32} />
                        </div>
                        <p className="text-[#717171] font-medium text-lg italic">{t("budget.empty")}</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="group flex items-center justify-between px-10 py-8 hover:bg-[#F7F7F7]/50 transition-all">
                            <div className="flex items-center gap-8">
                                <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                    <ArrowUpRight size={24} />
                                </div>
                                <div>
                                    <h4 className="text-[19px] font-bold text-neutral-900 group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-neutral-100 text-[#717171] rounded-full">
                                            {t(`budget.categories.${item.category}`)}
                                        </span>
                                        {item.isPaid && (
                                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-green-500/10 text-green-500 rounded-full">
                                                Paid
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-12">
                                <div className="text-right">
                                    <p className="text-2xl font-black text-neutral-900">{item.spentAmount.toLocaleString()} MAD</p>
                                    <p className="text-[12px] font-bold text-[#B0B0B0] uppercase tracking-wider mt-1">
                                        Estimated: {item.estimatedAmount.toLocaleString()}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        if (window.confirm(t("budget.delete_confirm"))) {
                                            deleteMutation.mutate(item.id);
                                        }
                                    }}
                                    className="w-12 h-12 rounded-2xl text-[#B0B0B0] hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={20} />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-md" onClick={() => setIsAdding(false)} />
                    <div className="relative bg-white rounded-[3rem] w-full max-w-lg p-12 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h3 className="font-display text-3xl text-neutral-900 mb-8">{t("budget.new_poste_title")}</h3>
                        <form onSubmit={handleAddItem} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black uppercase tracking-widest text-[#717171]">Title</Label>
                                <Input
                                    value={newItem.title}
                                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                    className="rounded-2xl h-14 bg-[#F7F7F7] border-0 focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. Negafa"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black uppercase tracking-widest text-[#717171]">Category</Label>
                                <Input
                                    value={newItem.category}
                                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                    className="rounded-2xl h-14 bg-[#F7F7F7] border-0 focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. venues"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black uppercase tracking-widest text-[#717171]">Estimated Amount (MAD)</Label>
                                <Input
                                    type="number"
                                    value={newItem.estimatedAmount}
                                    onChange={(e) => setNewItem({ ...newItem, estimatedAmount: Number(e.target.value) })}
                                    className="rounded-2xl h-14 bg-[#F7F7F7] border-0 focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div className="flex gap-4 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 h-14 rounded-2xl border-2 font-black uppercase text-[12px]"
                                >
                                    {t("common.cancel")}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={addMutation.isPending}
                                    className="flex-1 h-14 rounded-2xl font-black uppercase text-[12px] shadow-lg shadow-primary/20"
                                >
                                    {t("common.save")}
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
