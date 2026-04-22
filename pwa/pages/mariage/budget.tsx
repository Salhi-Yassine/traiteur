import { useTranslation } from "next-i18next";
import Head from "next/head";
import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { Wallet, Plus, ArrowUpRight, Trash2, Check, X, AlertTriangle, Pencil, Info } from "lucide-react";
import PlanningLayout from "../../components/layout/PlanningLayout";
import apiClient from "../../utils/apiClient";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import HorizontalStackedBar from "../../components/budget/HorizontalStackedBar";
import PaymentTimeline from "../../components/budget/PaymentTimeline";
import BudgetAssistant from "../../components/budget/BudgetAssistant";
import { formatMAD, formatMADK } from "../../lib/utils";

const CATEGORY_KEYS = [
    "salle", "traiteur", "photographe", "decoration", "negafa",
    "musique", "voiture", "invitation", "beaute", "autre",
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BudgetItem {
    id: number;
    title: string;
    category: string;
    estimatedAmount: number; // The initial estimate
    spentAmount: number;     // The total contracted amount
    depositAmount: number;   // How much has been paid (Avance)
    status: "estimation" | "devis" | "contracte";
    dueDate: string;         // E.g., "2026-05-12"
}

interface WeddingProfile {
    id: number;
    totalBudgetMad: number;
}

interface EditValues {
    spentAmount: number;
    estimatedAmount: number;
    depositAmount: number;
}

// ─── Mock data ──────────────────────────────────────────────────────────────

const MOCK_BUDGET_PROFILE: { id: number; totalBudgetMad: number } = {
    id: 0,
    totalBudgetMad: 120_000,
};

let MOCK_BUDGET_ITEMS: BudgetItem[] = [
    { id: 1, title: "Salle de réception — Riad Andalous", category: "salle", estimatedAmount: 35_000, spentAmount: 35_000, depositAmount: 15_000, status: "contracte", dueDate: "2026-05-15" },
    { id: 2, title: "Traiteur (Pastilla + Méchoui + Desserts)", category: "traiteur", estimatedAmount: 28_000, spentAmount: 22_500, depositAmount: 10_000, status: "contracte", dueDate: "2026-05-20" },
    { id: 3, title: "Photographe & Vidéaste", category: "photographe", estimatedAmount: 12_000, spentAmount: 13_500, depositAmount: 3_500, status: "contracte", dueDate: "2026-06-01" },
    { id: 4, title: "Décoration florale & mise en scène", category: "decoration", estimatedAmount: 15_000, spentAmount: 0, depositAmount: 0, status: "devis", dueDate: "2026-06-10" },
    { id: 5, title: "Negafa & Tenues de la mariée", category: "negafa", estimatedAmount: 14_000, spentAmount: 15_500, depositAmount: 5_000, status: "contracte", dueDate: "2026-04-30" }, // Overdue?
    { id: 6, title: "Orchestre Andalou + DJ", category: "musique", estimatedAmount: 8_000, spentAmount: 0, depositAmount: 0, status: "estimation", dueDate: "2026-07-01" },
    { id: 7, title: "Faire-parts & Invitations", category: "invitation", estimatedAmount: 2_500, spentAmount: 2_500, depositAmount: 2_500, status: "contracte", dueDate: "2026-03-01" },
];

export default function BudgetPage() {
    const { t } = useTranslation("common");
    const { locale } = useRouter();
    const queryClient = useQueryClient();

    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({ title: "", category: "", estimatedAmount: 0 });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<EditValues>({ spentAmount: 0, estimatedAmount: 0, depositAmount: 0 });
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [draftBudget, setDraftBudget] = useState(0);

    // Force re-render for mock local state
    const [, setDummy] = useState(0);

    const { data: profileData, isLoading: profileLoading } = useQuery({
        queryKey: ["weddingProfile"],
        queryFn: () => apiClient.get("/api/wedding_profiles?itemsPerPage=1"),
    });

    const wp: WeddingProfile | null = (profileData as any)?.["hydra:member"]?.[0] ?? null;
    const profileId = wp?.id ?? null;

    // Use mock data when API hasn't returned real data
    const isDemo = true; // !profileLoading && !wp; // FORCE DEMO FOR UI TESTING
    const effectiveProfile = wp ?? (isDemo ? MOCK_BUDGET_PROFILE : null);

    const { data: budgetData } = useQuery({
        queryKey: ["budgetItems", profileId],
        queryFn: () => apiClient.get(`/api/budget_items?weddingProfile=${profileId}`),
        enabled: profileId !== null,
    });

    const apiItems: BudgetItem[] = (budgetData as any)?.["hydra:member"] ?? [];
    const items: BudgetItem[] = isDemo ? MOCK_BUDGET_ITEMS : apiItems;
    
    const totalBudget = effectiveProfile?.totalBudgetMad ?? 0;
    const totalSpent = items.reduce((acc, curr) => acc + curr.spentAmount, 0); // Contracted
    const totalDeposit = items.reduce((acc, curr) => acc + curr.depositAmount, 0); // Paid out of pocket
    const totalEstimated = items.reduce((acc, curr) => acc + curr.estimatedAmount, 0);
    const isOverBudget = totalBudget > 0 && totalSpent > totalBudget;

    const addMutation = useMutation({
        mutationFn: (data: any) => apiClient.post("/api/budget_items", data),
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
        if (isDemo) {
            MOCK_BUDGET_ITEMS.push({
                id: Date.now(),
                ...newItem,
                spentAmount: 0,
                depositAmount: 0,
                status: "estimation",
                dueDate: "2026-12-31"
            });
            setIsAdding(false);
            setDummy(d => d + 1);
            return;
        }
        if (!profileId) return;
        addMutation.mutate({
            ...newItem,
            weddingProfile: `/api/wedding_profiles/${profileId}`,
            spentAmount: 0,
        });
    };

    const startEdit = (item: BudgetItem) => {
        setEditingId(item.id);
        setEditValues({ spentAmount: item.spentAmount, estimatedAmount: item.estimatedAmount, depositAmount: item.depositAmount });
    };

    const saveEdit = (id: number) => {
        if (isDemo) {
            const index = MOCK_BUDGET_ITEMS.findIndex(i => i.id === id);
            if (index !== -1) {
                MOCK_BUDGET_ITEMS[index] = { ...MOCK_BUDGET_ITEMS[index], ...editValues };
                if (editValues.spentAmount > 0) MOCK_BUDGET_ITEMS[index].status = "contracte";
            }
            setEditingId(null);
            setDummy(d => d + 1);
            return;
        }
        patchMutation.mutate({ id, data: editValues });
    };

    const cancelEdit = () => setEditingId(null);

    const startEditBudget = () => {
        setDraftBudget(totalBudget);
        setIsEditingBudget(true);
    };

    const handleGenerateBudget = (params: { guestCount: number; city: string; tier: string }) => {
        // Mock logic for generating budget based on tier and guest count
        const multiplier = params.tier === "luxury" ? 2 : params.tier === "premium" ? 1.5 : 1;
        const base = params.guestCount * 300 * multiplier;
        
        MOCK_BUDGET_PROFILE.totalBudgetMad = base * 2.5; // Roughly total budget

        MOCK_BUDGET_ITEMS = [
            { id: 101, title: "Location de la Salle", category: "salle", estimatedAmount: base * 0.3, spentAmount: 0, depositAmount: 0, status: "estimation", dueDate: "2026-06-01" },
            { id: 102, title: "Service Traiteur", category: "traiteur", estimatedAmount: base * 0.4, spentAmount: 0, depositAmount: 0, status: "estimation", dueDate: "2026-06-01" },
            { id: 103, title: "Photographe Premium", category: "photographe", estimatedAmount: base * 0.08, spentAmount: 0, depositAmount: 0, status: "estimation", dueDate: "2026-06-01" },
            { id: 104, title: "Décoration", category: "decoration", estimatedAmount: base * 0.1, spentAmount: 0, depositAmount: 0, status: "estimation", dueDate: "2026-06-01" },
            { id: 105, title: "Negafa", category: "negafa", estimatedAmount: base * 0.08, spentAmount: 0, depositAmount: 0, status: "estimation", dueDate: "2026-06-01" },
            { id: 106, title: "Orchestre", category: "musique", estimatedAmount: base * 0.06, spentAmount: 0, depositAmount: 0, status: "estimation", dueDate: "2026-06-01" },
            { id: 107, title: "Tenues", category: "beaute", estimatedAmount: base * 0.05, spentAmount: 0, depositAmount: 0, status: "estimation", dueDate: "2026-06-01" },
        ];
        setDummy(d => d + 1);
    };

    const handleDelete = (id: number) => {
        if (isDemo) {
            MOCK_BUDGET_ITEMS = MOCK_BUDGET_ITEMS.filter(i => i.id !== id);
            setDummy(d => d + 1);
            return;
        }
        deleteMutation.mutate(id);
    };

    // Group items by category
    const groupedItems = useMemo(() => {
        const groups: Record<string, BudgetItem[]> = {};
        items.forEach(item => {
            if (!groups[item.category]) groups[item.category] = [];
            groups[item.category].push(item);
        });
        return groups;
    }, [items, isDemo]);

    // Timeline Events
    const timelineEvents = items.filter(i => i.status === "contracte" && i.spentAmount > i.depositAmount).map(i => ({
        id: i.id,
        title: i.title,
        amount: i.spentAmount - i.depositAmount, // Balance due
        dueDate: i.dueDate,
        isPaid: false
    }));

    return (
        <PlanningLayout title={t("budget.title")} description={t("budget.description")}>
            <Head>
                <title>{t("nav.budget")} — Farah.ma</title>
            </Head>

            {/* Demo banner */}
            {isDemo && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 w-fit">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />
                    Mode Démo Interactif — Les données ne sont pas sauvegardées
                </div>
            )}

            {/* Financial Overview (HERO) */}
            <div className="bg-neutral-900 p-6 md:p-12 lg:p-16 rounded-[2rem] md:rounded-[3rem] text-white shadow-3 mb-6 relative overflow-hidden">
                <div className="absolute top-0 end-0 w-96 h-96 bg-primary/20 rounded-full -me-32 -mt-32 blur-3xl opacity-50" />

                <div className="relative z-10 flex flex-col gap-8">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-primary font-bold text-[13px] uppercase tracking-widest">
                                <Wallet size={16} />
                                {t("budget.financial_hub")}
                            </div>
                            {/* SHORTER TITLE */}
                            <h3 className="font-display text-5xl md:text-6xl">Budget & Paiements</h3>

                            <div className="flex items-center gap-6 sm:gap-10 flex-wrap">
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
                                                className="w-40 h-10 rounded-xl bg-white/10 border border-white/20 text-white font-black focus:border-primary"
                                                autoFocus
                                            />
                                            <Button
                                                size="icon"
                                                onClick={() => {
                                                    if (isDemo) { MOCK_BUDGET_PROFILE.totalBudgetMad = draftBudget; setIsEditingBudget(false); setDummy(d => d+1); }
                                                    else patchBudgetMutation.mutate(draftBudget);
                                                }}
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
                                            {/* LARGE ROUND NUMBERS IN K */}
                                            <span className="text-4xl sm:text-5xl font-black text-white">
                                                {formatMADK(totalBudget, locale)}
                                            </span>
                                            <Pencil
                                                size={16}
                                                className="text-white/0 group-hover/btn:text-white/50 transition-colors"
                                            />
                                        </button>
                                    )}
                                </div>

                                <div className="hidden sm:block w-px h-12 bg-white/10" />

                                <div>
                                    <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1">
                                        {t("budget.total_spent", "Total Engagé")}
                                    </p>
                                    <span className={`text-2xl sm:text-3xl font-black ${isOverBudget ? "text-red-400" : "text-white"}`}>
                                        {formatMADK(totalSpent, locale)}
                                    </span>
                                </div>

                                <div className="hidden sm:block w-px h-12 bg-white/10" />

                                <div>
                                    <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1">
                                        {t("budget.total_paid", "Déjà Payé")}
                                    </p>
                                    <span className="text-2xl sm:text-3xl font-black text-green-400">
                                        {formatMADK(totalDeposit, locale)}
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
                        </div>
                    </div>

                    {/* NEW HORIZONTAL STACKED BAR */}
                    <HorizontalStackedBar items={items} totalBudget={totalBudget} totalSpent={totalSpent} />
                </div>
            </div>

            {/* NEW TIMELINE STRIP */}
            <PaymentTimeline events={timelineEvents} />

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 px-4 mb-8 mt-12">
                <h4 className="font-display text-3xl text-neutral-900">{t("budget.items_title")}</h4>
                <Button
                    onClick={() => setIsAdding(true)}
                    className="rounded-full px-10 h-14 font-black text-[13px] uppercase shadow-xl shadow-primary/20"
                >
                    <Plus size={18} className="me-2" />
                    {t("budget.add_item")}
                </Button>
            </div>

            {/* Budget Grid / Empty State */}
            {items.length === 0 ? (
                <BudgetAssistant onGenerate={handleGenerateBudget} />
            ) : (
                <div className="space-y-6">
                    {CATEGORY_KEYS.map((catKey) => {
                        const catItems = groupedItems[catKey];
                        if (!catItems || catItems.length === 0) return null;

                        const catEstimated = catItems.reduce((acc, curr) => acc + curr.estimatedAmount, 0);
                        const catSpent = catItems.reduce((acc, curr) => acc + curr.spentAmount, 0);
                        
                        // Fake Benchmark logic just for illustration
                        const isOverBenchmark = catKey === "negafa" && catSpent > 12000;

                        return (
                            <div key={catKey} className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm">
                                {/* Category Header */}
                                <div className="bg-neutral-50 px-6 py-4 md:px-10 md:py-6 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <h4 className="font-display text-2xl text-neutral-900 capitalize">
                                            {t(`budget.categories.${catKey}`, { defaultValue: catKey })}
                                        </h4>
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white border border-neutral-200 text-[#717171] rounded-full">
                                            {catItems.length} {catItems.length > 1 ? "éléments" : "élément"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#B0B0B0] mb-0.5">Estimé</p>
                                            <p className="font-bold text-neutral-400">{formatMAD(catEstimated, locale)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#B0B0B0] mb-0.5">Engagé</p>
                                            <p className="font-black text-neutral-900 text-lg">{formatMAD(catSpent, locale)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Benchmark Insight (Mocked example) */}
                                {isOverBenchmark && (
                                    <div className="bg-amber-50 border-b border-amber-100 px-6 py-3 flex items-start sm:items-center gap-3 text-amber-800 text-sm">
                                        <Info size={16} className="mt-0.5 sm:mt-0 flex-shrink-0 text-amber-600" />
                                        <p>
                                            <strong>Insight:</strong> Vous dépensez 12% de plus pour la Négafa que la médiane des mariages de 150 invités à Fès.
                                        </p>
                                    </div>
                                )}

                                {/* Category Items */}
                                <div className="divide-y divide-neutral-50">
                                    {catItems.map((item) => {
                                        const isEditing = editingId === item.id;
                                        const isItemOverBudget = item.spentAmount > item.estimatedAmount && item.estimatedAmount > 0;
                                        const balanceDue = item.spentAmount > 0 ? Math.max(0, item.spentAmount - item.depositAmount) : 0;
                                        const isPaidFull = item.spentAmount > 0 && item.depositAmount >= item.spentAmount;

                                        // Deterministic Color Logic
                                        let barColor = "bg-neutral-200"; // Draft/Estimation
                                        let statusText = "Estimation";
                                        let statusBg = "bg-neutral-100 text-[#717171]";

                                        if (isItemOverBudget) {
                                            barColor = "bg-red-500";
                                            statusText = "Dépassement";
                                            statusBg = "bg-red-50 text-red-600";
                                        } else if (isPaidFull) {
                                            barColor = "bg-green-500";
                                            statusText = "Payé";
                                            statusBg = "bg-green-50 text-green-600";
                                        } else if (item.status === "contracte") {
                                            barColor = "bg-primary"; // Terracotta
                                            statusText = "Contracté";
                                            statusBg = "bg-primary/10 text-primary";
                                        } else if (item.status === "devis") {
                                            barColor = "bg-amber-400";
                                            statusText = "Devis Reçu";
                                            statusBg = "bg-amber-100 text-amber-700";
                                        }

                                        const progressPercent = item.spentAmount > 0 ? (item.depositAmount / item.spentAmount) * 100 : 0;

                                        return (
                                            <div
                                                key={item.id}
                                                className={`group flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-0 px-6 py-6 md:px-10 md:py-8 transition-all ${isEditing ? "bg-[#F7F7F7]" : "hover:bg-[#F7F7F7]/50"}`}
                                            >
                                                {/* Left side */}
                                                <div className="flex items-start md:items-center gap-4 md:gap-8 lg:w-1/3">
                                                    <div className={`w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                                                        isItemOverBudget
                                                            ? "bg-red-50 text-red-500"
                                                            : "bg-neutral-100 text-neutral-900 group-hover:bg-primary group-hover:text-white"
                                                    }`}>
                                                        {isItemOverBudget ? <AlertTriangle size={22} /> : <ArrowUpRight size={24} />}
                                                    </div>
                                                    <div>
                                                        <h4 className={`text-[17px] font-bold transition-colors leading-tight mb-2 ${
                                                            isItemOverBudget ? "text-red-500" : "text-neutral-900 group-hover:text-primary"
                                                        }`}>
                                                            {item.title}
                                                        </h4>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${statusBg}`}>
                                                                {statusText}
                                                            </span>
                                                            {item.status === "contracte" && !isPaidFull && item.dueDate && (
                                                                <span className="text-[10px] font-medium text-[#717171] bg-white border border-neutral-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                                                                    Échéance: {new Date(item.dueDate).toLocaleDateString(locale, { month: 'short', day: 'numeric' })}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right side - Split financial view */}
                                                <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ml-[4.5rem] md:ml-0 md:pl-8 border-t md:border-t-0 md:border-l border-neutral-100 pt-4 md:pt-0 mt-2 md:mt-0">
                                                    {isEditing ? (
                                                        <div className="flex flex-col sm:flex-row sm:items-end gap-3 w-full">
                                                            <div className="space-y-1">
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#B0B0B0]">Engagé (Total)</p>
                                                                <Input type="number" value={editValues.spentAmount} onChange={(e) => setEditValues((v) => ({ ...v, spentAmount: Number(e.target.value) }))} className="w-full sm:w-28 h-11 bg-white font-black" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#B0B0B0]">Avance Payée</p>
                                                                <Input type="number" value={editValues.depositAmount} onChange={(e) => setEditValues((v) => ({ ...v, depositAmount: Number(e.target.value) }))} className="w-full sm:w-28 h-11 bg-white font-black" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#B0B0B0]">Estimé</p>
                                                                <Input type="number" value={editValues.estimatedAmount} onChange={(e) => setEditValues((v) => ({ ...v, estimatedAmount: Number(e.target.value) }))} className="w-full sm:w-28 h-11 bg-white font-black" />
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button size="icon" onClick={() => saveEdit(item.id)} className="w-11 h-11 rounded-xl bg-primary hover:bg-primary/90"><Check size={18} /></Button>
                                                                <Button size="icon" variant="outline" onClick={cancelEdit} className="w-11 h-11 rounded-xl"><X size={18} /></Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                        <div className="flex-1 w-full grid grid-cols-2 lg:grid-cols-3 gap-4">
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#B0B0B0] mb-1">Total</p>
                                                                <p className={`text-lg font-black ${isItemOverBudget ? 'text-red-500' : 'text-neutral-900'}`}>{formatMAD(item.spentAmount || item.estimatedAmount, locale)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#B0B0B0] mb-1">Avance</p>
                                                                <p className="text-lg font-bold text-green-500">{formatMAD(item.depositAmount, locale)}</p>
                                                            </div>
                                                            <div className="col-span-2 lg:col-span-1 border-t lg:border-t-0 border-neutral-100 pt-2 lg:pt-0">
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#B0B0B0] mb-1">Reste à payer</p>
                                                                <p className="text-lg font-black text-neutral-900">{formatMAD(balanceDue, locale)}</p>
                                                            </div>
                                                        </div>

                                                        {/* Progress bar and actions */}
                                                        <div className="w-full md:w-32 flex flex-col items-end gap-3 shrink-0">
                                                            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                                                                <div 
                                                                    className={`h-full rounded-full ${barColor}`} 
                                                                    style={{ width: `${Math.max(5, progressPercent)}%` }} // min 5% for visibility if not 0
                                                                />
                                                            </div>
                                                            <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-all">
                                                                <Button variant="ghost" size="icon" onClick={() => startEdit(item)} className="w-9 h-9 rounded-xl text-[#B0B0B0] hover:text-primary"><Pencil size={14} /></Button>
                                                                <Button variant="ghost" size="icon" onClick={() => { if (window.confirm("Supprimer?")) handleDelete(item.id); }} className="w-9 h-9 rounded-xl text-[#B0B0B0] hover:text-red-500"><Trash2 size={14} /></Button>
                                                            </div>
                                                        </div>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Reallocate suggestion if over budget */}
                                                {isItemOverBudget && !isEditing && (
                                                    <div className="w-full mt-4 bg-red-50/50 border border-red-100 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 ml-[4.5rem] md:ml-0 md:col-span-2">
                                                        <span className="text-[12px] font-medium text-red-800">
                                                            Dépassement de {formatMAD(item.spentAmount - item.estimatedAmount, locale)}.
                                                        </span>
                                                        <Button variant="outline" size="sm" className="h-8 rounded-full text-[10px] font-black uppercase tracking-widest border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                                                            Réallouer {formatMAD(item.spentAmount - item.estimatedAmount, locale)} de la Musique ?
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-md" onClick={() => setIsAdding(false)} />
                    <div className="relative bg-white rounded-[3rem] w-full max-w-lg p-12 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h3 className="font-display text-3xl text-neutral-900 mb-8">{t("budget.new_poste_title", "Nouvelle Dépense")}</h3>
                        <form onSubmit={handleAddItem} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black uppercase tracking-widest text-[#717171]">{t("budget.form_title_label")}</Label>
                                <Input value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} className="rounded-2xl h-14 bg-[#F7F7F7] border-0 focus:ring-2 focus:ring-primary" placeholder="Ex: Orchestre Andalou" required />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black uppercase tracking-widest text-[#717171]">{t("budget.form_category_label")}</Label>
                                <Select value={newItem.category} onValueChange={(v) => setNewItem({ ...newItem, category: v })} required>
                                    <SelectTrigger className="rounded-2xl h-14 bg-[#F7F7F7] border-0 focus:ring-2 focus:ring-primary font-medium text-neutral-900">
                                        <SelectValue placeholder="Choisir une catégorie" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl">
                                        {CATEGORY_KEYS.map((key) => (
                                            <SelectItem key={key} value={key} className="font-medium">{t(`budget.categories.${key}`, { defaultValue: key })}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black uppercase tracking-widest text-[#717171]">{t("budget.form_estimated_label")}</Label>
                                <Input type="number" value={newItem.estimatedAmount} onChange={(e) => setNewItem({ ...newItem, estimatedAmount: Number(e.target.value) })} className="rounded-2xl h-14 bg-[#F7F7F7] border-0 focus:ring-2 focus:ring-primary" required />
                            </div>
                            <div className="flex gap-4 pt-6">
                                <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="flex-1 h-14 rounded-2xl border-2 font-black uppercase text-[12px]">{t("common.cancel")}</Button>
                                <Button type="submit" className="flex-1 h-14 rounded-2xl font-black uppercase text-[12px] shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white">{t("common.save")}</Button>
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
