import { useTranslation } from "next-i18next";
import Head from "next/head";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { Copy, MessageCircle, Check, Upload, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import { useRef } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import apiClient from "../../utils/apiClient";
import PlanningLayout from "../../components/layout/PlanningLayout";
import { Skeleton } from "../../components/ui/skeleton";

interface Guest {
    id: number;
    fullName: string;
    rsvpStatus: string;
    side: string;
    mealPreference: string;
    guestToken?: string;
    phone?: string;
    invitationSent?: boolean;
}

interface WeddingProfile {
    id: number;
    slug: string;
}

export default function InvitesPage() {
    const { t } = useTranslation("common");
    const queryClient = useQueryClient();
    const [isAdding, setIsAdding] = useState(false);
    const [newGuest, setNewGuest] = useState({
        fullName: "",
        phone: "",
        rsvpStatus: "pending",
        side: "bride",
        mealPreference: "standard",
    });
    const [copiedToken, setCopiedToken] = useState<string | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filtering State
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sideFilter, setSideFilter] = useState("all");

    const { data: profileData } = useQuery<any>({
        queryKey: ["weddingProfile"],
        queryFn: () => apiClient.get("/api/wedding_profiles?itemsPerPage=1"),
    });

    const profile: WeddingProfile | null = profileData?.["hydra:member"]?.[0] ?? null;
    const profileId = profile?.id ?? null;

    const { data: guestData } = useQuery<any>({
        queryKey: ["guests", profileId],
        queryFn: () => apiClient.get(`/api/guests?weddingProfile=${profileId}`),
        enabled: profileId !== null,
    });

    const guests: Guest[] = guestData?.["hydra:member"] ?? [];

    const filteredGuests = guests.filter((guest) => {
        const matchesSearch = guest.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || guest.rsvpStatus === statusFilter;
        const matchesSide = sideFilter === "all" || guest.side === sideFilter;
        return matchesSearch && matchesStatus && matchesSide;
    });

    const addMutation = useMutation({
        mutationFn: (data: { name: string; rsvpStatus: string; side: string; mealPreference: string; weddingProfile: string }) =>
            apiClient.post("/api/guests", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["guests", profileId] });
            setIsAdding(false);
            setNewGuest({ fullName: "", phone: "", rsvpStatus: "pending", side: "bride", mealPreference: "standard" });
            toast.success(t("invites.guest_added_success"));
        },
        onError: () => {
            toast.error(t("invites.error_add"));
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => apiClient.delete(`/api/guests/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["guests", profileId] });
            toast.success(t("invites.guest_deleted_success"));
        },
        onError: () => {
            toast.error(t("invites.error_delete"));
        }
    });

    const handleAddGuest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!profileId) return;
        addMutation.mutate({
            fullName: newGuest.fullName,
            phone: newGuest.phone || undefined,
            rsvpStatus: newGuest.rsvpStatus,
            side: newGuest.side,
            mealPreference: newGuest.mealPreference,
            weddingProfile: `/api/wedding_profiles/${profileId}`,
        } as any);
    };

    const handleDeleteGuest = (id: number) => {
        if (!window.confirm(t("invites.delete_confirm"))) return;
        deleteMutation.mutate(id);
    };

    const handleCopyLink = (token?: string) => {
        if (!token || !profile?.slug) return;
        const link = `${window.location.origin}/e/${profile.slug}?guest=${token}`;
        navigator.clipboard.writeText(link);
        setCopiedToken(token);
        toast.success(t("invites.link_copied_toast"), {
            description: t("invites.link_copied_desc"),
        });
        setTimeout(() => setCopiedToken(null), 2000);
    };

    const handleDownloadTemplate = () => {
        const csvContent = "Full Name,Phone,Side,Meal Preference\nJohn Doe,+212600000000,bride,standard\nJane Smith,,groom,vegetarian";
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "farah_guest_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        const loadingToast = toast.loading(t("invites.importing_guests"));

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const rows = results.data as any[];
                let successCount = 0;
                let errorCount = 0;

                for (const row of rows) {
                    try {
                        const fullName = row["Full Name"] || row["Name"] || row["Nom"];
                        if (!fullName) continue;

                        await apiClient.post("/api/guests", {
                            fullName,
                            phone: row["Phone"] || row["Telephone"] || undefined,
                            side: (row["Side"] || "bride").toLowerCase().includes("groom") ? "groom" : "bride",
                            mealPreference: (row["Meal Preference"] || "standard").toLowerCase(),
                            rsvpStatus: "pending",
                            weddingProfile: `/api/wedding_profiles/${profileId}`,
                        });
                        successCount++;
                    } catch (err) {
                        errorCount++;
                    }
                }

                setIsImporting(false);
                toast.dismiss(loadingToast);
                queryClient.invalidateQueries({ queryKey: ["guests", profileId] });

                if (successCount > 0) {
                    toast.success(t("invites.import_complete"), {
                        description: t("invites.import_complete_desc", { success: successCount, failed: errorCount }),
                    });
                } else if (errorCount > 0) {
                    toast.error(t("invites.import_failed"));
                }
                
                if (fileInputRef.current) fileInputRef.current.value = "";
            },
            error: () => {
                setIsImporting(false);
                toast.dismiss(loadingToast);
                toast.error(t("invites.error_parsing_csv"));
            }
        });
    };

    const handleWhatsApp = (guest: Guest) => {
        if (!guest.guestToken || !profile?.slug) return;
        const link = `${window.location.origin}/e/${profile.slug}?guest=${guest.guestToken}`;
        const name = guest.fullName.split(" ")[0] || "";
        const message = `Salam ${name} ! Nous sommes ravis de t'inviter à notre mariage. Voici ton lien VIP pour confirmer ta présence : ${link}`;
        
        let url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        if (guest.phone) {
            // Remove any non-numeric characters from phone
            const cleanPhone = guest.phone.replace(/\D/g, '');
            if (cleanPhone.length > 0) {
                url += `&phone=${cleanPhone}`;
            }
        }
        window.open(url, '_blank');
    };

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
                        <span className="text-3xl font-black">{guests.filter((g) => g.rsvpStatus === "confirmed").length}</span>
                        <span className="text-sm font-bold mb-1.5 opacity-60">{t("dashboard.guests_unit")}</span>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-[var(--color-charcoal-100)] shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)] mb-2">{t("invites.pending")}</p>
                    <div className="flex items-end gap-2 text-[var(--color-charcoal-400)]">
                        <span className="text-3xl font-black">{guests.filter((g) => g.rsvpStatus === "pending").length}</span>
                        <span className="text-sm font-bold mb-1.5 opacity-60">{t("dashboard.guests_unit")}</span>
                    </div>
                </div>
            </div>

            {/* Delete error */}
            {deleteMutation.isError && (
                <div className="mb-6 px-6 py-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold">
                    {t("invites.error_delete")}
                </div>
            )}

            {/* Guest List */}
            <div className="bg-white rounded-[2.5rem] border border-[var(--color-charcoal-100)] overflow-hidden shadow-sm">
                <div className="px-10 py-8 border-b border-[var(--color-background)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="font-display font-black text-2xl text-[var(--color-primary)]">{t("invites.list_title")}</h3>
                    <div className="flex flex-wrap items-center gap-3">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".csv"
                            onChange={handleFileUpload}
                        />
                        <Button
                            variant="outline"
                            onClick={handleDownloadTemplate}
                            className="border-[var(--color-charcoal-100)] text-[var(--color-charcoal-400)] px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-[var(--color-primary)] h-auto transition-all"
                        >
                            <Download className="w-3.5 h-3.5 me-2" />
                            {t("invites.download_template", "Template")}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleImportClick}
                            disabled={isImporting}
                            className="border-[var(--color-charcoal-100)] text-[var(--color-primary)] px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-background)] h-auto transition-all"
                        >
                            {isImporting ? <Loader2 className="w-3.5 h-3.5 me-2 animate-spin" /> : <Upload className="w-3.5 h-3.5 me-2" />}
                            {t("invites.import_csv", "Importer")}
                        </Button>
                        <Button
                            onClick={() => setIsAdding(true)}
                            className="bg-[var(--color-accent)] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-accent-light)] transition-all shadow-lg shadow-[var(--color-accent)]/20 h-auto"
                        >
                            + {t("invites.new_guest")}
                        </Button>
                    </div>
                </div>

                <div className="px-10 py-6 bg-[var(--color-background)]/30 border-b border-[var(--color-background)] flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[200px]">
                        <Input
                            placeholder={t("common.search")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-10 bg-white border-[var(--color-charcoal-100)] rounded-xl px-4 text-xs font-medium"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[160px] h-10 bg-white border-[var(--color-charcoal-100)] rounded-xl text-xs font-bold text-[var(--color-primary)]">
                            <SelectValue placeholder={t("invites.rsvp")} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="all">{t("common.all_categories", "Tous les statuts")}</SelectItem>
                            <SelectItem value="pending">{t("invites.rsvp_status.pending")}</SelectItem>
                            <SelectItem value="confirmed">{t("invites.rsvp_status.confirmed")}</SelectItem>
                            <SelectItem value="declined">{t("invites.rsvp_status.declined")}</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={sideFilter} onValueChange={setSideFilter}>
                        <SelectTrigger className="w-[160px] h-10 bg-white border-[var(--color-charcoal-100)] rounded-xl text-xs font-bold text-[var(--color-primary)]">
                            <SelectValue placeholder={t("invites.side")} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="all">{t("common.all_categories", "Tous les côtés")}</SelectItem>
                            <SelectItem value="bride">{t("invites.sides.bride")}</SelectItem>
                            <SelectItem value="groom">{t("invites.sides.groom")}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-start border-collapse">
                        <thead>
                            <tr className="bg-[var(--color-background)]/50 text-start">
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)]">{t("invites.full_name")}</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)]">{t("invites.side")}</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)]">{t("invites.rsvp")}</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)]">{t("invites.meal")}</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)]">{t("invites.share", "Partager")}</th>
                                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--color-charcoal-400)] text-end">{t("invites.actions")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-background)]">
                            {!guestData && (
                                <>
                                    {[...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-10 py-6"><Skeleton className="h-4 w-32" /></td>
                                            <td className="px-10 py-6"><Skeleton className="h-6 w-20 rounded-full" /></td>
                                            <td className="px-10 py-6"><Skeleton className="h-6 w-16 rounded-lg" /></td>
                                            <td className="px-10 py-6"><Skeleton className="h-4 w-24" /></td>
                                            <td className="px-10 py-6"><Skeleton className="h-8 w-16 rounded-lg" /></td>
                                            <td className="px-10 py-6 text-end"><Skeleton className="h-8 w-8 rounded-xl ms-auto" /></td>
                                        </tr>
                                    ))}
                                </>
                            )}
                            {guestData && filteredGuests.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-10 py-20 text-center text-[var(--color-charcoal-400)] italic font-medium">
                                        {searchTerm || statusFilter !== "all" || sideFilter !== "all" ? t("common.no_results") : t("invites.empty")}
                                    </td>
                                </tr>
                            )}
                            {guestData && filteredGuests.map((guest) => (
                                <tr key={guest.id} className="hover:bg-[var(--color-background)]/30 transition-colors group">
                                    <td className="px-10 py-6 font-bold text-[var(--color-primary)]">{guest.fullName}</td>
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
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleCopyLink(guest.guestToken)}
                                                className={`h-8 w-8 p-0 rounded-lg border-[var(--color-charcoal-100)] ${copiedToken === guest.guestToken ? 'text-green-600 bg-green-50' : 'text-[var(--color-charcoal-400)] hover:text-[var(--color-primary)]'}`}
                                                title="Copier le lien"
                                            >
                                                {copiedToken === guest.guestToken ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleWhatsApp(guest)}
                                                className="h-8 w-8 p-0 rounded-lg text-[#25D366] bg-[#25D366]/10 border-[#25D366]/20 hover:bg-[#25D366] hover:text-white transition-all shadow-sm shadow-[#25D366]/10"
                                                title="Envoyer via WhatsApp"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-end">
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

                        {addMutation.isError && (
                            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold">
                                {t("invites.error_add")}
                            </div>
                        )}

                        <form onSubmit={handleAddGuest} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
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
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">{t("invites.phone", "Téléphone (Optionnel)")}</Label>
                                    <Input
                                        type="tel"
                                        value={newGuest.phone}
                                        onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                                        placeholder="+212 ..."
                                        className="w-full h-auto bg-[var(--color-background)] border-0.5 border-[var(--color-charcoal-100)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-charcoal-400)]">{t("invites.side")}</Label>
                                    <Select
                                        value={newGuest.side}
                                        onValueChange={(val) => setNewGuest({...newGuest, side: val})}
                                    >
                                        <SelectTrigger className="w-full h-auto bg-[var(--color-background)] border-0.5 border-[var(--color-charcoal-100)] rounded-2xl px-6 py-4 text-sm font-bold text-[var(--color-primary)] focus:ring-[var(--color-accent)] outline-none transition-all">
                                            <SelectValue placeholder={t("common.confirm")} />
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
                                            <SelectValue placeholder={t("common.confirm")} />
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
                                        <SelectValue placeholder={t("common.confirm")} />
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
