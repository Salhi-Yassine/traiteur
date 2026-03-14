import { useTranslation } from "next-i18next";
import Head from "next/head";
import PlanningLayout from "../../components/layout/PlanningLayout";
import { useState, useEffect } from "react";
import apiClient from "../../utils/apiClient";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

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
    const { t } = useTranslation("common");
    const [guests, setGuests] = useState<Guest[]>([]);
    const [weddingProfileId, setWeddingProfileId] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newGuest, setNewGuest] = useState({ 
        fullName: "", 
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
            const response = await apiClient.post("/api/guests", {
                ...newGuest,
                name: newGuest.fullName,
                weddingProfile: `/api/wedding_profiles/${weddingProfileId}`,
            });
            setIsAdding(false);
            setNewGuest({ fullName: "", rsvpStatus: "pending", side: "bride", mealPreference: "standard" });
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
            title={t("invites.title")} 
            description={t("invites.description")}
        >
            <Head>
                <title>{t("nav.guests")} — Farah.ma</title>
            </Head>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-8 rounded-[2.5rem] border border-[var(--color-charcoal-100)] shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)] mb-2">{t("invites.total_guests")}</p>
                    <div className="flex items-end gap-2 text-[var(--color-primary)]">
                        <span className="text-3xl font-black">{guests.length}</span>
                        <span className="text-sm font-bold mb-1.5 opacity-60">{t("dashboard.guests_unit")}</span>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-[var(--color-charcoal-100)] shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)] mb-2">{t("invites.confirmed")}</p>
                    <div className="flex items-end gap-2 text-[var(--color-accent)]">
                        <span className="text-3xl font-black">{guests.filter(g => g.rsvpStatus === "confirmed").length}</span>
                        <span className="text-sm font-bold mb-1.5 opacity-60">{t("dashboard.guests_unit")}</span>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-[var(--color-charcoal-100)] shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)] mb-2">{t("invites.pending")}</p>
                    <div className="flex items-end gap-2 text-[var(--color-charcoal-400)]">
                        <span className="text-3xl font-black">{guests.filter(g => g.rsvpStatus === "pending").length}</span>
                        <span className="text-sm font-bold mb-1.5 opacity-60">{t("dashboard.guests_unit")}</span>
                    </div>
                </div>
            </div>

            {/* Guest List */}
            <div className="bg-white rounded-[2.5rem] border border-[var(--color-charcoal-100)] overflow-hidden shadow-sm">
                <div className="px-10 py-8 border-b border-[var(--color-background)] flex items-center justify-between">
                    <h3 className="font-display font-black text-2xl text-[var(--color-primary)]">{t("invites.list_title")}</h3>
                    <Button 
                        onClick={() => setIsAdding(true)}
                        className="bg-[var(--color-accent)] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[var(--color-accent-light)] transition-all shadow-lg shadow-[var(--color-accent)]/20 h-auto"
                    >
                        + {t("invites.new_guest")}
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--color-background)]/50 text-left">
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)]">{t("invites.full_name")}</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)]">{t("invites.side")}</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)]">{t("invites.rsvp")}</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)]">{t("invites.meal")}</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)] text-right">{t("invites.actions")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-background)]">
                            {guests.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-10 py-20 text-center text-[var(--color-charcoal-400)] italic font-medium">
                                        {t("invites.empty")}
                                    </td>
                                </tr>
                            )}
                            {guests.map((guest) => (
                                <tr key={guest.id} className="hover:bg-[var(--color-background)]/30 transition-colors group">
                                    <td className="px-10 py-6 font-bold text-[var(--color-primary)]">{guest.name}</td>
                                    <td className="px-10 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            guest.side === "bride" ? "bg-[var(--color-accent-light)]/10 text-[var(--color-accent)]" : "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                                        }`}>
                                            {t(`invites.sides.${guest.side}`)}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${
                                            guest.rsvpStatus === "confirmed" ? "bg-green-100 text-green-700" : 
                                            guest.rsvpStatus === "declined" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                                        }`}>
                                            {t(`invites.rsvp_status.${guest.rsvpStatus}`)}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-sm font-medium text-[var(--color-charcoal-500)] capitalize">
                                        {t(`invites.meals.${guest.mealPreference}`)}
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <Button 
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteGuest(guest.id)}
                                            className="text-[var(--color-charcoal-300)] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </Button>
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
                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl border border-[var(--color-accent)]/10 animate-in fade-in zoom-in duration-300">
                        <h3 className="font-display font-black text-2xl text-[var(--color-primary)] mb-8">{t("invites.new_guest_title")}</h3>
                        <form onSubmit={handleAddGuest} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">{t("invites.full_name")}</Label>
                                <Input 
                                    type="text" 
                                    required
                                    value={newGuest.fullName}
                                    onChange={(e) => setNewGuest({...newGuest, fullName: e.target.value})}
                                    placeholder={t("invites.name_placeholder")}
                                    className="w-full h-auto bg-[var(--color-background)] border-0.5 border-[var(--color-charcoal-100)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">{t("invites.side")}</Label>
                                    <Select 
                                        value={newGuest.side}
                                        onValueChange={(val) => setNewGuest({...newGuest, side: val})}
                                    >
                                        <SelectTrigger className="w-full h-auto bg-[var(--color-background)] border-0.5 border-[var(--color-charcoal-100)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-primary)] focus:ring-[var(--color-accent)] outline-none transition-all">
                                            <SelectValue placeholder="Sélectionnez" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bride">{t("invites.sides.bride")}</SelectItem>
                                            <SelectItem value="groom">{t("invites.sides.groom")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">{t("invites.rsvp")}</Label>
                                    <Select 
                                        value={newGuest.rsvpStatus}
                                        onValueChange={(val) => setNewGuest({...newGuest, rsvpStatus: val})}
                                    >
                                        <SelectTrigger className="w-full h-auto bg-[var(--color-background)] border-0.5 border-[var(--color-charcoal-100)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-primary)] focus:ring-[var(--color-accent)] outline-none transition-all">
                                            <SelectValue placeholder="Sélectionnez" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">{t("invites.rsvp_status.pending")}</SelectItem>
                                            <SelectItem value="confirmed">{t("invites.rsvp_status.confirmed")}</SelectItem>
                                            <SelectItem value="declined">{t("invites.rsvp_status.declined")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">{t("invites.meal_pref_label")}</Label>
                                <Select 
                                    value={newGuest.mealPreference}
                                    onValueChange={(val) => setNewGuest({...newGuest, mealPreference: val})}
                                >
                                    <SelectTrigger className="w-full h-auto bg-[var(--color-background)] border-0.5 border-[var(--color-charcoal-100)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-primary)] focus:ring-[var(--color-accent)] outline-none transition-all">
                                        <SelectValue placeholder="Sélectionnez" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="standard">{t("invites.meals.standard")}</SelectItem>
                                        <SelectItem value="vegetarian">{t("invites.meals.vegetarian")}</SelectItem>
                                        <SelectItem value="halal">{t("invites.meals.halal")}</SelectItem>
                                        <SelectItem value="fish">{t("invites.meals.fish")}</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                    className="flex-1 py-6 bg-[var(--color-accent)] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[var(--color-accent-light)] transition-all shadow-xl shadow-[var(--color-accent)]/20"
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
