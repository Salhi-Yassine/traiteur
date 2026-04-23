import { useTranslation } from "next-i18next";
import Head from "next/head";
import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { Wallet, Plus, Trash2, Check, X, AlertTriangle, Pencil, Sparkles, Sliders, Calendar, ArrowUpRight } from "lucide-react";
import PlanningLayout from "../../components/layout/PlanningLayout";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import HorizontalStackedBar from "../../components/budget/HorizontalStackedBar";
import BudgetAssistant from "../../components/budget/BudgetAssistant";
import { formatMAD, formatMADK } from "../../lib/utils";

const CATEGORY_KEYS = [
    "salle", "traiteur", "photographe", "decoration", "negafa",
    "musique", "voiture", "invitation", "beaute", "autre",
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Payment {
    id: number;
    label: string;
    amount: number;
    dueDate: string;
    paid: boolean;
    paidDate?: string;
}

export interface BudgetItem {
    id: number;
    title: string;
    category: string;
    estimatedAmount: number;
    quotedAmount?: number; // Vendor's actual quote
    quoteState: "estimation" | "devis" | "contracté";
    payments: Payment[];
}

interface WeddingProfile {
    id: number;
    totalBudgetMad: number;
}

// ─── Constants ──────────────────────────────────────────────────────────

const WEDDING_DATE = new Date("2026-09-12");
const TODAY = new Date("2026-04-22");
const SEED_BUDGET = 280_000;

const CATEGORY_COLORS: Record<string, string> = {
    salle: "#E8472A",
    traiteur: "#C43A20",
    photographe: "#F47C65",
    decoration: "#8A5700",
    negafa: "#A0522D",
    musique: "#1554A0",
    voiture: "#717171",
    invitation: "#9CA3AF",
    beaute: "#D97B5B",
    autre: "#B0B0B0",
};

const BENCHMARKS: Record<string, { median: number }> = {
    salle: { median: 75_000 },
    traiteur: { median: 60_000 },
    photographe: { median: 25_000 },
    decoration: { median: 20_000 },
    negafa: { median: 31_000 },
    musique: { median: 18_000 },
    voiture: { median: 6_500 },
    invitation: { median: 4_000 },
    beaute: { median: 8_500 },
};

const ALLOC_TEMPLATES: Record<string, Record<string, number>> = {
    standard: { salle:0.27, traiteur:0.22, photographe:0.08, decoration:0.08, negafa:0.12, musique:0.07, voiture:0.02, invitation:0.02, beaute:0.04, autre:0.08 },
    premium:  { salle:0.28, traiteur:0.23, photographe:0.10, decoration:0.10, negafa:0.11, musique:0.06, voiture:0.02, invitation:0.02, beaute:0.03, autre:0.05 },
    luxe:     { salle:0.30, traiteur:0.24, photographe:0.09, decoration:0.12, negafa:0.10, musique:0.05, voiture:0.02, invitation:0.02, beaute:0.03, autre:0.03 },
};

// ─── Mock data ──────────────────────────────────────────────────────────

let MOCK_BUDGET_ITEMS: BudgetItem[] = [
    {
        id: 1,
        title: "Palais Zahia — Réception",
        category: "salle",
        estimatedAmount: 80_000,
        quotedAmount: 82_000,
        quoteState: "contracté",
        payments: [
            { id: 11, label: "Acompte 40%", amount: 32_800, dueDate: "2026-02-15", paid: true, paidDate: "2026-02-12" },
            { id: 12, label: "2ᵉ versement 30%", amount: 24_600, dueDate: "2026-06-15", paid: false },
            { id: 13, label: "Solde 30%", amount: 24_600, dueDate: "2026-09-05", paid: false },
        ]
    },
    {
        id: 2,
        title: "Traiteur Dar Meryem",
        category: "traiteur",
        estimatedAmount: 65_000,
        quotedAmount: 68_000,
        quoteState: "contracté",
        payments: [
            { id: 21, label: "Acompte 50%", amount: 34_000, dueDate: "2026-04-10", paid: true, paidDate: "2026-04-08" },
            { id: 22, label: "Solde", amount: 34_000, dueDate: "2026-09-10", paid: false },
        ]
    },
    {
        id: 3,
        title: "Studio Amine — Photo & Vidéo",
        category: "photographe",
        estimatedAmount: 28_000,
        quotedAmount: 28_000,
        quoteState: "contracté",
        payments: [
            { id: 31, label: "Intégralité", amount: 28_000, dueDate: "2026-03-20", paid: true, paidDate: "2026-03-18" },
        ]
    },
    {
        id: 4,
        title: "Fleurs & Décor Fès",
        category: "decoration",
        estimatedAmount: 22_000,
        quotedAmount: 25_500,
        quoteState: "contracté",
        payments: [
            { id: 41, label: "Acompte", amount: 10_000, dueDate: "2026-03-01", paid: true, paidDate: "2026-03-01" },
            { id: 42, label: "Supplément décor", amount: 15_500, dueDate: "2026-05-15", paid: false },
        ]
    },
    {
        id: 5,
        title: "Négafa Lalla Zineb",
        category: "negafa",
        estimatedAmount: 35_000,
        quotedAmount: 38_000,
        quoteState: "devis",
        payments: [
            { id: 51, label: "Acompte 40%", amount: 15_000, dueDate: "2026-05-01", paid: true, paidDate: "2026-04-20" },
            { id: 52, label: "Solde 60%", amount: 23_000, dueDate: "2026-09-05", paid: false },
        ]
    },
    {
        id: 6,
        title: "Orchestre El Andaloussia",
        category: "musique",
        estimatedAmount: 18_000,
        quotedAmount: undefined,
        quoteState: "estimation",
        payments: [
            { id: 61, label: "Acompte estimé", amount: 9_000, dueDate: "2026-05-20", paid: true, paidDate: "2026-04-15" },
            { id: 62, label: "Solde", amount: 9_000, dueDate: "2026-09-10", paid: false },
        ]
    },
    {
        id: 7,
        title: "Mercedes blanche — Cortège",
        category: "voiture",
        estimatedAmount: 6_000,
        quotedAmount: 6_000,
        quoteState: "contracté",
        payments: [
            { id: 71, label: "Intégralité", amount: 6_000, dueDate: "2026-04-01", paid: true, paidDate: "2026-04-01" },
        ]
    },
    {
        id: 8,
        title: "Faire-parts — Atelier Rbati",
        category: "invitation",
        estimatedAmount: 4_500,
        quotedAmount: 4_500,
        quoteState: "contracté",
        payments: [
            { id: 81, label: "Intégralité", amount: 4_500, dueDate: "2026-03-15", paid: true, paidDate: "2026-03-15" },
        ]
    },
    {
        id: 9,
        title: "Henna & Maquillage Samira",
        category: "beaute",
        estimatedAmount: 9_500,
        quotedAmount: 9_500,
        quoteState: "devis",
        payments: [
            { id: 91, label: "Acompte", amount: 3_200, dueDate: "2026-04-10", paid: true, paidDate: "2026-04-12" },
            { id: 92, label: "Solde", amount: 6_300, dueDate: "2026-09-08", paid: false },
        ]
    },
];

// ─── Helpers ────────────────────────────────────────────────────────────

function itemCommitted(item: BudgetItem): number {
    return item.quotedAmount ?? item.estimatedAmount;
}

function itemPaid(item: BudgetItem): number {
    return item.payments.filter(p => p.paid).reduce((s, p) => s + p.amount, 0);
}

function itemBalance(item: BudgetItem): number {
    return itemCommitted(item) - itemPaid(item);
}

function itemIsOver(item: BudgetItem): boolean {
    return (item.quotedAmount ?? 0) > item.estimatedAmount && item.estimatedAmount > 0;
}

function itemStatus(item: BudgetItem): "paid" | "over" | "progress" | "draft" {
    if (itemPaid(item) >= itemCommitted(item) && itemCommitted(item) > 0) return "paid";
    if (itemIsOver(item)) return "over";
    if (itemPaid(item) > 0) return "progress";
    return "draft";
}

function daysBetween(a: Date, b: Date): number {
    return Math.round((b.getTime() - a.getTime()) / 86400000);
}

function catName(key: string, t: any): string {
    return t(`budget.categories.${key}`, { defaultValue: key });
}

function formatDueDate(iso: string, locale: string, eastern: boolean = false): string {
    const d = new Date(iso);
    const fmt = new Intl.DateTimeFormat(
        locale === "ar" ? "ar-MA" : locale === "en" ? "en-US" : "fr-FR",
        { day: "numeric", month: "short" }
    ).format(d);
    return fmt;
}

export default function BudgetPage() {
    const { t } = useTranslation("common");
    const { locale } = useRouter();
    const queryClient = useQueryClient();

    const [items, setItems] = useState<BudgetItem[]>(MOCK_BUDGET_ITEMS);
    const [totalBudget, setTotalBudget] = useState(SEED_BUDGET);
    const [filter, setFilter] = useState<string>("all");
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [dismissedRealloc, setDismissedRealloc] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [draftBudget, setDraftBudget] = useState(totalBudget);
    const [newItem, setNewItem] = useState({ title: "", category: "salle", estimatedAmount: 0 });
    const [, setDummy] = useState(0);

    const isDemo = true;

    // Computed values
    const totalEngaged = items.reduce((s, i) => s + itemCommitted(i), 0);
    const totalPaid = items.reduce((s, i) => s + itemPaid(i), 0);
    const remaining = totalBudget - totalEngaged;
    const isOverBudget = totalEngaged > totalBudget;

    // Upcoming payments
    const allPayments = items.flatMap(i =>
        i.payments.map(p => ({ ...p, itemId: i.id, itemTitle: i.title, category: i.category }))
    );
    const upcoming = allPayments
        .filter(p => !p.paid)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    const next30 = upcoming.filter(p => daysBetween(TODAY, new Date(p.dueDate)) <= 30);
    const next30Sum = next30.reduce((s, p) => s + p.amount, 0);
    const overduePayments = upcoming.filter(p => daysBetween(TODAY, new Date(p.dueDate)) < 0);
    const daysToWedding = daysBetween(TODAY, WEDDING_DATE);

    // Reallocation logic
    const overItem = items.find(itemIsOver);
    const slackItem = overItem
        ? items.filter(i => i.id !== overItem.id && (i.estimatedAmount - (i.quotedAmount ?? i.estimatedAmount)) > 0)
            .sort((a, b) => (b.estimatedAmount - (b.quotedAmount ?? b.estimatedAmount)) - (a.estimatedAmount - (a.quotedAmount ?? a.estimatedAmount)))[0]
        : null;
    const reallocAmount = overItem ? ((overItem.quotedAmount ?? overItem.estimatedAmount) - overItem.estimatedAmount) : 0;
    const showRealloc = !dismissedRealloc && overItem && slackItem && reallocAmount > 0;

    // Filtering
    const filtered = filter === "all" ? items : items.filter(i => i.category === filter);
    const catCounts = useMemo(() => {
        const m = new Map<string, number>();
        items.forEach(i => m.set(i.category, (m.get(i.category) ?? 0) + 1));
        return m;
    }, [items]);

    // Grouping by category
    const grouped = useMemo(() => {
        const map = new Map<string, BudgetItem[]>();
        filtered.forEach(i => {
            if (!map.has(i.category)) map.set(i.category, []);
            map.get(i.category)!.push(i);
        });
        return [...map.entries()]
            .sort((a, b) => {
                const sumA = a[1].reduce((s, i) => s + itemCommitted(i), 0);
                const sumB = b[1].reduce((s, i) => s + itemCommitted(i), 0);
                return sumB - sumA;
            });
    }, [filtered]);

    // Event handlers
    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.title.trim()) return;
        const id = Math.max(0, ...items.map(i => i.id)) + 1;
        setItems([...items, {
            id,
            ...newItem,
            quotedAmount: undefined,
            quoteState: "estimation",
            payments: [],
        }]);
        setIsAdding(false);
        setNewItem({ title: "", category: "salle", estimatedAmount: 0 });
    };

    const cycleQuoteState = (id: number) => {
        const order: Array<"estimation" | "devis" | "contracté"> = ["estimation", "devis", "contracté"];
        setItems(items.map(i => {
            if (i.id !== id) return i;
            const idx = order.indexOf(i.quoteState);
            return { ...i, quoteState: order[(idx + 1) % order.length] };
        }));
    };

    const togglePayment = (itemId: number, paymentId: number) => {
        setItems(items.map(i => {
            if (i.id !== itemId) return i;
            return {
                ...i,
                payments: i.payments.map(p =>
                    p.id === paymentId
                        ? { ...p, paid: !p.paid, paidDate: !p.paid ? TODAY.toISOString().slice(0, 10) : undefined }
                        : p
                )
            };
        }));
    };

    const deleteItem = (id: number) => {
        setItems(items.filter(i => i.id !== id));
    };

    const applyRealloc = () => {
        if (!overItem || !slackItem) return;
        setItems(items.map(i => {
            if (i.id === overItem.id) return { ...i, estimatedAmount: i.quotedAmount ?? i.estimatedAmount };
            if (i.id === slackItem.id) return { ...i, estimatedAmount: i.estimatedAmount - reallocAmount };
            return i;
        }));
        setDismissedRealloc(true);
    };

    const handleGenerateBudget = (params: { guestCount: number; city: string; tier: string }) => {
        const base = params.guestCount * 300 * (params.tier === "luxe" ? 2 : params.tier === "premium" ? 1.5 : 1);
        const budget = Math.round(base * 2.5);
        const tmpl = ALLOC_TEMPLATES[params.tier];

        const seed: BudgetItem[] = Object.entries(tmpl).map(([cat, pct], idx) => ({
            id: idx + 1,
            title: catName(cat, t),
            category: cat,
            estimatedAmount: Math.round(budget * pct / 100) * 100,
            quotedAmount: undefined,
            quoteState: "estimation" as const,
            payments: [],
        }));

        setItems(seed);
        setTotalBudget(budget);
        setFilter("all");
        setDismissedRealloc(false);
    };

    if (items.length === 0) {
        return (
            <PlanningLayout title={t("budget.title")} description={t("budget.description")}>
                <Head>
                    <title>{t("nav.budget")} — Farah.ma</title>
                </Head>
                <BudgetAssistant onGenerate={handleGenerateBudget} />
            </PlanningLayout>
        );
    }

    return (
        <PlanningLayout title={t("budget.title")} description={t("budget.description")}>
            <Head>
                <title>{t("nav.budget")} — Farah.ma</title>
            </Head>

            {/* Hero Section */}
            <div className="bg-neutral-900 p-6 md:p-12 lg:p-16 rounded-[2rem] md:rounded-[3rem] text-white shadow-3 mb-6 relative overflow-hidden">
                <div className="absolute top-0 end-0 w-96 h-96 bg-primary/20 rounded-full -me-32 -mt-32 blur-3xl opacity-50" />

                <div className="relative z-10">
                    {/* Header with countdown */}
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
                        <div>
                            <div className="flex items-center gap-2 text-primary font-bold text-[13px] uppercase tracking-widest mb-3">
                                <Wallet size={16} />
                                {t("budget.financial_hub", "FINANCES")}
                            </div>
                            <h1 className="font-display text-5xl md:text-6xl mb-4">Budget & Paiements</h1>
                        </div>

                        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-6 py-4 text-center">
                            <div className="text-4xl font-black text-primary mb-1">{daysToWedding}</div>
                            <div className="text-[11px] font-black uppercase tracking-widest text-white/60">{t("budget.days_until", "j. avant le mariage")}</div>
                        </div>
                    </div>

                    {/* Stats and donut */}
                    <div className="grid lg:grid-cols-2 gap-12 mb-8">
                        {/* Stats */}
                        <div className="space-y-6">
                            <div className="group/budget">
                                <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1">
                                    {t("budget.total_budget_label", "Budget Total")}
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
                                            onClick={() => { setTotalBudget(draftBudget); setIsEditingBudget(false); }}
                                            className="w-9 h-9 rounded-xl bg-primary hover:bg-primary/90"
                                        >
                                            <Check size={16} />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => setIsEditingBudget(false)}
                                            className="w-9 h-9 rounded-xl text-white/50 hover:text-white hover:bg-white/10"
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => { setDraftBudget(totalBudget); setIsEditingBudget(true); }}
                                        className="flex items-center gap-2 group/btn"
                                    >
                                        <span className="text-4xl sm:text-5xl font-black text-white">
                                            {formatMADK(totalBudget, locale)}
                                        </span>
                                        <Pencil size={16} className="text-white/0 group-hover/btn:text-white/50 transition-colors" />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1">
                                        {t("budget.engaged", "Engagé")}
                                    </p>
                                    <div className={`text-2xl font-black ${isOverBudget ? "text-red-400" : "text-white"}`}>
                                        {formatMADK(totalEngaged, locale)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1">
                                        {t("budget.paid", "Payé")}
                                    </p>
                                    <div className="text-2xl font-black text-green-400">
                                        {formatMADK(totalPaid, locale)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1">
                                        {t("budget.remaining", "Restant")}
                                    </p>
                                    <div className={`text-2xl font-black ${isOverBudget ? "text-red-400" : "text-white"}`}>
                                        {formatMADK(remaining, locale)}
                                    </div>
                                </div>
                            </div>

                            {isOverBudget && (
                                <div className="flex items-center gap-3 bg-red-500/15 border border-red-500/30 rounded-2xl px-5 py-3 text-red-400">
                                    <AlertTriangle size={16} className="flex-shrink-0" />
                                    <span className="text-[12px] font-black uppercase tracking-widest">
                                        {t("budget.over_budget_global", "Budget total dépassé")}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Payment schedule */}
                        {upcoming.length > 0 && (
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 text-primary text-[11px] font-black uppercase tracking-widest mb-2">
                                        <Calendar size={14} />
                                        {t("budget.schedule_title", "Calendrier de paiement")}
                                    </div>
                                    <p className="text-white/50 text-sm font-medium mb-4">
                                        <span className="text-white font-black">{formatMADK(next30Sum, locale)}</span>
                                        <span className="text-white/50 ms-2">{t("budget.next_30", "dans 30 jours")}</span>
                                    </p>
                                </div>

                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {upcoming.slice(0, 6).map((p, i) => {
                                        const days = daysBetween(TODAY, new Date(p.dueDate));
                                        const isOver = days < 0;
                                        const soon = days <= 30 && days >= 0;
                                        return (
                                            <div key={p.id} className={`flex items-center gap-3 p-3 rounded-xl ${
                                                isOver ? "bg-red-500/15 border border-red-500/30" : "bg-white/5 border border-white/10"
                                            }`}>
                                                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: CATEGORY_COLORS[p.category] }} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white text-sm font-bold truncate">{p.itemTitle}</p>
                                                    <p className={`text-[11px] font-medium ${
                                                        isOver ? "text-red-300" : "text-white/50"
                                                    }`}>
                                                        {isOver ? `${t("budget.overdue_by", "En retard de")} ${-days}j` :
                                                         days === 0 ? t("budget.due", "Échéance") :
                                                         `${t("budget.due_in", "Dans")} ${days}j`}
                                                    </p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-white font-black text-sm">{formatMADK(p.amount, locale)}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Horizontal stacked bar */}
                    <HorizontalStackedBar
                        items={items}
                        totalBudget={totalBudget}
                        totalSpent={totalEngaged}
                    />
                </div>
            </div>

            {/* Reallocation banner */}
            {showRealloc && (
                <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 mb-8">
                    <div className="text-amber-600"><Sparkles size={20} /></div>
                    <div className="flex-1">
                        <p className="font-black text-amber-900 mb-1">{t("budget.reallocate_title", "Rééquilibrer ?")}</p>
                        <p className="text-sm text-amber-800">
                            {t("budget.reallocate_body", "Transférez")} <strong>{formatMAD(reallocAmount, locale)}</strong> {t("budget.reallocate_from", "depuis")} <strong>{catName(slackItem.category, t)}</strong> → <strong>{overItem.title}</strong>
                        </p>
                    </div>
                    <Button
                        onClick={applyRealloc}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-black text-sm h-9 rounded-lg"
                    >
                        {t("budget.reallocate_accept", "Rééquilibrer")}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDismissedRealloc(true)}
                        className="h-9 w-9 text-amber-600 hover:text-amber-700"
                    >
                        <X size={16} />
                    </Button>
                </div>
            )}

            {/* Filter chips */}
            <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
                {CATEGORY_KEYS.filter(c => c === "salle" || catCounts.has(c)).map(c => {
                    const count = catCounts.get(c) ?? 0;
                    const isAll = false;
                    return (
                        <button
                            key={c}
                            onClick={() => setFilter(c)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-sm whitespace-nowrap transition-all ${
                                filter === c
                                    ? "bg-primary text-white"
                                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                            }`}
                        >
                            {c !== "all" && (
                                <span className="w-2.5 h-2.5 rounded-full" style={{ background: CATEGORY_COLORS[c] }} />
                            )}
                            {catName(c, t)}
                            <span className="text-[11px] font-bold opacity-70 ms-1">({count})</span>
                        </button>
                    );
                })}
                <button
                    onClick={() => setFilter("all")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-sm whitespace-nowrap transition-all ${
                        filter === "all"
                            ? "bg-primary text-white"
                            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                >
                    {t("budget.all", "Tous")}
                    <span className="text-[11px] font-bold opacity-70 ms-1">({items.length})</span>
                </button>
            </div>

            {/* Add button */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-3xl text-neutral-900">{t("budget.items_title", "Postes")}</h2>
                <Button
                    onClick={() => setIsAdding(true)}
                    className="rounded-full px-10 h-14 font-black text-[13px] uppercase shadow-xl shadow-primary/20"
                >
                    <Plus size={18} className="me-2" />
                    {t("budget.add_item", "Ajouter un poste")}
                </Button>
            </div>

            {/* Items by category */}
            <div className="space-y-6">
                {grouped.map(([cat, catItems]) => {
                    const sumEng = catItems.reduce((s, i) => s + itemCommitted(i), 0);
                    const sumPaid = catItems.reduce((s, i) => s + itemPaid(i), 0);
                    const bm = BENCHMARKS[cat];
                    const isOverBench = bm && sumEng > bm.median * 1.08;

                    return (
                        <div key={cat} className="bg-white rounded-[2rem] border border-neutral-100 overflow-hidden shadow-sm">
                            {/* Category header */}
                            <div className="bg-neutral-50 px-6 py-4 md:px-10 md:py-6 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-4"
                                style={{ borderInlineStartColor: CATEGORY_COLORS[cat], borderInlineStartWidth: 4 }}
                            >
                                <div className="flex items-center gap-4">
                                    <h3 className="font-display text-2xl text-neutral-900 capitalize">
                                        {catName(cat, t)}
                                    </h3>
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white border border-neutral-200 text-[#717171] rounded-full">
                                        {catItems.length} {catItems.length > 1 ? "éléments" : "élément"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-6">
                                    {isOverBench && bm && (
                                        <div className="text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                                            +{Math.round(((sumEng - bm.median) / bm.median) * 100)}% vs. médiane
                                        </div>
                                    )}
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#B0B0B0] mb-0.5">Engagé</p>
                                        <p className="font-black text-neutral-900 text-lg">{formatMADK(sumEng, locale)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="divide-y divide-neutral-50">
                                {catItems.map((item) => {
                                    const status = itemStatus(item);
                                    const isExpanded = expandedId === item.id;
                                    const paid = itemPaid(item);
                                    const committed = itemCommitted(item);
                                    const balance = itemBalance(item);
                                    const paidPct = committed > 0 ? (paid / committed) * 100 : 0;
                                    const nextUnpaid = item.payments.find(p => !p.paid);
                                    const daysToNext = nextUnpaid ? daysBetween(TODAY, new Date(nextUnpaid.dueDate)) : null;

                                    return (
                                        <div key={item.id} className={`group ${isExpanded ? "bg-[#F7F7F7]" : "hover:bg-[#F7F7F7]/50"} transition-colors`}>
                                            {/* Item header */}
                                            <div
                                                className="px-6 py-6 md:px-10 md:py-8 cursor-pointer"
                                                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                                            >
                                                <div className="flex items-start md:items-center justify-between gap-6">
                                                    {/* Left */}
                                                    <div className="flex items-start md:items-center gap-4 md:gap-8 flex-1">
                                                        <div className={`w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                                                            status === "over" ? "bg-red-50 text-red-500" :
                                                            status === "paid" ? "bg-green-50 text-green-500" :
                                                            status === "progress" ? "bg-primary/10 text-primary" :
                                                            "bg-neutral-100 text-neutral-500 group-hover:bg-primary group-hover:text-white"
                                                        }`}>
                                                            {status === "paid" ? <Check size={22} /> :
                                                             status === "over" ? <AlertTriangle size={22} /> :
                                                             <ArrowUpRight size={24} />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className={`text-[17px] font-bold mb-2 transition-colors ${
                                                                status === "over" ? "text-red-500" : "text-neutral-900"
                                                            }`}>
                                                                {item.title}
                                                            </h4>
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                                                                    status === "paid" ? "bg-green-50 text-green-600" :
                                                                    status === "over" ? "bg-red-50 text-red-600" :
                                                                    status === "progress" ? "bg-primary/10 text-primary" :
                                                                    "bg-neutral-100 text-[#717171]"
                                                                }`}>
                                                                    {status === "paid" ? t("budget.paid_badge", "Payé") :
                                                                     status === "over" ? t("budget.over_budget_item", "Dépassement") :
                                                                     status === "progress" ? t("budget.in_progress", "En cours") :
                                                                     t("budget.draft", "Estimation")}
                                                                </span>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); cycleQuoteState(item.id); }}
                                                                    className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full transition-all ${
                                                                        item.quoteState === "estimation" ? "bg-neutral-100 text-[#717171]" :
                                                                        item.quoteState === "devis" ? "bg-amber-100 text-amber-700" :
                                                                        "bg-primary/10 text-primary"
                                                                    }`}
                                                                    title="Click to cycle"
                                                                >
                                                                    {item.quoteState === "estimation" ? t("budget.qs_estimation", "Estimation") :
                                                                     item.quoteState === "devis" ? t("budget.qs_devis", "Devis reçu") :
                                                                     t("budget.qs_contracté", "Contracté")}
                                                                </button>
                                                                {nextUnpaid && daysToNext !== null && (
                                                                    <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${
                                                                        daysToNext < 0 ? "bg-red-50 text-red-600" :
                                                                        daysToNext <= 30 ? "bg-amber-50 text-amber-700" :
                                                                        "bg-white border border-neutral-200 text-[#717171]"
                                                                    }`}>
                                                                        {daysToNext < 0
                                                                            ? `${t("budget.overdue_by", "En retard de")} ${-daysToNext}j`
                                                                            : `${t("budget.due_in", "Dans")} ${daysToNext}j`}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Right */}
                                                    <div className="flex items-center gap-4 flex-shrink-0">
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#B0B0B0] mb-0.5">
                                                                {paid} / {committed}
                                                            </p>
                                                            <p className={`text-lg font-black ${status === "over" ? "text-red-500" : "text-neutral-900"}`}>
                                                                {formatMADK(paid, locale)} / {formatMADK(committed, locale)}
                                                            </p>
                                                            <p className="text-[10px] text-[#717171] mt-0.5">
                                                                {t("budget.balance", "Solde")}: {formatMADK(balance, locale)}
                                                            </p>
                                                        </div>

                                                        {/* Progress bar */}
                                                        {committed > 0 && (
                                                            <div className="w-16 h-2 bg-neutral-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full transition-all ${
                                                                        status === "paid" ? "bg-green-500" :
                                                                        status === "over" ? "bg-red-500" :
                                                                        "bg-primary"
                                                                    }`}
                                                                    style={{ width: `${Math.min(100, paidPct)}%` }}
                                                                />
                                                            </div>
                                                        )}

                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : item.id); }}
                                                            className="w-9 h-9 rounded-xl hover:bg-neutral-200 flex items-center justify-center md:opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <Sliders size={16} style={{ transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 200ms" }} />
                                                        </button>

                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); if (window.confirm("Supprimer?")) deleteItem(item.id); }}
                                                            className="w-9 h-9 rounded-xl hover:bg-red-50 text-neutral-400 hover:text-red-500 flex items-center justify-center md:opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expanded payments */}
                                            {isExpanded && item.payments.length > 0 && (
                                                <div className="px-6 py-6 md:px-10 md:py-8 bg-[#F7F7F7] border-t border-neutral-100">
                                                    <h5 className="font-bold text-sm text-neutral-700 mb-4">{t("budget.payments", "Paiements")}</h5>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {item.payments.map((p) => {
                                                            const days = daysBetween(TODAY, new Date(p.dueDate));
                                                            return (
                                                                <div key={p.id} className={`p-4 rounded-xl border transition-all ${
                                                                    p.paid ? "bg-green-50 border-green-200" :
                                                                    days < 0 ? "bg-red-50 border-red-200" :
                                                                    days <= 30 ? "bg-amber-50 border-amber-200" :
                                                                    "bg-white border-neutral-200"
                                                                }`}>
                                                                    <div className="flex items-start justify-between mb-3">
                                                                        <span className="font-bold text-sm text-neutral-900">{p.label}</span>
                                                                        <button
                                                                            onClick={() => togglePayment(item.id, p.id)}
                                                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                                                                p.paid ? "bg-green-500 border-green-500" : "border-neutral-300 hover:border-primary"
                                                                            }`}
                                                                        >
                                                                            {p.paid && <Check size={12} className="text-white" />}
                                                                        </button>
                                                                    </div>
                                                                    <p className="text-lg font-black text-neutral-900 mb-2">{formatMAD(p.amount, locale)}</p>
                                                                    <p className="text-[10px] text-[#717171]">
                                                                        {p.paid ? `${t("budget.paid", "Payé")} · ${formatDueDate(p.paidDate!, locale)}` :
                                                                         days < 0 ? `${t("budget.overdue_by", "En retard de")} ${-days}j` :
                                                                         `${t("budget.due", "Échéance")} · ${formatDueDate(p.dueDate, locale)}`}
                                                                    </p>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
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

            {/* Items footer */}
            <div className="mt-8 pt-6 border-t border-neutral-200 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#717171]">{t("budget.totals", "TOTAUX")}</span>
                <div className="flex gap-8 items-baseline">
                    <div className="text-right">
                        <div className="text-[10px] font-black uppercase tracking-widest text-[#717171] mb-1">Engagé</div>
                        <div className={`text-2xl font-black ${isOverBudget ? "text-red-500" : "text-neutral-900"}`}>
                            {formatMAD(totalEngaged, locale)}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-black uppercase tracking-widest text-[#717171] mb-1">Payé</div>
                        <div className="text-2xl font-black text-green-500">
                            {formatMAD(totalPaid, locale)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add item modal */}
            {isAdding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-md" onClick={() => setIsAdding(false)} />
                    <div className="relative bg-white rounded-[3rem] w-full max-w-lg p-12 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h3 className="font-display text-3xl text-neutral-900 mb-8">{t("budget.new_poste_title", "Nouvelle Dépense")}</h3>
                        <form onSubmit={handleAddItem} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black uppercase tracking-widest text-[#717171]">{t("budget.form_title_label", "Titre")}</Label>
                                <Input
                                    value={newItem.title}
                                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                    className="rounded-2xl h-14 bg-[#F7F7F7] border-0 focus:ring-2 focus:ring-primary"
                                    placeholder="Ex: Orchestre Andalou"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black uppercase tracking-widest text-[#717171]">{t("budget.form_category_label", "Catégorie")}</Label>
                                <Select value={newItem.category} onValueChange={(v) => setNewItem({ ...newItem, category: v })} required>
                                    <SelectTrigger className="rounded-2xl h-14 bg-[#F7F7F7] border-0 focus:ring-2 focus:ring-primary font-medium text-neutral-900">
                                        <SelectValue placeholder="Choisir une catégorie" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl">
                                        {CATEGORY_KEYS.map((key) => (
                                            <SelectItem key={key} value={key} className="font-medium">{catName(key, t)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black uppercase tracking-widest text-[#717171]">{t("budget.form_estimated_label", "Montant Estimé")}</Label>
                                <Input
                                    type="number"
                                    value={newItem.estimatedAmount}
                                    onChange={(e) => setNewItem({ ...newItem, estimatedAmount: Number(e.target.value) })}
                                    className="rounded-2xl h-14 bg-[#F7F7F7] border-0 focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                            <div className="flex gap-4 pt-6">
                                <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="flex-1 h-14 rounded-2xl border-2 font-black uppercase text-[12px]">{t("common.cancel", "Annuler")}</Button>
                                <Button type="submit" className="flex-1 h-14 rounded-2xl font-black uppercase text-[12px] shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white">{t("common.save", "Enregistrer")}</Button>
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
