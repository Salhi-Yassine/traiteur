import Head from "next/head";
import PlanningLayout from "../../components/layout/PlanningLayout";
import { useState, useEffect } from "react";
import apiClient from "../../utils/apiClient";

interface BudgetItem {
    id: number;
    category: string;
    budgetedAmount: number;
    spentAmount: number;
}

export default function BudgetPage() {
    const [items, setItems] = useState<BudgetItem[]>([]);
    const [totalBudget, setTotalBudget] = useState(0);
    const [weddingProfileId, setWeddingProfileId] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({ category: "", budgetedAmount: 0 });

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
                setTotalBudget(wp.totalBudgetMad ?? 0);
                
                // Fetch budget items
                const budgetRes = await apiClient.get(`/api/budget_items?weddingProfile=${wp.id}`);
                setItems(budgetRes["hydra:member"] ?? []);
            }
        } catch (err) {
            console.error("Error fetching budget data:", err);
        }
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post("/api/budget_items", {
                ...newItem,
                weddingProfile: `/api/wedding_profiles/${weddingProfileId}`,
                spentAmount: 0,
                displayOrder: items.length
            });
            setIsAdding(false);
            setNewItem({ category: "", budgetedAmount: 0 });
            fetchData();
        } catch (err) {
            alert("Erreur lors de l'ajout.");
        }
    };

    const handleDeleteItem = async (id: number) => {
        if (!confirm("Voulez-vous vraiment supprimer cette catégorie ?")) return;
        try {
            await apiClient.delete(`/api/budget_items/${id}`);
            fetchData();
        } catch (err) {
            alert("Erreur lors de la suppression.");
        }
    };

    const totalSpent = items.reduce((acc, curr) => acc + curr.spentAmount, 0);
    const totalBudgeted = items.reduce((acc, curr) => acc + curr.budgetedAmount, 0);
    const remainingBudget = totalBudget - totalSpent;

    return (
        <PlanningLayout 
            title="Gestion du Budget" 
            description="Suivez vos dépenses et optimisez vos coûts pour chaque poste de dépense."
        >
            <Head>
                <title>Mon Budget — Farah.ma</title>
            </Head>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-8 rounded-[2.5rem] border border-[var(--color-charcoal-100)] shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)] mb-2">Budget Total</p>
                    <div className="flex items-end gap-2 text-[var(--color-primary)]">
                        <span className="text-3xl font-black">{totalBudget.toLocaleString()}</span>
                        <span className="text-sm font-bold mb-1.5 opacity-60">MAD</span>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-[var(--color-charcoal-100)] shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)] mb-2">Dépensé</p>
                    <div className="flex items-end gap-2 text-[var(--color-accent)]">
                        <span className="text-3xl font-black">{totalSpent.toLocaleString()}</span>
                        <span className="text-sm font-bold mb-1.5 opacity-60">MAD</span>
                    </div>
                </div>
                <div className="bg-[var(--color-primary)] p-8 rounded-[2.5rem] shadow-xl shadow-[var(--color-primary)]/10 text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Reste à dépenser</p>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-black">{remainingBudget.toLocaleString()}</span>
                        <span className="text-sm font-bold mb-1.5 opacity-60">MAD</span>
                    </div>
                </div>
            </div>

            {/* Budget Table / List */}
            <div className="bg-white rounded-[2.5rem] border border-[var(--color-charcoal-100)] overflow-hidden shadow-sm">
                <div className="px-10 py-8 border-b border-[var(--color-background)] flex items-center justify-between">
                    <h3 className="font-display font-black text-2xl text-[var(--color-primary)]">Postes de Dépenses</h3>
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="bg-[var(--color-accent)] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[var(--color-accent-light)] transition-all shadow-lg shadow-[var(--color-accent)]/20"
                    >
                        + Ajouter
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--color-background)]/50">
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)]">Catégorie</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)] text-right">Budget Prévu</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)] text-right">Montant Payé</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-background)]">
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-10 py-20 text-center text-[var(--color-charcoal-400)] italic font-medium">
                                        Aucun poste de dépense pour le moment.
                                    </td>
                                </tr>
                            )}
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-[var(--color-background)]/30 transition-colors group">
                                    <td className="px-10 py-6 font-bold text-[var(--color-primary)]">{item.category}</td>
                                    <td className="px-10 py-6 text-right font-bold text-[var(--color-charcoal-600)]">{item.budgetedAmount.toLocaleString()} MAD</td>
                                    <td className="px-10 py-6 text-right font-black text-[var(--color-accent)]">{item.spentAmount.toLocaleString()} MAD</td>
                                    <td className="px-10 py-6 text-right">
                                        <button 
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="p-3 text-[var(--color-charcoal-300)] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {items.length > 0 && (
                            <tfoot className="bg-[var(--color-background)]/20">
                                <tr>
                                    <td className="px-10 py-6 font-black text-[var(--color-primary)] uppercase tracking-widest text-xs">TOTAUX</td>
                                    <td className="px-10 py-6 text-right font-black text-[var(--color-primary)]">{totalBudgeted.toLocaleString()} MAD</td>
                                    <td className="px-10 py-6 text-right font-black text-[var(--color-accent)]">{totalSpent.toLocaleString()} MAD</td>
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
                        <h3 className="font-display font-black text-2xl text-[var(--color-primary)] mb-8">Nouveau poste</h3>
                        <form onSubmit={handleAddItem} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">Catégorie</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newItem.category}
                                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                                    placeholder="ex: Traiteur, Photographe..."
                                    className="w-full bg-[var(--color-background)] border-0.5 border-[var(--color-charcoal-100)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent)] outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">Budget Prévu (MAD)</label>
                                <input 
                                    type="number" 
                                    required
                                    value={newItem.budgetedAmount}
                                    onChange={(e) => setNewItem({...newItem, budgetedAmount: Number(e.target.value)})}
                                    className="w-full bg-[var(--color-background)] border-0.5 border-[var(--color-charcoal-100)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent)] outline-none transition-all"
                                />
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
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PlanningLayout>
    );
}
