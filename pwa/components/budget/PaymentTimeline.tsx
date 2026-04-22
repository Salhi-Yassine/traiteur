import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { formatMAD } from "@/lib/utils";
import { Calendar, AlertCircle, CheckCircle2 } from "lucide-react";

export interface TimelineEvent {
    id: number | string;
    title: string;
    amount: number;
    dueDate: string;
    isOverdue?: boolean;
    isPaid?: boolean;
}

interface PaymentTimelineProps {
    events: TimelineEvent[];
}

export default function PaymentTimeline({ events }: PaymentTimelineProps) {
    const { t } = useTranslation("common");
    const { locale } = useRouter();

    if (!events || events.length === 0) return null;

    const sortedEvents = [...events].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    const upcomingEvents = sortedEvents.filter(e => !e.isPaid).slice(0, 3); // Show max 3 upcoming

    if (upcomingEvents.length === 0) return null;

    const next30DaysTotal = upcomingEvents.reduce((acc, e) => acc + e.amount, 0);

    return (
        <div className="bg-neutral-800 rounded-[2rem] p-6 md:p-8 text-white relative overflow-hidden mt-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-2 lg:w-1/3">
                    <div className="flex items-center gap-2 text-primary text-[11px] font-black uppercase tracking-widest">
                        <Calendar size={14} />
                        {t("budget.timeline.next_30_days", "PROCHAINS 30 JOURS")}
                    </div>
                    <p className="text-3xl font-display">
                        {formatMAD(next30DaysTotal, locale)}
                    </p>
                    <p className="text-white/50 text-sm font-medium">
                        {t("budget.timeline.upcoming_total_desc", "Total des paiements à venir")}
                    </p>
                </div>

                <div className="flex-1 flex gap-4 overflow-x-auto pb-2 snap-x">
                    {upcomingEvents.map((event) => {
                        const date = new Date(event.dueDate);
                        const isOverdue = event.isOverdue || date < new Date();
                        
                        return (
                            <div 
                                key={event.id}
                                className={`flex-shrink-0 w-64 p-4 rounded-2xl border bg-white/5 backdrop-blur-sm snap-start ${
                                    isOverdue ? "border-red-500/30" : "border-white/10"
                                }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                                        isOverdue ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white/70"
                                    }`}>
                                        {date.toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-FR", { day: 'numeric', month: 'short' })}
                                    </span>
                                    {isOverdue && <AlertCircle size={14} className="text-red-400" />}
                                </div>
                                <h5 className="font-bold text-[15px] mb-1 truncate" title={event.title}>
                                    {event.title}
                                </h5>
                                <p className="text-xl font-black text-white">
                                    {formatMAD(event.amount, locale)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
