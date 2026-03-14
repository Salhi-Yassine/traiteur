import Head from "next/head";
import PlanningLayout from "../../components/layout/PlanningLayout";
import { useState, useEffect } from "react";
import apiClient from "../../utils/apiClient";

interface ChecklistTask {
    id: number;
    title: string;
    description?: string;
    category: string;
    dueDate?: string;
    isCompleted: boolean;
}

const CATEGORIES = ["Salles", "Traiteur", "Tenues", "Beauté", "Photo", "Papeterie", "Autre"];

export default function ChecklistPage() {
    const [tasks, setTasks] = useState<ChecklistTask[]>([]);
    const [weddingProfileId, setWeddingProfileId] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newTask, setNewTask] = useState({ 
        title: "", 
        category: "Salles",
        dueDate: "",
        isCompleted: false
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const profileRes = await apiClient.get("/api/wedding_profiles?itemsPerPage=1");
            const members = profileRes["hydra:member"] ?? [];
            if (members.length > 0) {
                const wp = members[0];
                setWeddingProfileId(wp.id);
                
                const taskRes = await apiClient.get(`/api/checklist_tasks?weddingProfile=${wp.id}`);
                setTasks(taskRes["hydra:member"] ?? []);
            }
        } catch (err) {
            console.error("Error fetching tasks:", err);
        }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post("/api/checklist_tasks", {
                ...newTask,
                weddingProfile: `/api/wedding_profiles/${weddingProfileId}`
            });
            setIsAdding(false);
            setNewTask({ title: "", category: "Salles", dueDate: "", isCompleted: false });
            fetchData();
        } catch (err) {
            alert("Erreur lors de l'ajout de la tâche.");
        }
    };

    const handleToggleTask = async (task: ChecklistTask) => {
        try {
            await apiClient.patch(`/api/checklist_tasks/${task.id}`, {
                isCompleted: !task.isCompleted
            });
            fetchData();
        } catch (err) {
            console.error("Error toggling task:", err);
        }
    };

    const handleDeleteTask = async (id: number) => {
        if (!confirm("Voulez-vous supprimer cette tâche ?")) return;
        try {
            await apiClient.delete(`/api/checklist_tasks/${id}`);
            fetchData();
        } catch (err) {
            alert("Erreur lors de la suppression.");
        }
    };

    const completedCount = tasks.filter(t => t.isCompleted).length;
    const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

    return (
        <PlanningLayout 
            title="Ma Checklist" 
            description="Suivez chaque étape de l'organisation et ne manquez aucun détail important."
        >
            <Head>
                <title>Ma Checklist — Farah.ma</title>
            </Head>

            {/* Progress Bar Top */}
            <div className="bg-white p-10 rounded-[3rem] border border-[var(--color-charcoal-100)] shadow-sm mb-12">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h4 className="font-display font-black text-2xl text-[var(--color-primary)]">Progression globale</h4>
                        <p className="text-[var(--color-charcoal-400)] text-xs font-bold uppercase tracking-widest mt-1">
                            {completedCount} tâches sur {tasks.length} terminées
                        </p>
                    </div>
                    <span className="text-4xl font-black text-[var(--color-accent)]">{Math.round(progressPercent)}%</span>
                </div>
                <div className="h-4 w-full bg-[var(--color-background)] rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-[var(--color-accent)] transition-all duration-1000 shadow-lg shadow-[var(--color-accent)]/20" 
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Task List */}
            <div className="bg-white rounded-[2.5rem] border border-[var(--color-charcoal-100)] overflow-hidden shadow-sm">
                <div className="px-10 py-8 border-b border-[var(--color-background)] flex items-center justify-between">
                    <h3 className="font-display font-black text-2xl text-[var(--color-primary)]">Mes Tâches</h3>
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="bg-[var(--color-accent)] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-[var(--color-accent)]/20"
                    >
                        + Ajouter une tâche
                    </button>
                </div>

                <div className="grid grid-cols-1 divide-y divide-[var(--color-background)]">
                    {tasks.length === 0 && (
                        <div className="px-10 py-20 text-center text-[var(--color-charcoal-400)] italic font-medium">
                            Aucune tâche enregistrée. Commencez par en ajouter une !
                        </div>
                    )}
                    {tasks.sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted)).map((task) => (
                        <div key={task.id} className="flex items-center justify-between px-10 py-6 hover:bg-[var(--color-background)]/30 transition-all group">
                            <div className="flex items-center gap-6">
                                <button 
                                    onClick={() => handleToggleTask(task)}
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
                                            {task.category}
                                        </span>
                                        {task.dueDate && (
                                            <span className="text-[9px] font-bold text-[var(--color-charcoal-400)]">
                                                • Échéance : {new Date(task.dueDate).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-3 text-[var(--color-charcoal-300)] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-[var(--color-primary)]/40 backdrop-blur-md" onClick={() => setIsAdding(false)} />
                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in fade-in zoom-in duration-300 border border-[var(--color-accent)]/10">
                        <h3 className="font-display font-black text-2xl text-[var(--color-primary)] mb-8">Nouvelle tâche</h3>
                        <form onSubmit={handleAddTask} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">Titre de la tâche</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                    placeholder="ex: Réserver la salle, Choisir le menu..."
                                    className="w-full bg-[var(--color-background)] border-0.5 border-[var(--color-charcoal-100)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent)] outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">Catégorie</label>
                                    <select 
                                        value={newTask.category}
                                        onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                                        className="w-full bg-[var(--color-background)] border-0.5 border-[var(--color-charcoal-100)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent)] outline-none transition-all appearance-none"
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">Échéance</label>
                                    <input 
                                        type="date" 
                                        value={newTask.dueDate}
                                        onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                                        className="w-full bg-[var(--color-background)] border-0.5 border-[var(--color-charcoal-100)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent)] outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 py-4 border-2 border-[var(--color-primary)] rounded-2xl text-xs font-black uppercase tracking-widest text-[var(--color-primary)] hover:bg-[var(--color-background)] transition-all"
                                >
                                    Annuler
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 py-4 bg-[var(--color-accent)] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[var(--color-accent-light)] transition-all shadow-xl shadow-[var(--color-accent)]/20"
                                >
                                    Ajouter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PlanningLayout>
    );
}
