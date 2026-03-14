import Head from "next/head";
import PlanningLayout from "../../components/layout/PlanningLayout";
import { useState, useEffect } from "react";
import apiClient from "../../utils/apiClient";

interface Guest {
    id: number;
    name: string;
    rsvpStatus: string;
    side: string;
    mealPreference: string;
}

const RSVP_LABELS: Record<string, string> = {
    'pending': 'En attente',
    'confirmed': 'Confirmé',
    'declined': 'Décliné'
};

const SIDE_LABELS: Record<string, string> = {
    'bride': 'Mariée',
    'groom': 'Marié'
};

export default function InvitesPage() {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [weddingProfileId, setWeddingProfileId] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newGuest, setNewGuest] = useState({ 
        name: "", 
        rsvpStatus: "pending", 
        side: "bride", 
        mealPreference: "standard" 
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
                
                const guestRes = await apiClient.get(`/api/guests?weddingProfile=${wp.id}`);
                setGuests(guestRes["hydra:member"] ?? []);
            }
        } catch (err) {
            console.error("Error fetching guests:", err);
        }
    };

    const handleAddGuest = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post("/api/guests", {
                ...newGuest,
                weddingProfile: `/api/wedding_profiles/${weddingProfileId}`
            });
            setIsAdding(false);
            setNewGuest({ name: "", rsvpStatus: "pending", side: "bride", mealPreference: "standard" });
            fetchData();
        } catch (err) {
            alert("Erreur lors de l'ajout de l'invité.");
        }
    };

    const handleDeleteGuest = async (id: number) => {
        if (!confirm("Voulez-vous supprimer cet invité ?")) return;
        try {
            await apiClient.delete(`/api/guests/${id}`);
            fetchData();
        } catch (err) {
            alert("Erreur lors de la suppression.");
        }
    };

    const confirmedCount = guests.filter(g => g.rsvpStatus === 'confirmed').length;
    const pendingCount = guests.filter(g => g.rsvpStatus === 'pending').length;

    return (
        <PlanningLayout 
            title="Liste d'Invités" 
            description="Gérez vos invités, suivez les confirmations et organisez vos tables."
        >
            <Head>
                <title>Mes Invités — Farah.ma</title>
            </Head>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-8 rounded-[2.5rem] border border-[var(--color-charcoal-100)] shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)] mb-2">Total Invités</p>
                    <span className="text-3xl font-black text-[var(--color-primary)]">{guests.length}</span>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-[var(--color-charcoal-100)] shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)] mb-2">Confirmés</p>
                    <span className="text-3xl font-black text-green-600">{confirmedCount}</span>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-[var(--color-charcoal-100)] shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)] mb-2">En Attente</p>
                    <span className="text-3xl font-black text-[var(--color-accent)]">{pendingCount}</span>
                </div>
            </div>

            {/* Guest List */}
            <div className="bg-white rounded-[2.5rem] border border-[var(--color-charcoal-100)] overflow-hidden shadow-sm">
                <div className="px-10 py-8 border-b border-[var(--color-background)] flex items-center justify-between">
                    <h3 className="font-display font-black text-2xl text-[var(--color-primary)]">Liste des Invités</h3>
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                    >
                        + Nouvel Invité
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--color-background)]/50">
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)]">Nom complet</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)]">Côté</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)]">Statut RSVP</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)]">Repas</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-background)]">
                            {guests.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-10 py-20 text-center text-[var(--color-charcoal-400)] italic font-medium">
                                        Aucun invité enregistré.
                                    </td>
                                </tr>
                            )}
                            {guests.map((guest) => (
                                <tr key={guest.id} className="hover:bg-[var(--color-background)]/30 transition-colors group">
                                    <td className="px-10 py-6 font-bold text-[var(--color-primary)]">{guest.name}</td>
                                    <td className="px-10 py-6">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                            guest.side === 'bride' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {SIDE_LABELS[guest.side] || guest.side}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                            guest.rsvpStatus === 'confirmed' ? 'bg-green-100 text-green-700' : 
                                            guest.rsvpStatus === 'declined' ? 'bg-red-100 text-red-700' : 
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {RSVP_LABELS[guest.rsvpStatus] || guest.rsvpStatus}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-sm font-medium text-[var(--color-charcoal-500)] capitalize">{guest.mealPreference}</td>
                                    <td className="px-10 py-6 text-right">
                                        <button 
                                            onClick={() => handleDeleteGuest(guest.id)}
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
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-[var(--color-primary)]/40 backdrop-blur-md" onClick={() => setIsAdding(false)} />
                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in fade-in zoom-in duration-300 border border-[var(--color-accent)]/10">
                        <h3 className="font-display font-black text-2xl text-[var(--color-primary)] mb-8">Nouvel invité</h3>
                        <form onSubmit={handleAddGuest} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">Nom complet</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newGuest.name}
                                    onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                                    placeholder="Prénom et Nom"
                                    className="w-full bg-[var(--color-background)] border-0.5 border-[var(--color-charcoal-100)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent)] outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">Côté</label>
                                    <select 
                                        value={newGuest.side}
                                        onChange={(e) => setNewGuest({...newGuest, side: e.target.value})}
                                        className="w-full bg-[var(--color-background)] border-0.5 border-[var(--color-charcoal-100)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent)] outline-none transition-all appearance-none"
                                    >
                                        <option value="bride">{SIDE_LABELS.bride}</option>
                                        <option value="groom">{SIDE_LABELS.groom}</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">RSVP</label>
                                    <select 
                                        value={newGuest.rsvpStatus}
                                        onChange={(e) => setNewGuest({...newGuest, rsvpStatus: e.target.value})}
                                        className="w-full bg-[var(--color-background)] border-0.5 border-[var(--color-charcoal-100)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent)] outline-none transition-all appearance-none"
                                    >
                                        <option value="pending">{RSVP_LABELS.pending}</option>
                                        <option value="confirmed">{RSVP_LABELS.confirmed}</option>
                                        <option value="declined">{RSVP_LABELS.declined}</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">Préférence Repas</label>
                                <select 
                                    value={newGuest.mealPreference}
                                    onChange={(e) => setNewGuest({...newGuest, mealPreference: e.target.value})}
                                    className="w-full bg-[var(--color-background)] border-0.5 border-[var(--color-charcoal-100)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent)] outline-none transition-all appearance-none"
                                >
                                    <option value="standard">Standard</option>
                                    <option value="vegetarian">Végétarien</option>
                                    <option value="halal">Halal (Standard)</option>
                                    <option value="fish">Poisson</option>
                                </select>
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
