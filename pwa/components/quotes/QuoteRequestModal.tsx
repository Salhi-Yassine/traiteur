"use client";
import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

interface QuoteRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    catererProfileId: number;
    catererName: string;
}

const EVENT_TYPES = ["Wedding", "Corporate", "Birthday", "Anniversary", "Graduation", "Other"];

const validationSchema = Yup.object({
    eventType: Yup.string().required("Please select an event type"),
    eventDate: Yup.date().min(new Date(), "Event date must be in the future").required("Event date is required"),
    guestCount: Yup.number().min(1, "At least 1 guest").max(10000, "Max 10,000 guests").required("Guest count is required"),
    budget: Yup.number().min(0).nullable(),
    message: Yup.string().min(10, "Message must be at least 10 characters").max(2000).required("Please describe your event"),
});

export default function QuoteRequestModal({
    isOpen,
    onClose,
    catererProfileId,
    catererName,
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
                        catererProfile: `/api/caterer_profiles/${catererProfileId}`,
                    }),
                });
                if (!res.ok) throw new Error("Failed to submit");
                helpers.resetForm();
                onClose();
                // In a real app: show success toast
                alert("✅ Quote request sent successfully! The caterer will be in touch.");
            } catch {
                alert("Something went wrong. Please try again.");
            } finally {
                helpers.setSubmitting(false);
            }
        },
    });

    // Close on ESC
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    // Prevent body scroll
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
            aria-modal="true"
            role="dialog"
            aria-labelledby="modal-title"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="px-6 py-5 border-b border-[var(--color-sand-200)] flex items-start justify-between">
                    <div>
                        <h2 id="modal-title" className="font-display font-semibold text-xl text-[var(--color-charcoal-900)]">
                            Request a Quote
                        </h2>
                        <p className="text-sm text-[var(--color-charcoal-500)] mt-0.5">
                            from <span className="font-medium text-[var(--color-teal-700)]">{catererName}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-[var(--color-charcoal-400)] hover:bg-[var(--color-sand-100)] transition-colors -mr-1"
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={formik.handleSubmit} className="px-6 py-5 space-y-4">
                    {/* Event type */}
                    <div>
                        <label htmlFor="eventType" className="block text-sm font-medium text-[var(--color-charcoal-700)] mb-1.5">
                            Event Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="eventType"
                            {...formik.getFieldProps("eventType")}
                            className="w-full border border-[var(--color-sand-200)] rounded-xl px-4 py-2.5 text-sm text-[var(--color-charcoal-900)] focus:ring-2 focus:ring-[var(--color-teal-500)] focus:border-transparent outline-none"
                        >
                            <option value="">Select event type…</option>
                            {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        {formik.touched.eventType && formik.errors.eventType && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.eventType}</p>
                        )}
                    </div>

                    {/* Date + Guests row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="eventDate" className="block text-sm font-medium text-[var(--color-charcoal-700)] mb-1.5">
                                Event Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                id="eventDate"
                                {...formik.getFieldProps("eventDate")}
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full border border-[var(--color-sand-200)] rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-teal-500)] focus:border-transparent outline-none"
                            />
                            {formik.touched.eventDate && formik.errors.eventDate && (
                                <p className="text-red-500 text-xs mt-1">{String(formik.errors.eventDate)}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="guestCount" className="block text-sm font-medium text-[var(--color-charcoal-700)] mb-1.5">
                                Guests <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="guestCount"
                                {...formik.getFieldProps("guestCount")}
                                min="1"
                                max="10000"
                                className="w-full border border-[var(--color-sand-200)] rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-teal-500)] focus:border-transparent outline-none"
                            />
                            {formik.touched.guestCount && formik.errors.guestCount && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.guestCount}</p>
                            )}
                        </div>
                    </div>

                    {/* Budget */}
                    <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-[var(--color-charcoal-700)] mb-1.5">
                            Approximate Budget (DZD) <span className="text-[var(--color-charcoal-400)] font-normal">— optional</span>
                        </label>
                        <input
                            type="number"
                            id="budget"
                            {...formik.getFieldProps("budget")}
                            placeholder="e.g. 500000"
                            className="w-full border border-[var(--color-sand-200)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-teal-500)] focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-[var(--color-charcoal-700)] mb-1.5">
                            Tell us about your event <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="message"
                            {...formik.getFieldProps("message")}
                            rows={4}
                            placeholder="Describe your event, any dietary requirements, preferred service style, and anything else the caterer should know…"
                            className="w-full border border-[var(--color-sand-200)] rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-[var(--color-teal-500)] focus:border-transparent outline-none"
                        />
                        <div className="flex justify-between mt-1">
                            {formik.touched.message && formik.errors.message ? (
                                <p className="text-red-500 text-xs">{formik.errors.message}</p>
                            ) : <span />}
                            <span className="text-xs text-[var(--color-charcoal-400)]">
                                {formik.values.message.length}/2000
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-[var(--color-sand-200)] rounded-xl text-sm font-medium text-[var(--color-charcoal-700)] hover:bg-[var(--color-sand-50)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="flex-1 py-3 bg-[var(--color-teal-700)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--color-teal-800)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {formik.isSubmitting ? "Sending…" : "Send Request"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
