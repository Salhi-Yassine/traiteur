import { useTranslation } from "next-i18next";
import Head from "next/head";
import PlanningLayout from "../../components/layout/PlanningLayout";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../utils/apiClient";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
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

    const { data: profileData } = useQuery({
        queryKey: ["weddingProfile"],
        queryFn: () => apiClient.get("/api/wedding_profiles?itemsPerPage=1"),
    });

    const profile: WeddingProfile | null = profileData?.["hydra:member"]?.[0] ?? null;
    const profileId = profile?.id ?? null;

    const { data: taskData } = useQuery({
        queryKey: ["checklistTasks", profileId],
        queryFn: () => apiClient.get(`/api/checklist_tasks?weddingProfile=${profileId}`),
        enabled: profileId !== null,
    });

    const tasks: ChecklistTask[] = taskData?.["hydra:member"] ?? [];

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

    return (
        <PlanningLayout
            title={t("checklist.title")}
            description={t("checklist.description")}
        >
            <Head>
                <title>{t("nav.checklist")} — Farah.ma</title>
            </Head>

            {/* Progress Bar Top */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-[var(--color-charcoal-100)] shadow-sm mb-12">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-display font-black text-2xl text-[var(--color-primary)]">{t("checklist.progress_title")}</h3>
                        <span className="text-[var(--color-charcoal-400)] text-xs font-bold uppercase tracking-widest mt-1">
                            {t("checklist.progress_stats", { done: completedCount, total: tasks.length })}
                        </span>
                    </div>
                    <span className="text-4xl font-black text-[var(--color-accent)]">{Math.round(progressPercent)}%</span>
                </div>
                <div className="h-4 w-full bg-[var(--color-background)] rounded-full overflow-hidden">
                    {/* Dynamic width is a runtime value — inline style is the correct approach here */}
                    <div
                        className="h-full bg-[var(--color-accent)] transition-all duration-1000 shadow-lg shadow-[var(--color-accent)]/20"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Delete error */}
            {deleteMutation.isError && (
                <div className="mb-6 px-6 py-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold">
                    {t("checklist.error_delete")}
                </div>
            )}

            {/* Task List */}
            <div className="bg-white rounded-[2.5rem] border border-[var(--color-charcoal-100)] overflow-hidden shadow-sm">
                <div className="px-10 py-8 border-b border-[var(--color-background)] flex items-center justify-between">
                    <h3 className="font-display font-black text-2xl text-[var(--color-primary)]">{t("checklist.tasks_title")}</h3>
                    <Button
                        onClick={() => setIsAdding(true)}
                        className="bg-[var(--color-accent)] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-[var(--color-accent)]/20 h-auto"
                    >
                        + {t("checklist.add_task")}
                    </Button>
                </div>

                <div className="grid grid-cols-1 divide-y divide-[var(--color-background)]">
                    {tasks.length === 0 && (
                        <div className="px-10 py-20 text-center text-[var(--color-charcoal-400)] italic font-medium">
                            {t("checklist.empty")}
                        </div>
                    )}
                    {tasks
                        .slice()
                        .sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted))
                        .map((task) => (
                            <div key={task.id} className="flex items-center justify-between px-10 py-6 hover:bg-[var(--color-background)]/30 transition-all group">
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={() => toggleMutation.mutate(task)}
                                        className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                                            task.isCompleted
                                            ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                                            : "border-[var(--color-charcoal-200)] hover:border-[var(--color-accent)] text-transparent"
                                        }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </button>
                                    <div>
                                        <h4 className={`font-bold transition-all ${task.isCompleted ? "text-[var(--color-charcoal-400)] line-through" : "text-[var(--color-primary)]"}`}>
                                            {task.title}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-[var(--color-background)] text-[var(--color-charcoal-400)] rounded-md border border-[var(--color-charcoal-100)]">
                                                {t(`checklist.categories.${task.category}`)}
                                            </span>
                                            {task.dueDate && (
                                                <p className="text-[10px] font-medium text-[var(--color-charcoal-400)] mt-1">
                                                    {t("checklist.due_date", { date: new Date(task.dueDate).toLocaleDateString() })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="text-[var(--color-charcoal-300)] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </Button>
                            </div>
                        ))}
                </div>
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
