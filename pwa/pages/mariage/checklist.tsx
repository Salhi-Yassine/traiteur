import { useTranslation } from "next-i18next";
import Head from "next/head";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CheckCircle2, Clock, Plus, Trash2, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import PlanningLayout from "../../components/layout/PlanningLayout";
import apiClient from "../../utils/apiClient";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

interface ChecklistTask {
    id: number;
    title: string;
    description?: string;
    category: string;
    dueDate?: string;
    isCompleted: boolean;
}

const MOCK_TASKS: (ChecklistTask & { phase?: string })[] = [
    { id: 1, title: "Choisir la Negafa", category: "tenues", isCompleted: true, phase: "foundations" },
    { id: 2, title: "Réservation de la Salle/Riad", category: "salles", isCompleted: true, phase: "foundations" },
    { id: 3, title: "Dégustation Traiteur (Pastilla & Méchoui)", category: "traiteur", isCompleted: true, phase: "details", dueDate: "2026-03-15" },
    { id: 4, title: "Sélection de l'Ammariya", category: "tenues", isCompleted: false, phase: "details", dueDate: "2026-05-10" },
    { id: 5, title: "Choisir le photographe", category: "photo", isCompleted: false, phase: "details", dueDate: "2026-05-15" },
    { id: 6, title: "Envoyer les faire-parts", category: "papeterie", isCompleted: true, phase: "details", dueDate: "2026-04-01" },
    { id: 7, title: "Organisation de la Nuit du Henné", category: "autre", isCompleted: false, phase: "final", dueDate: "2026-06-01" },
    { id: 8, title: "Confirmation des prestataires", category: "autre", isCompleted: false, phase: "final", dueDate: "2026-06-15" },
];

interface WeddingProfile {
    id: number;
}

const CATEGORIES = ["salles", "traiteur", "tenues", "beaute", "photo", "papeterie", "autre"];

export default function ChecklistPage() {
    const { t } = useTranslation("common");
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [newTask, setNewTask] = useState({
        title: "",
        category: "salles",
        dueDate: "",
        isCompleted: false,
    });

    const { data: profileData, isLoading: profileLoading } = useQuery({
        queryKey: ["weddingProfile"],
        queryFn: () => apiClient.get("/api/wedding_profiles?itemsPerPage=1"),
    });

    const profile: WeddingProfile | null = (profileData as any)?.["hydra:member"]?.[0] ?? null;
    const profileId = profile?.id ?? null;

    const isDemo = !profileLoading && !profile;

    const { data: taskData } = useQuery({
        queryKey: ["checklistTasks", profileId],
        queryFn: () => apiClient.get(`/api/checklist_tasks?weddingProfile=${profileId}`),
        enabled: profileId !== null,
    });

    const apiTasks: ChecklistTask[] = (taskData as any)?.["hydra:member"] ?? [];
    const tasks = isDemo ? MOCK_TASKS : apiTasks;

    const addMutation = useMutation({
        mutationFn: (data: typeof newTask & { weddingProfile: string }) =>
            apiClient.post("/api/checklist_tasks", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["checklistTasks", profileId] });
            setIsAdding(false);
            setNewTask({ title: "", category: "salles", dueDate: "", isCompleted: false });
        },
    });

    const toggleMutation = useMutation({
        mutationFn: (task: ChecklistTask) =>
            apiClient.patch(`/api/checklist_tasks/${task.id}`, { isCompleted: !task.isCompleted }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["checklistTasks", profileId] }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => apiClient.delete(`/api/checklist_tasks/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["checklistTasks", profileId] }),
    });

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!profileId) return;
        addMutation.mutate({
            ...newTask,
            weddingProfile: `/api/wedding_profiles/${profileId}`,
        });
    };

    const handleDeleteTask = (id: number) => {
        if (!window.confirm(t("checklist.delete_confirm"))) return;
        deleteMutation.mutate(id);
    };

    const completedCount = tasks.filter((task) => task.isCompleted).length;
    const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

    // ── Pre-defined Phases ──────────────────────────────────────────────────
    const PHASES = [
        { id: "foundations", label: "Les Fondamentations", months: "12-9 months before" },
        { id: "details", label: "Le Planning Détail", months: "6-3 months before" },
        { id: "final", label: "Le Sprint Final", months: "1 month before" },
        { id: "day_of", label: "Le Jour J", months: "Wedding Day" }
    ];

    const MOROCCAN_TASKS = [
        { title: "Choisir la Negafa", category: "tenues", phase: "foundations" },
        { title: "Réservation de la Salle/Riad", category: "salles", phase: "foundations" },
        { title: "Dégustation Traiteur (Pastilla & Méchoui)", category: "traiteur", phase: "details" },
        { title: "Sélection de l'Ammariya", category: "tenues", phase: "details" },
        { title: "Organisation de la Nuit du Henné", category: "autre", phase: "final" },
    ];

    const tasksByPhase = PHASES.map(phase => ({
        ...phase,
        tasks: tasks.filter(t => (t as any).phase === phase.id || (! (t as any).phase && phase.id === "foundations"))
    }));

    return (
        <PlanningLayout
            title={t("checklist.title")}
            description={t("checklist.description")}
        >
            <Head>
                <title>{t("nav.checklist")} — Farah.ma</title>
            </Head>

            {/* Demo banner */}
            {isDemo && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 w-fit">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    {t("dashboard.couple.view_mode.demo_banner")}
                </div>
            )}

            {/* Progress Journey Header */}
            <div className="bg-neutral-900 p-6 md:p-12 lg:p-16 rounded-[2rem] md:rounded-[3rem] text-white shadow-3 mb-12 relative overflow-hidden">
                <div className="absolute top-0 end-0 w-96 h-96 bg-primary/20 rounded-full -me-32 -mt-32 blur-3xl opacity-50" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold text-[13px] uppercase tracking-widest">
                            <Zap size={16} />
                            Planning Journey
                        </div>
                        <h3 className="font-display text-4xl md:text-5xl">{t("checklist.progress_title")}</h3>
                        <p className="text-white/60 text-[16px] max-w-md font-medium">
                            {t("checklist.progress_stats", { done: completedCount, total: tasks.length })} tasks completed.
                        </p>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="text-end">
                            <span className="block text-5xl md:text-7xl font-black text-primary leading-none">
                                {Math.round(progressPercent)}%
                            </span>
                            <span className="text-white/40 text-[12px] font-bold uppercase tracking-widest mt-2 block">
                                Overall Progress
                            </span>
                        </div>
                        <div className="w-24 h-24 rounded-full border-4 border-white/10 flex items-center justify-center relative">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={251} strokeDashoffset={251 - (251 * progressPercent) / 100} strokeLinecap="round" className="text-primary transition-all duration-1000" />
                            </svg>
                            <Calendar className="absolute text-white/20" size={32} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Task Area */}
            <div className="space-y-12">
                {tasksByPhase.map((phase, phaseIdx) => (
                    <div key={phase.id} className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-0 px-4">
                            <div>
                                <h4 className="font-display text-3xl text-neutral-900">{phase.label}</h4>
                                <p className="text-[#717171] text-xs font-bold uppercase tracking-widest mt-1">{phase.months}</p>
                            </div>
                            {phaseIdx === 0 && (
                                <Button
                                    onClick={() => !isDemo && setIsAdding(true)}
                                    disabled={isDemo}
                                    title={isDemo ? "Mode démo — connectez-vous pour ajouter" : undefined}
                                    className="rounded-full px-8 h-12 font-black text-[12px] uppercase shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus size={16} className="me-2" />
                                    {t("checklist.add_task")}
                                </Button>
                            )}
                        </div>

                        <div className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm divide-y divide-neutral-50">
                            {phase.tasks.length === 0 ? (
                                <div className="p-12 text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center mx-auto text-[#B0B0B0]">
                                        <Clock size={24} />
                                    </div>
                                    <p className="text-[#717171] font-medium italic">No tasks yet for this phase.</p>
                                </div>
                            ) : (
                                phase.tasks.map((task) => (
                                    <motion.div
                                        key={task.id}
                                        layout
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 px-6 sm:px-8 py-6 hover:bg-[#F7F7F7]/50 transition-all group"
                                    >
                                        <div className="flex items-center gap-6">
                                            <button
                                                onClick={() => toggleMutation.mutate(task)}
                                                className={cn(
                                                    "w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-300",
                                                    task.isCompleted
                                                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
                                                    : "bg-white border-neutral-200 text-transparent hover:border-primary"
                                                )}
                                            >
                                                <CheckCircle2 size={24} className={task.isCompleted ? "scale-100" : "scale-50 opacity-0"} />
                                            </button>
                                            <div>
                                                <h4 className={cn(
                                                    "text-[17px] font-bold transition-all duration-300",
                                                    task.isCompleted ? "text-[#B0B0B0] line-through" : "text-neutral-900"
                                                )}>
                                                    {task.title}
                                                </h4>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-neutral-100 text-[#717171] rounded-full">
                                                        {t(`checklist.categories.${task.category}`)}
                                                    </span>
                                                    {task.dueDate && (
                                                        <div className="flex items-center gap-1 text-[11px] font-bold text-[#717171]">
                                                            <Calendar size={12} />
                                                            {new Date(task.dueDate).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => !isDemo && handleDeleteTask(task.id)}
                                            disabled={isDemo}
                                            className="w-12 h-12 rounded-2xl text-[#B0B0B0] hover:text-red-500 hover:bg-red-50 transition-all self-end sm:self-auto opacity-100 sm:opacity-0 group-hover:opacity-100 disabled:hover:bg-transparent disabled:hover:text-[#B0B0B0] disabled:cursor-not-allowed"
                                        >
                                            <Trash2 size={20} />
                                        </Button>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-[var(--color-primary)]/40 backdrop-blur-md" onClick={() => setIsAdding(false)} />
                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in fade-in zoom-in duration-300 border border-[var(--color-accent)]/10">
                        <h3 className="font-display font-black text-2xl text-[var(--color-primary)] mb-8">{t("checklist.new_task_title")}</h3>

                        {addMutation.isError && (
                            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold">
                                {t("checklist.error_add")}
                            </div>
                        )}

                        <form onSubmit={handleAddTask} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">{t("checklist.tasks_title")}</Label>
                                <Input
                                    type="text"
                                    required
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                    placeholder={t("checklist.task_placeholder")}
                                    className="w-full h-auto bg-[var(--color-background)] border-0.5 border-[var(--color-charcoal-100)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">{t("checklist.category_label")}</Label>
                                    <Select
                                        value={newTask.category}
                                        onValueChange={(val) => setNewTask({...newTask, category: val})}
                                    >
                                        <SelectTrigger className="w-full h-auto bg-[var(--color-background)] border-0.5 border-[var(--color-charcoal-100)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-primary)] focus:ring-[var(--color-accent)] outline-none transition-all">
                                            <SelectValue placeholder={t("common.confirm")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map((c) => (
                                                <SelectItem key={c} value={c}>
                                                    {t(`checklist.categories.${c}`)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">{t("checklist.due_date_label")}</Label>
                                    <Input
                                        type="date"
                                        value={newTask.dueDate}
                                        onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                                        className="w-full h-auto bg-[var(--color-background)] border-0.5 border-[var(--color-charcoal-100)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] outline-none transition-all"
                                    />
                                </div>
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
