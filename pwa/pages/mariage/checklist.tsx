import { useTranslation, type TFunction } from "next-i18next";
import Head from "next/head";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { motion } from "framer-motion";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, CheckCircle2, Clock, Plus, Trash2, Zap, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import PlanningLayout from "../../components/layout/PlanningLayout";
import apiClient from "../../utils/apiClient";
import { unwrapCollection } from "../../utils/hydra";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChecklistTask {
    id: number;
    name: string;
    category: string;
    status: "todo" | "in_progress" | "done";
    displayOrder: number;
    dueDate?: string;
    monthsBefore?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ["salles", "traiteur", "tenues", "beaute", "photo", "papeterie", "autre"];

const PHASES = [
    { id: "foundations", labelKey: "checklist.phases.foundations", months: "12–9 mois avant" },
    { id: "details",     labelKey: "checklist.phases.details",     months: "6–3 mois avant" },
    { id: "final",       labelKey: "checklist.phases.final",       months: "1 mois avant"   },
    { id: "day_of",      labelKey: "checklist.phases.day_of",      months: "Jour J"         },
];

const MOCK_TASKS: ChecklistTask[] = [
    { id: 1, name: "Choisir la Negafa",                             category: "tenues",     status: "done", displayOrder: 0, monthsBefore: 12 },
    { id: 2, name: "Réservation de la Salle/Riad",                 category: "salles",     status: "done", displayOrder: 1, monthsBefore: 12 },
    { id: 3, name: "Dégustation Traiteur (Pastilla & Méchoui)",    category: "traiteur",   status: "done", displayOrder: 2, dueDate: "2026-03-15", monthsBefore: 6 },
    { id: 4, name: "Sélection de l'Ammariya",                      category: "tenues",     status: "todo", displayOrder: 3, dueDate: "2026-05-10", monthsBefore: 6 },
    { id: 5, name: "Choisir le photographe",                       category: "photo",      status: "todo", displayOrder: 4, dueDate: "2026-05-15", monthsBefore: 6 },
    { id: 6, name: "Envoyer les faire-parts",                      category: "papeterie",  status: "done", displayOrder: 5, dueDate: "2026-04-01", monthsBefore: 6 },
    { id: 7, name: "Organisation de la Nuit du Henné",             category: "autre",      status: "todo", displayOrder: 6, dueDate: "2026-06-01", monthsBefore: 2 },
    { id: 8, name: "Confirmation des prestataires",                category: "autre",      status: "todo", displayOrder: 7, dueDate: "2026-06-15", monthsBefore: 2 },
];

function getPhaseId(monthsBefore?: number): string {
    if (monthsBefore === undefined || monthsBefore === null) return "day_of";
    if (monthsBefore >= 9) return "foundations";
    if (monthsBefore >= 3) return "details";
    if (monthsBefore >= 1) return "final";
    return "day_of";
}

// ─── Sortable task row ────────────────────────────────────────────────────────

interface TaskRowProps {
    task: ChecklistTask;
    onToggle: () => void;
    onDelete: () => void;
    isDemo: boolean;
    t: TFunction;
}

function SortableTaskRow({ task, onToggle, onDelete, isDemo, t }: TaskRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const isDone = task.status === "done";

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 px-6 sm:px-8 py-6 hover:bg-[#F7F7F7]/50 transition-all group border-b border-neutral-50 last:border-b-0",
                isDragging && "opacity-50 bg-[#F7F7F7] shadow-lg z-10 relative",
            )}
        >
            <div className="flex items-center gap-4">
                {/* Drag handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-[#D0D0D0] hover:text-[#717171] transition-colors cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
                    aria-label={t("checklist.drag_handle", "Réorganiser")}
                    tabIndex={-1}
                >
                    <GripVertical size={16} />
                </button>

                {/* Toggle */}
                <button
                    onClick={onToggle}
                    className={cn(
                        "w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0",
                        isDone
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/30"
                            : "bg-white border-neutral-200 text-transparent hover:border-primary",
                    )}
                >
                    <CheckCircle2 size={24} className={isDone ? "scale-100" : "scale-50 opacity-0"} />
                </button>

                {/* Info */}
                <div>
                    <h4 className={cn(
                        "text-[17px] font-bold transition-all duration-300",
                        isDone ? "text-[#B0B0B0] line-through" : "text-neutral-900",
                    )}>
                        {task.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-neutral-100 text-[#717171] rounded-full">
                            {t(`checklist.categories.${task.category}`, task.category)}
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
                onClick={() => !isDemo && onDelete()}
                disabled={isDemo}
                className="w-12 h-12 rounded-2xl text-[#B0B0B0] hover:text-red-500 hover:bg-red-50 transition-all self-end sm:self-auto opacity-100 sm:opacity-0 group-hover:opacity-100 disabled:hover:bg-transparent disabled:hover:text-[#B0B0B0] disabled:cursor-not-allowed"
            >
                <Trash2 size={20} />
            </Button>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface WeddingProfile {
    id: number;
}

export default function ChecklistPage() {
    const { t } = useTranslation("common");
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [orderedTasks, setOrderedTasks] = useState<ChecklistTask[]>([]);
    const [newTask, setNewTask] = useState({ name: "", category: "salles", dueDate: "" });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const { data: profileData, isLoading: profileLoading } = useQuery({
        queryKey: ["weddingProfile"],
        queryFn: () => apiClient.get("/api/wedding_profiles?itemsPerPage=1"),
    });

    const profile: WeddingProfile | null =
        unwrapCollection<WeddingProfile>(profileData as { member?: WeddingProfile[] })[0] ?? null;
    const profileId = profile?.id ?? null;
    const isDemo = !profileLoading && !profile;

    const { data: taskData } = useQuery({
        queryKey: ["checklistTasks", profileId],
        queryFn: () => apiClient.get(`/api/checklist_tasks?weddingProfile=${profileId}&order[displayOrder]=asc`),
        enabled: profileId !== null,
        select: (data: any) => {
            const apiTasks: ChecklistTask[] = unwrapCollection<ChecklistTask>(data);
            setOrderedTasks(apiTasks);
            return apiTasks;
        },
    });

    // In demo mode, seed local state from mock data once
    const [demoSeeded, setDemoSeeded] = useState(false);
    if (isDemo && !demoSeeded) {
        setOrderedTasks(MOCK_TASKS);
        setDemoSeeded(true);
    }

    const tasks = orderedTasks;
    const completedCount = tasks.filter(t => t.status === "done").length;
    const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

    const addMutation = useMutation({
        mutationFn: (data: { name: string; category: string; dueDate?: string; weddingProfile: string; displayOrder: number; status: string }) =>
            apiClient.post("/api/checklist_tasks", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["checklistTasks", profileId] });
            setIsAdding(false);
            setNewTask({ name: "", category: "salles", dueDate: "" });
        },
    });

    const toggleMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            apiClient.patch(`/api/checklist_tasks/${id}`, { status }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["checklistTasks", profileId] }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => apiClient.delete(`/api/checklist_tasks/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["checklistTasks", profileId] }),
    });

    const reorderMutation = useMutation({
        mutationFn: ({ id, displayOrder }: { id: number; displayOrder: number }) =>
            apiClient.patch(`/api/checklist_tasks/${id}`, { displayOrder }),
    });

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!profileId) return;
        addMutation.mutate({
            name: newTask.name,
            category: newTask.category,
            dueDate: newTask.dueDate || undefined,
            status: "todo",
            displayOrder: tasks.length,
            weddingProfile: `/api/wedding_profiles/${profileId}`,
        });
    };

    const handleToggle = (task: ChecklistTask) => {
        const newStatus = task.status === "done" ? "todo" : "done";
        // Optimistic update
        setOrderedTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus as ChecklistTask["status"] } : t));
        if (!isDemo) toggleMutation.mutate({ id: task.id, status: newStatus });
    };

    const handleDelete = (id: number) => {
        if (!window.confirm(t("checklist.delete_confirm"))) return;
        setOrderedTasks(prev => prev.filter(t => t.id !== id));
        if (!isDemo) deleteMutation.mutate(id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeId = Number(active.id);
        const overId = Number(over.id);
        const oldIndex = orderedTasks.findIndex(t => t.id === activeId);
        const newIndex = orderedTasks.findIndex(t => t.id === overId);

        const reordered = arrayMove(orderedTasks, oldIndex, newIndex).map((task, idx) => ({
            ...task,
            displayOrder: idx,
        }));

        setOrderedTasks(reordered);

        if (!isDemo) {
            reordered.forEach((task, idx) => {
                const original = orderedTasks.find(t => t.id === task.id);
                if (original && original.displayOrder !== idx) {
                    reorderMutation.mutate({ id: task.id, displayOrder: idx });
                }
            });
        }
    };

    // Group by phase for visual headers
    const tasksByPhase = PHASES.map(phase => ({
        ...phase,
        tasks: tasks.filter(t => getPhaseId(t.monthsBefore) === phase.id),
    }));

    return (
        <PlanningLayout title={t("checklist.title")} description={t("checklist.description")}>
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

            {/* Progress hero */}
            <div className="bg-neutral-900 p-6 md:p-12 lg:p-16 rounded-[2rem] md:rounded-[3rem] text-white shadow-3 mb-12 relative overflow-hidden">
                <div className="absolute top-0 end-0 w-96 h-96 bg-primary/20 rounded-full -me-32 -mt-32 blur-3xl opacity-50" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold text-[13px] uppercase tracking-widest">
                            <Zap size={16} />
                            {t("checklist.planning_journey", "Planning Journey")}
                        </div>
                        <h3 className="font-display text-4xl md:text-5xl">{t("checklist.progress_title")}</h3>
                        <p className="text-white/60 text-[16px] max-w-md font-medium">
                            {t("checklist.progress_stats", { done: completedCount, total: tasks.length })}
                        </p>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="text-end">
                            <span className="block text-5xl md:text-7xl font-black text-primary leading-none">
                                {Math.round(progressPercent)}%
                            </span>
                            <span className="text-white/40 text-[12px] font-bold uppercase tracking-widest mt-2 block">
                                {t("checklist.overall_progress", "Overall Progress")}
                            </span>
                        </div>
                        <div className="w-24 h-24 rounded-full border-4 border-white/10 flex items-center justify-center relative">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                                <circle
                                    cx="48" cy="48" r="40"
                                    stroke="currentColor" strokeWidth="4" fill="transparent"
                                    strokeDasharray={251}
                                    strokeDashoffset={251 - (251 * progressPercent) / 100}
                                    strokeLinecap="round"
                                    className="text-primary transition-all duration-1000"
                                />
                            </svg>
                            <Calendar className="absolute text-white/20" size={32} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Add button */}
            <div className="flex justify-end mb-8">
                <Button
                    onClick={() => !isDemo && setIsAdding(true)}
                    disabled={isDemo}
                    title={isDemo ? "Mode démo — connectez-vous pour ajouter" : undefined}
                    className="rounded-full px-8 h-12 font-black text-[12px] uppercase shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus size={16} className="me-2" />
                    {t("checklist.add_task")}
                </Button>
            </div>

            {/* Sortable task list */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-12">
                        {tasksByPhase.map((phase) => (
                            <div key={phase.id} className="space-y-0">
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-0 px-4 mb-6">
                                    <div>
                                        <h4 className="font-display text-3xl text-neutral-900">
                                            {t(phase.labelKey, phase.id)}
                                        </h4>
                                        <p className="text-[#717171] text-xs font-bold uppercase tracking-widest mt-1">
                                            {phase.months}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm">
                                    {phase.tasks.length === 0 ? (
                                        <div className="p-12 text-center space-y-4">
                                            <div className="w-16 h-16 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center mx-auto text-[#B0B0B0]">
                                                <Clock size={24} />
                                            </div>
                                            <p className="text-[#717171] font-medium italic">
                                                {t("checklist.no_tasks_phase", "Aucune tâche pour cette phase.")}
                                            </p>
                                        </div>
                                    ) : (
                                        phase.tasks.map((task) => (
                                            <SortableTaskRow
                                                key={task.id}
                                                task={task}
                                                onToggle={() => handleToggle(task)}
                                                onDelete={() => handleDelete(task.id)}
                                                isDemo={isDemo}
                                                t={t}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Add modal */}
            {isAdding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-[var(--color-primary)]/40 backdrop-blur-md" onClick={() => setIsAdding(false)} />
                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in fade-in zoom-in duration-300 border border-[var(--color-accent)]/10">
                        <h3 className="font-display font-black text-2xl text-[var(--color-primary)] mb-8">
                            {t("checklist.new_task_title")}
                        </h3>

                        {addMutation.isError && (
                            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold">
                                {t("checklist.error_add")}
                            </div>
                        )}

                        <form onSubmit={handleAddTask} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">
                                    {t("checklist.tasks_title")}
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    value={newTask.name}
                                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                                    placeholder={t("checklist.task_placeholder")}
                                    className="w-full h-auto bg-[var(--color-background)] border-0.5 border-[var(--color-charcoal-100)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">
                                        {t("checklist.category_label")}
                                    </Label>
                                    <Select value={newTask.category} onValueChange={(v) => setNewTask({ ...newTask, category: v })}>
                                        <SelectTrigger className="w-full h-auto bg-[var(--color-background)] border-0.5 border-[var(--color-charcoal-100)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-primary)] focus:ring-[var(--color-accent)] outline-none transition-all">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map((c) => (
                                                <SelectItem key={c} value={c}>
                                                    {t(`checklist.categories.${c}`, c)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">
                                        {t("checklist.due_date_label")}
                                    </Label>
                                    <Input
                                        type="date"
                                        value={newTask.dueDate}
                                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
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

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale || "fr", ["common"])),
    },
});
