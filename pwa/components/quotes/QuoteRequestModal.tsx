"use client";
import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface QuoteRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    vendorProfileId: number;
    vendorName: string;
}

const EVENT_TYPES = [
    "Mariage",
    "Fiançailles",
    "Sbouâ (Haqiqa)",
    "Henné",
    "Réception",
    "Autre",
];

const validationSchema = Yup.object({
    eventType: Yup.string().required("Veuillez choisir un type d'événement"),
    eventDate: Yup.date().min(new Date(), "La date doit être dans le futur").required("La date est requise"),
    guestCount: Yup.number().min(1, "Minimum 1 invité").max(10000, "Maximum 10,000").required("Le nombre d'invités est requis"),
    budget: Yup.number().min(0, "Le budget ne peut pas être négatif").nullable(),
    message: Yup.string().min(10, "Le message est trop court").max(2000).required("Veuillez décrire votre événement"),
});

export default function QuoteRequestModal({
    isOpen,
    onClose,
    vendorProfileId,
    vendorName,
}: QuoteRequestModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    const formik = useFormik({
        initialValues: {
            eventType: "",
            eventDate: "",
            guestCount: 50,
            budget: "",
            message: "",
        },
        validationSchema,
        onSubmit: async (values, helpers) => {
            try {
                const res = await fetch("/api/quote_requests", {
                    method: "POST",
                    headers: { "Content-Type": "application/ld+json" },
                    body: JSON.stringify({
                        eventType: values.eventType,
                        eventDate: values.eventDate,
                        guestCount: Number(values.guestCount),
                        budget: values.budget ? Number(values.budget) : null,
                        message: values.message,
                        vendorProfile: `/api/vendor_profiles/${vendorProfileId}`,
                    }),
                });
                if (!res.ok) throw new Error("Failed to submit");
                helpers.resetForm();
                onClose();
                // We'll replace this with a better toast/notif later
                alert("✅ Votre demande de devis a été envoyée avec succès !");
            } catch {
                alert("Une erreur est survenue. Veuillez réessayer.");
            } finally {
                helpers.setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10"
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
            aria-modal="true"
            role="dialog"
            aria-labelledby="modal-title"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-xl animate-in fade-in duration-500" />

            {/* Modal */}
            <div className="relative bg-white rounded-[3rem] shadow-premium w-full max-w-2xl max-h-full overflow-y-auto border border-border/50 animate-in fade-in zoom-in-95 duration-500">
                {/* Decorative Pattern */}
                <div className="absolute top-0 left-0 w-full h-32 bg-primary opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/moroccan-flower.png')]" />

                {/* Header */}
                <div className="px-12 py-10 flex items-start justify-between relative z-10">
                    <div>
                        <span className="text-secondary font-black tracking-[0.4em] uppercase text-[10px] mb-2 block">
                            Demande de Devis
                        </span>
                        <h2 id="modal-title" className="font-display font-black text-3xl text-primary leading-tight">
                            Réserver {vendorName}
                        </h2>
                        <p className="text-muted-foreground text-xs mt-2 font-medium">
                            Remplissez ce formulaire d'intention pour recevoir une proposition sur mesure.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 rounded-2xl bg-accent/5 text-primary/40 hover:bg-secondary/10 hover:text-secondary transition-all"
                        aria-label="Fermer"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={formik.handleSubmit} className="px-12 pb-12 space-y-10 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Event type */}
                        <div className="space-y-3">
                            <label htmlFor="eventType" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 pl-4">
                                Type d'Événement <span className="text-secondary">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    id="eventType"
                                    {...formik.getFieldProps("eventType")}
                                    className="w-full bg-accent/5 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-black text-primary uppercase tracking-widest focus:border-secondary focus:bg-white outline-none appearance-none cursor-pointer transition-all"
                                >
                                    <option value="">Sélectionnez…</option>
                                    {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {formik.touched.eventType && formik.errors.eventType && (
                                <p className="text-secondary text-[10px] font-black uppercase tracking-tight pl-4">{formik.errors.eventType}</p>
                            )}
                        </div>

                        {/* Date */}
                        <div className="space-y-3">
                            <label htmlFor="eventDate" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 pl-4">
                                Date Souhaitée <span className="text-secondary">*</span>
                            </label>
                            <input
                                type="date"
                                id="eventDate"
                                {...formik.getFieldProps("eventDate")}
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full bg-accent/5 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-black text-primary uppercase tracking-widest focus:border-secondary focus:bg-white outline-none transition-all"
                            />
                            {formik.touched.eventDate && formik.errors.eventDate && (
                                <p className="text-secondary text-[10px] font-black uppercase tracking-tight pl-4">{String(formik.errors.eventDate)}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Guests */}
                        <div className="space-y-3">
                            <label htmlFor="guestCount" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 pl-4">
                                Nombre d'Invités <span className="text-secondary">*</span>
                            </label>
                            <input
                                type="number"
                                id="guestCount"
                                {...formik.getFieldProps("guestCount")}
                                min="1"
                                max="10000"
                                className="w-full bg-accent/5 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-black text-primary transition-all focus:border-secondary focus:bg-white outline-none"
                            />
                            {formik.touched.guestCount && formik.errors.guestCount && (
                                <p className="text-secondary text-[10px] font-black uppercase tracking-tight pl-4">{formik.errors.guestCount}</p>
                            )}
                        </div>

                        {/* Budget */}
                        <div className="space-y-3">
                            <label htmlFor="budget" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 pl-4">
                                Budget Estimé (MAD)
                            </label>
                            <input
                                type="number"
                                id="budget"
                                {...formik.getFieldProps("budget")}
                                placeholder="ex: 80 000"
                                className="w-full bg-accent/5 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-black text-primary transition-all focus:border-secondary focus:bg-white outline-none"
                            />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-3">
                        <label htmlFor="message" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 pl-4">
                            Vos Précisions <span className="text-secondary">*</span>
                        </label>
                        <textarea
                            id="message"
                            {...formik.getFieldProps("message")}
                            rows={4}
                            placeholder="Thème du mariage, prestations souhaitées, questions particulières..."
                            className="w-full bg-accent/5 border-2 border-transparent rounded-[2rem] px-8 py-6 text-sm font-medium text-primary resize-none transition-all focus:border-secondary focus:bg-white outline-none leading-relaxed"
                        />
                        <div className="flex justify-between px-4">
                            {formik.touched.message && formik.errors.message ? (
                                <p className="text-secondary text-[10px] font-black uppercase tracking-tight">{formik.errors.message}</p>
                            ) : <span />}
                            <span className="text-[10px] font-black text-muted-foreground/60 tracking-widest">
                                {formik.values.message.length}/2000
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-6 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 rounded-2xl"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            variant="premium"
                            disabled={formik.isSubmitting}
                            className="flex-1"
                        >
                            {formik.isSubmitting ? "Envoi en cours..." : "Transmettre ma Demande"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
