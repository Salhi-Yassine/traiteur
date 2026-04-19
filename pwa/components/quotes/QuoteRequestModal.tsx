"use client";
import { useEffect, useRef } from "react";
import { type Resolver, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslation } from "next-i18next";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import apiClient from "@/utils/apiClient";

interface QuoteRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    vendorProfileId: number;
    vendorName: string;
}

const EVENT_TYPE_KEYS = [
    "quote_modal.event_type_wedding",
    "quote_modal.event_type_engagement",
    "quote_modal.event_type_haqiqa",
    "quote_modal.event_type_henna",
    "quote_modal.event_type_reception",
    "quote_modal.event_type_other",
] as const;

export default function QuoteRequestModal({ isOpen, onClose, vendorProfileId, vendorName }: QuoteRequestModalProps) {
    const { t } = useTranslation("common");
    const overlayRef = useRef<HTMLDivElement>(null);

    const schema = z.object({
        eventType:  z.string().min(1, t("quote_modal.event_type_required")),
        eventDate:  z.string().min(1, t("quote_modal.date_required")).refine(
            (d) => new Date(d) > new Date(),
            t("quote_modal.date_future"),
        ),
        guestCount: z.coerce.number().min(1, t("quote_modal.guests_min")).max(10000, t("quote_modal.guests_max")),
        budget:     z.coerce.number().min(0).optional(),
        message:    z.string().min(10, t("quote_modal.message_min")).max(2000),
    });
    type FormValues = z.infer<typeof schema>;

    const { register, handleSubmit, control, watch, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(schema) as Resolver<FormValues>,
        defaultValues: { eventType: "", eventDate: "", guestCount: 50, budget: undefined, message: "" },
    });

    const messageLength = watch("message")?.length ?? 0;

    const onSubmit = async (values: FormValues) => {
        await apiClient.post("/api/quote_requests", {
            eventType:     values.eventType,
            eventDate:     values.eventDate,
            guestCount:    values.guestCount,
            budget:        values.budget ?? null,
            message:       values.message,
            vendorProfile: `/api/vendor_profiles/${vendorProfileId}`,
        });
        reset();
        onClose();
        toast.success(t("quote_modal.success"));
    };

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
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
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-xl animate-in fade-in duration-500" />

            <div className="relative bg-white rounded-[3rem] shadow-premium w-full max-w-2xl max-h-full overflow-y-auto border border-border/50 animate-in fade-in zoom-in-95 duration-500">
                <div className="absolute top-0 start-0 w-full h-32 bg-primary opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/moroccan-flower.png')]" />

                <div className="px-12 py-10 flex items-start justify-between relative z-10">
                    <div>
                        <span className="text-secondary font-black tracking-[0.4em] uppercase text-[10px] mb-2 block">
                            {t("quote_modal.header_label")}
                        </span>
                        <h2 id="modal-title" className="font-display font-black text-3xl text-primary leading-tight">
                            {t("quote_modal.header_title", { name: vendorName })}
                        </h2>
                        <p className="text-muted-foreground text-xs mt-2 font-medium">
                            {t("quote_modal.header_desc")}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 rounded-2xl bg-accent/5 text-primary/40 hover:bg-secondary/10 hover:text-secondary transition-all"
                        aria-label={t("common.close")}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="px-12 pb-12 space-y-10 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <Label htmlFor="eventType" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 ps-4">
                                {t("quote_modal.event_type_label")} <span className="text-secondary">*</span>
                            </Label>
                            <Controller
                                name="eventType"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger id="eventType" className="w-full bg-accent/5 border-2 border-transparent rounded-2xl px-6 py-6 text-xs font-black text-primary uppercase tracking-widest focus:border-secondary focus:bg-white outline-none transition-all h-auto">
                                            <SelectValue placeholder={t("quote_modal.event_type_placeholder")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {EVENT_TYPE_KEYS.map((key) => (
                                                <SelectItem key={key} value={t(key)}>{t(key)}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.eventType && <p className="text-secondary text-[10px] font-black uppercase tracking-tight ps-4">{errors.eventType.message}</p>}
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="eventDate" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 ps-4">
                                {t("quote_modal.date_label")} <span className="text-secondary">*</span>
                            </Label>
                            <Input
                                type="date"
                                id="eventDate"
                                {...register("eventDate")}
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full h-auto bg-accent/5 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-black text-primary uppercase tracking-widest focus:border-secondary focus:bg-white focus-visible:ring-0 outline-none transition-all"
                            />
                            {errors.eventDate && <p className="text-secondary text-[10px] font-black uppercase tracking-tight ps-4">{errors.eventDate.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <Label htmlFor="guestCount" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 ps-4">
                                {t("quote_modal.guests_label")} <span className="text-secondary">*</span>
                            </Label>
                            <Input type="number" id="guestCount" {...register("guestCount")} min="1" max="10000" className="w-full h-auto bg-accent/5 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-black text-primary transition-all focus:border-secondary focus:bg-white focus-visible:ring-0 outline-none" />
                            {errors.guestCount && <p className="text-secondary text-[10px] font-black uppercase tracking-tight ps-4">{errors.guestCount.message}</p>}
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="budget" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 ps-4">
                                {t("quote_modal.budget_label")}
                            </Label>
                            <Input type="number" id="budget" {...register("budget")} placeholder={t("quote_modal.budget_placeholder")} className="w-full h-auto bg-accent/5 border-2 border-transparent rounded-2xl px-6 py-4 text-xs font-black text-primary transition-all focus-visible:ring-0 focus:border-secondary focus:bg-white outline-none" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 ps-4">
                            {t("quote_modal.message_label")} <span className="text-secondary">*</span>
                        </Label>
                        <Textarea
                            id="message"
                            {...register("message")}
                            rows={4}
                            placeholder={t("quote_modal.message_placeholder")}
                            className="w-full bg-accent/5 border-2 border-transparent rounded-[2rem] px-8 py-6 text-sm font-medium text-primary resize-none transition-all focus:border-secondary focus:bg-white focus-visible:ring-0 outline-none leading-relaxed"
                        />
                        <div className="flex justify-between px-4">
                            {errors.message ? (
                                <p className="text-secondary text-[10px] font-black uppercase tracking-tight">{errors.message.message}</p>
                            ) : <span />}
                            <span className="text-[10px] font-black text-muted-foreground/60 tracking-widest">{messageLength}/2000</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 pt-6">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-2xl">
                            {t("common.cancel")}
                        </Button>
                        <Button type="submit" variant="default" disabled={isSubmitting} className="flex-1">
                            {isSubmitting ? t("quote_modal.submitting") : t("quote_modal.submit")}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
