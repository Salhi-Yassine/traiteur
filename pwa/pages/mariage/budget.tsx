import { useTranslation } from "next-i18next";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { Wallet, Plus, PieChart, ArrowUpRight, Trash2, Check, X, AlertTriangle, Pencil } from "lucide-react";
import PlanningLayout from "../../components/layout/PlanningLayout";
import apiClient from "../../utils/apiClient";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import BudgetDonutChart from "../../components/budget/BudgetDonutChart";
import { formatMAD } from "../../lib/utils";

const CATEGORY_KEYS = [
    "salle", "traiteur", "photographe", "decoration", "negafa",
    "musique", "voiture", "invitation", "beaute", "autre",
] as const;

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

interface EditValues {
    spentAmount: number;
    estimatedAmount: number;
}

export default function BudgetPage() {
    const { t } = useTranslation("common");
    const { locale } = useRouter();
    const queryClient = useQueryClient();

    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({ title: "", category: "", estimatedAmount: 0 });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<EditValues>({ spentAmount: 0, estimatedAmount: 0 });
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [draftBudget, setDraftBudget] = useState(0);

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
    const totalSpent = items.reduce((acc, curr) => acc + curr.spentAmount, 0);
    const totalEstimated = items.reduce((acc, curr) => acc + curr.estimatedAmount, 0);
    const progressPercent = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
    const isOverBudget = totalBudget > 0 && totalSpent > totalBudget;

    const addMutation = useMutation({
        mutationFn: (data: { title: string; category: string; estimatedAmount: number; weddingProfile: string; spentAmount: number; isPaid: boolean }) =>
            apiClient.post("/api/budget_items", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgetItems", profileId] });
            setIsAdding(false);
            setNewItem({ title: "", category: "", estimatedAmount: 0 });
        },
    });

    const patchMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<BudgetItem> }) =>
            apiClient.patch(`/api/budget_items/${id}`, data, {
                headers: { "Content-Type": "application/merge-patch+json" },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["budgetItems", profileId] });
            setEditingId(null);
        },
    });

    const patchBudgetMutation = useMutation({
        mutationFn: (amount: number) =>
            apiClient.patch(`/api/wedding_profiles/${profileId}`, { totalBudgetMad: amount }, {
                headers: { "Content-Type": "application/merge-patch+json" },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["weddingProfile"] });
            setIsEditingBudget(false);
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

    const startEdit = (item: BudgetItem) => {
        setEditingId(item.id);
        setEditValues({ spentAmount: item.spentAmount, estimatedAmount: item.estimatedAmount });
    };

    const saveEdit = (id: number) => patchMutation.mutate({ id, data: editValues });
    const cancelEdit = () => setEditingId(null);
    const togglePaid = (item: BudgetItem) => patchMutation.mutate({ id: item.id, data: { isPaid: !item.isPaid } });

    const startEditBudget = () => {
        setDraftBudget(totalBudget);
        setIsEditingBudget(true);
    };

    return (
        <PlanningLayout title={t("budget.title")} description={t("budget.description")}>
            <Head>
                <title>{t("nav.budget")} — Farah.ma</title>
            </Head>

            {/* Financial Overview */}
            <div className="bg-neutral-900 p-12 md:p-16 rounded-[3rem] text-white shadow-3 mb-12 relative overflow-hidden">
                <div className="absolute top-0 end-0 w-96 h-96 bg-primary/20 rounded-full -me-32 -mt-32 blur-3xl opacity-50" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-primary font-bold text-[13px] uppercase tracking-widest">
                            <Wallet size={16} />
                            {t("budget.financial_hub")}
                        </div>
                        <h3 className="font-display text-5xl md:text-6xl">{t("budget.summary_title")}</h3>

                        {totalBudget === 0 && !isEditingBudget ? (
                            <div className="flex flex-col gap-4">
                                <p className="text-white/50 text-base font-medium max-w-xs">
                                    {t("budget.set_budget_cta")}
                                </p>
                                <Button
                                    onClick={startEditBudget}
                                    className="w-fit rounded-full px-8 h-12 font-black text-[12px] uppercase bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
                                >
                                    <Pencil size={14} className="me-2" />
                                    {t("budget.total_budget_label")}
                                </Button>
                            </div>
                        ) : (
                        <>
                        <div className="flex items-center gap-6 flex-wrap">
                            {/* Total budget — editable */}
                            <div className="group/budget">
                                <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1">
                                    {t("budget.total_budget_label")}
                                </p>
                                {isEditingBudget ? (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            value={draftBudget}
                                            onChange={(e) => setDraftBudget(Number(e.target.value))}
                                            placeholder={t("budget.edit_budget_placeholder")}
                                            className="w-40 h-10 rounded-xl bg-white/10 border border-white/20 text-white font-black focus:border-primary"
                                            autoFocus
                                        />
                                        <Button
                                            size="icon"
                                            onClick={() => patchBudgetMutation.mutate(draftBudget)}
                                            disabled={patchBudgetMutation.isPending}
                                            className="w-9 h-9 rounded-xl bg-primary hover:bg-primary/90 flex-shrink-0"
                                        >
                                            <Check size={16} />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => setIsEditingBudget(false)}
                                            className="w-9 h-9 rounded-xl text-white/50 hover:text-white hover:bg-white/10 flex-shrink-0"
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={startEditBudget}
                                        className="flex items-center gap-2 group/btn"
                                    >
                                        <span className="text-3xl font-black text-white">
                                            {formatMAD(totalBudget, locale)}
                                        </span>
                                        <Pencil
                                            size={14}
                                            className="text-white/0 group-hover/btn:text-white/50 transition-colors"
                                        />
                                    </button>
                                )}
                            </div>

                            <div className="w-px h-10 bg-white/10" />

                            <div>
                                <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1">
                                    {t("budget.total_spent")}
                                </p>
                                <span className={`text-3xl font-black ${isOverBudget ? "text-red-400" : "text-white"}`}>
                                    {formatMAD(totalSpent, locale)}
                                </span>
                            </div>

                            <div className="w-px h-10 bg-white/10" />

                            <div>
                                <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1">
                                    {t("budget.remaining")}
                                </p>
                                <span className={`text-3xl font-black ${isOverBudget ? "text-red-400" : "text-primary"}`}>
                                    {formatMAD(totalBudget - totalSpent, locale)}
                                </span>
                            </div>
                        </div>

                        {isOverBudget && (
                            <div className="flex items-center gap-3 bg-red-500/15 border border-red-500/30 rounded-2xl px-5 py-3 text-red-400">
                                <AlertTriangle size={16} className="flex-shrink-0" />
                                <span className="text-[12px] font-black uppercase tracking-widest">
                                    {t("budget.over_budget_global")}
                                </span>
                            </div>
                        )}
                        </>
                        )}
                    </div>

                    <BudgetDonutChart items={items} totalBudget={totalBudget} progressPercent={progressPercent} />
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 mb-8">
                <h4 className="font-display text-3xl text-neutral-900">{t("budget.items_title")}</h4>
                <Button
                    onClick={() => setIsAdding(true)}
                    className="rounded-full px-10 h-14 font-black text-[13px] uppercase shadow-xl shadow-primary/20"
                >
                    <Plus size={18} className="me-2" />
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
                    <>
                    {items.map((item) => {
                        const isEditing = editingId === item.id;
                        const isItemOverBudget = item.spentAmount > item.estimatedAmount && item.estimatedAmount > 0;

                        return (
                            <div
                                key={item.id}
                                className={`group flex items-center justify-between px-10 py-8 transition-all ${isEditing ? "bg-[#F7F7F7]" : "hover:bg-[#F7F7F7]/50"}`}
                            >
                                {/* Left */}
                                <div className="flex items-center gap-8">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                                        isItemOverBudget
                                            ? "bg-red-50 text-red-500"
                                            : "bg-neutral-100 text-neutral-900 group-hover:bg-primary group-hover:text-white"
                                    }`}>
                                        {isItemOverBudget ? <AlertTriangle size={22} /> : <ArrowUpRight size={24} />}
                                    </div>
                                    <div>
                                        <h4 className={`text-[19px] font-bold transition-colors ${
                                            isItemOverBudget ? "text-red-500" : "text-neutral-900 group-hover:text-primary"
                                        }`}>
                                            {item.title}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-neutral-100 text-[#717171] rounded-full">
                                                {t(`budget.categories.${item.category}`, { defaultValue: item.category })}
                                            </span>
                                            {isItemOverBudget && (
                                                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-red-500/10 text-red-500 rounded-full">
                                                    {t("budget.over_budget_item")}
                                                </span>
                                            )}
                                            <button
                                                onClick={() => togglePaid(item)}
                                                title={item.isPaid ? t("budget.mark_unpaid") : t("budget.mark_paid")}
                                                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all ${
                                                    item.isPaid
                                                        ? "bg-green-500/10 text-green-500 hover:bg-red-500/10 hover:text-red-500"
                                                        : "bg-neutral-100 text-[#B0B0B0] hover:bg-green-500/10 hover:text-green-500 opacity-0 group-hover:opacity-100"
                                                }`}
                                            >
                                                {item.isPaid ? t("budget.paid_badge") : <Check size={12} />}
                                            </button>
                                        </div>
                                        {!isEditing && item.estimatedAmount > 0 && (
                                            <div className="mt-2.5 w-48 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${
                                                        isItemOverBudget ? "bg-red-400" : item.isPaid ? "bg-green-400" : "bg-primary"
                                                    }`}
                                                    style={{ width: `${Math.min((item.spentAmount / item.estimatedAmount) * 100, 100)}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right */}
                                <div className="flex items-center gap-6">
                                    {isEditing ? (
                                        <div className="flex items-end gap-3">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#B0B0B0] text-end">
                                                    {t("budget.edit_spent_label")}
                                                </p>
                                                <Input
                                                    type="number"
                                                    value={editValues.spentAmount}
                                                    onChange={(e) => setEditValues((v) => ({ ...v, spentAmount: Number(e.target.value) }))}
                                                    className="w-36 h-11 rounded-xl bg-white border-2 border-primary/30 focus:border-primary text-end font-black text-neutral-900"
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#B0B0B0] text-end">
                                                    {t("budget.edit_estimated_label")}
                                                </p>
                                                <Input
                                                    type="number"
                                                    value={editValues.estimatedAmount}
                                                    onChange={(e) => setEditValues((v) => ({ ...v, estimatedAmount: Number(e.target.value) }))}
                                                    className="w-36 h-11 rounded-xl bg-white border-2 border-neutral-200 focus:border-primary text-end font-black text-neutral-900"
                                                />
                                            </div>
                                            <div className="flex gap-2 pb-0.5">
                                                <Button
                                                    size="icon"
                                                    onClick={() => saveEdit(item.id)}
                                                    disabled={patchMutation.isPending}
                                                    className="w-11 h-11 rounded-xl bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                                                >
                                                    <Check size={18} />
                                                </Button>
                                                <Button size="icon" variant="outline" onClick={cancelEdit} className="w-11 h-11 rounded-xl border-2">
                                                    <X size={18} />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-6">
                                            <div className="text-end">
                                                <p className={`text-2xl font-black ${isItemOverBudget ? "text-red-500" : "text-neutral-900"}`}>
                                                    {formatMAD(item.spentAmount, locale)}
                                                </p>
                                                <p className="text-[12px] font-bold text-[#B0B0B0] uppercase tracking-wider mt-1">
                                                    {t("budget.estimated")}: {formatMAD(item.estimatedAmount, locale)}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => startEdit(item)}
                                                    className="w-12 h-12 rounded-2xl text-[#B0B0B0] hover:text-primary hover:bg-primary/5 transition-all"
                                                >
                                                    <Pencil size={18} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => { if (window.confirm(t("budget.delete_confirm"))) deleteMutation.mutate(item.id); }}
                                                    className="w-12 h-12 rounded-2xl text-[#B0B0B0] hover:text-red-500 hover:bg-red-50 transition-all"
                                                >
                                                    <Trash2 size={20} />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {/* Totals footer */}
                    <div className="flex items-center justify-between px-10 py-6 bg-neutral-50 border-t-2 border-neutral-100">
                        <span className="text-[11px] font-black uppercase tracking-widest text-[#B0B0B0]">
                            {t("budget.totals")}
                        </span>
                        <div className="text-end">
                            <p className={`text-xl font-black ${isOverBudget ? "text-red-500" : "text-neutral-900"}`}>
                                {formatMAD(totalSpent, locale)}
                            </p>
                            <p className="text-[12px] font-bold text-[#B0B0B0] uppercase tracking-wider mt-1">
                                {t("budget.estimated")}: {formatMAD(totalEstimated, locale)}
                            </p>
                        </div>
                    </div>
                    </>
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
                                <Label className="text-[11px] font-black uppercase tracking-widest text-[#717171]">
                                    {t("budget.form_title_label")}
                                </Label>
                                <Input
                                    value={newItem.title}
                                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                    className="rounded-2xl h-14 bg-[#F7F7F7] border-0 focus:ring-2 focus:ring-primary"
                                    placeholder={t("budget.category_placeholder")}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black uppercase tracking-widest text-[#717171]">
                                    {t("budget.form_category_label")}
                                </Label>
                                <Select
                                    value={newItem.category}
                                    onValueChange={(v) => setNewItem({ ...newItem, category: v })}
                                >
                                    <SelectTrigger className="rounded-2xl h-14 bg-[#F7F7F7] border-0 focus:ring-2 focus:ring-primary font-medium text-neutral-900">
                                        <SelectValue placeholder={t("budget.category_placeholder")} />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl">
                                        {CATEGORY_KEYS.map((key) => (
                                            <SelectItem key={key} value={key} className="font-medium">
                                                {t(`budget.categories.${key}`)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black uppercase tracking-widest text-[#717171]">
                                    {t("budget.form_estimated_label")}
                                </Label>
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
