import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    LayoutDashboard,
    User,
    MessageSquare,
    Settings,
    ChevronDown,
    ChevronUp,
    Calendar,
    Users,
    Wallet,
    CheckCircle2,
    XCircle,
    Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../utils/apiClient";
import { PATHS } from "../../constants/paths";
import type { QuoteRequest, VendorProfile as VendorProfileType, HydraCollection } from "../../types/api";
import { unwrapCollection } from "../../utils/hydra";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

type StatusFilter = "all" | "pending" | "accepted" | "declined";

// ── Avatar initials ───────────────────────────────────────────────────────────
function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    const sizes = { sm: "w-8 h-8 text-[12px]", md: "w-10 h-10 text-[14px]" };
    return (
        <div className={cn("rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0", sizes[size])}>
            {initials}
        </div>
    );
}

// ── Sidebar nav item ──────────────────────────────────────────────────────────
function SidebarLink({
    href,
    icon,
    label,
    active,
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
    active?: boolean;
}) {
    return (
        <Link
            href={href}
            className={cn(
                "relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all",
                active
                    ? "bg-primary/10 text-primary"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
            )}
        >
            {active && (
                <span className="absolute start-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-e-full" />
            )}
            <span className="w-5 h-5 shrink-0">{icon}</span>
            {label}
        </Link>
    );
}

// ── Status badge helper ───────────────────────────────────────────────────────
function statusVariant(status: QuoteRequest["status"]): "warning" | "verified" | "neutral" {
    if (status === "pending") return "warning";
    if (status === "accepted") return "verified";
    return "neutral";
}

// ── Inquiry card ─────────────────────────────────────────────────────────────
function InquiryCard({
    inq,
    vendorBusinessName,
    onAccept,
    onDecline,
    isUpdating,
}: {
    inq: QuoteRequest;
    vendorBusinessName: string;
    onAccept: (id: number) => void;
    onDecline: (id: number) => void;
    isUpdating: boolean;
}) {
    const { t, i18n } = useTranslation("common");
    const [expanded, setExpanded] = useState(false);

    const clientName = `${inq.client?.firstName ?? ""} ${inq.client?.lastName ?? ""}`.trim();
    const eventDateFormatted = inq.eventDate
        ? new Date(inq.eventDate).toLocaleDateString(i18n.language === "ar" || i18n.language === "ary" ? "ar-MA" : "fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : "—";

    const whatsappText = encodeURIComponent(
        `Bonjour ${inq.client?.firstName ?? ""}, je suis ${vendorBusinessName} sur Farah.ma. ` +
            `J'ai bien reçu votre demande de devis${inq.eventDate ? ` pour le ${eventDateFormatted}` : ""}. ` +
            `Je serais ravi(e) d'échanger avec vous !`,
    );

    return (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
            {/* Card header */}
            <div className="p-5">
                <div className="flex items-start gap-4">
                    <Avatar name={clientName || "?"} />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[15px] font-semibold text-neutral-900">{clientName || "—"}</p>
                                <p className="text-[12px] text-neutral-500 mt-0.5">
                                    {new Date(inq.createdAt).toLocaleDateString(
                                        i18n.language === "ar" || i18n.language === "ary" ? "ar-MA" : "fr-FR",
                                    )}
                                </p>
                            </div>
                            <Badge variant={statusVariant(inq.status)} className="shrink-0 capitalize">
                                {t(`inquiries.status_${inq.status}`)}
                            </Badge>
                        </div>

                        {/* Meta row */}
                        <div className="flex flex-wrap gap-4 mt-3">
                            {inq.eventDate && (
                                <span className="flex items-center gap-1.5 text-[12px] text-neutral-600">
                                    <Calendar className="w-3.5 h-3.5 text-primary/60" />
                                    {eventDateFormatted}
                                </span>
                            )}
                            {inq.guestCount != null && (
                                <span className="flex items-center gap-1.5 text-[12px] text-neutral-600">
                                    <Users className="w-3.5 h-3.5 text-primary/60" />
                                    {t("inquiries.guest_count", { count: inq.guestCount })}
                                </span>
                            )}
                            {inq.budget && (
                                <span className="flex items-center gap-1.5 text-[12px] text-neutral-600">
                                    <Wallet className="w-3.5 h-3.5 text-primary/60" />
                                    {inq.budget}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Expand toggle */}
                <button
                    onClick={() => setExpanded((v) => !v)}
                    className="mt-3 flex items-center gap-1 text-[12px] text-primary font-medium hover:text-primary-dark"
                >
                    {expanded ? (
                        <>
                            {t("inquiries.collapse")}
                            <ChevronUp className="w-3.5 h-3.5" />
                        </>
                    ) : (
                        <>
                            {t("inquiries.expand")}
                            <ChevronDown className="w-3.5 h-3.5" />
                        </>
                    )}
                </button>
            </div>

            {/* Expanded message */}
            {expanded && (
                <div className="border-t border-neutral-100 px-5 py-4 bg-neutral-50/60">
                    {inq.eventType && (
                        <div className="mb-3">
                            <p className="text-[11px] text-neutral-400 uppercase tracking-wider font-medium mb-0.5">
                                {t("inquiries.event_type")}
                            </p>
                            <p className="text-[13px] text-neutral-700 capitalize">{inq.eventType}</p>
                        </div>
                    )}
                    <div>
                        <p className="text-[11px] text-neutral-400 uppercase tracking-wider font-medium mb-0.5">
                            {t("inquiries.message")}
                        </p>
                        <p className="text-[13px] text-neutral-700 leading-relaxed whitespace-pre-wrap">{inq.message}</p>
                    </div>
                </div>
            )}

            {/* Action footer */}
            <div className="border-t border-neutral-100 px-5 py-3 flex flex-wrap items-center gap-2 bg-white">
                <a
                    href={`https://wa.me/?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0"
                >
                    <Button variant="whatsapp" size="sm" className="gap-1.5 rounded-xl h-8 text-[12px]">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {t("inquiries.reply_whatsapp")}
                    </Button>
                </a>

                {inq.status === "pending" && (
                    <>
                        <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 rounded-xl h-8 text-[12px] border-green-200 text-green-700 hover:bg-green-50"
                            onClick={() => onAccept(inq.id)}
                            disabled={isUpdating}
                        >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {t("inquiries.accept")}
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 rounded-xl h-8 text-[12px] border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => onDecline(inq.id)}
                            disabled={isUpdating}
                        >
                            <XCircle className="w-3.5 h-3.5" />
                            {t("inquiries.decline")}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function InquiriesPage() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const queryClient = useQueryClient();
    const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.replace(PATHS.AUTH_LOGIN);
        } else if (user.userType !== "vendor") {
            router.replace(PATHS.HOME);
        }
    }, [user, authLoading, router]);

    const { data: vendorProfile } = useQuery<VendorProfileType>({
        queryKey: ["vendorProfile", user?.vendorProfile?.id],
        queryFn: () => apiClient.get(`/api/vendor_profiles/${user!.vendorProfile!.id}`),
        enabled: !!user?.vendorProfile?.id,
    });

    const { data: inquiriesData, isLoading } = useQuery<HydraCollection<QuoteRequest>>({
        queryKey: ["allInquiries", vendorProfile?.["@id"]],
        queryFn: () =>
            apiClient.get(
                `/api/quote_requests?vendorProfile=${encodeURIComponent(vendorProfile?.["@id"] ?? "")}&order[createdAt]=desc&itemsPerPage=100`,
            ),
        enabled: !!vendorProfile?.["@id"],
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: "accepted" | "declined" }) =>
            apiClient.patch(`/api/quote_requests/${id}`, { status }),
        onSuccess: (_, { status }) => {
            void queryClient.invalidateQueries({ queryKey: ["allInquiries"] });
            void queryClient.invalidateQueries({ queryKey: ["recentInquiries"] });
            toast.success(
                status === "accepted" ? t("inquiries.accepted_toast") : t("inquiries.declined_toast"),
            );
        },
        onError: () => toast.error(t("inquiries.error_update")),
    });

    if (authLoading || !user || user.userType !== "vendor") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const allInquiries: QuoteRequest[] = unwrapCollection<QuoteRequest>(inquiriesData);

    const counts: Record<StatusFilter, number> = {
        all: allInquiries.length,
        pending: allInquiries.filter((i) => i.status === "pending").length,
        accepted: allInquiries.filter((i) => i.status === "accepted").length,
        declined: allInquiries.filter((i) => i.status === "declined").length,
    };

    const filtered =
        activeFilter === "all" ? allInquiries : allInquiries.filter((i) => i.status === activeFilter);

    const fullName = `${user.firstName} ${user.lastName}`;
    const profileSlug = vendorProfile?.slug ?? "";
    const businessName = vendorProfile?.businessName ?? fullName;

    const tabs: { key: StatusFilter; label: string; icon: React.ReactNode }[] = [
        { key: "all",      label: t("inquiries.tab_all"),     icon: <MessageSquare className="w-3.5 h-3.5" /> },
        { key: "pending",  label: t("inquiries.tab_pending"), icon: <Clock className="w-3.5 h-3.5" /> },
        { key: "accepted", label: t("inquiries.tab_accepted"),icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
        { key: "declined", label: t("inquiries.tab_declined"),icon: <XCircle className="w-3.5 h-3.5" /> },
    ];

    return (
        <>
            <Head>
                <title>{t("inquiries.title")} — Farah.ma</title>
            </Head>
            <Navbar />

            <div className="min-h-screen bg-neutral-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                    <div className="flex gap-8">

                        {/* ── Sidebar ── */}
                        <aside className="hidden lg:flex flex-col gap-1 w-56 shrink-0">
                            <div className="flex items-center gap-3 px-4 py-3 mb-4">
                                <div className="w-11 h-11 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[15px]">
                                    {fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[14px] font-semibold text-neutral-900 truncate">{fullName}</p>
                                    <p className="text-[12px] text-neutral-500 truncate">
                                        {vendorProfile?.businessName ?? user.email}
                                    </p>
                                </div>
                            </div>
                            <SidebarLink href={PATHS.DASHBOARD_VENDOR} icon={<LayoutDashboard className="w-5 h-5" />} label={t("dashboard.vendor.nav_dashboard")} />
                            {profileSlug && (
                                <SidebarLink href={`/vendors/${profileSlug}`} icon={<User className="w-5 h-5" />} label={t("dashboard.vendor.nav_profile")} />
                            )}
                            <SidebarLink href={PATHS.DASHBOARD_INQUIRIES} icon={<MessageSquare className="w-5 h-5" />} label={t("dashboard.vendor.nav_inquiries")} active />
                            <SidebarLink href="/account/profile" icon={<Settings className="w-5 h-5" />} label={t("dashboard.vendor.nav_account")} />
                        </aside>

                        {/* ── Main content ── */}
                        <main className="flex-1 min-w-0 space-y-6">

                            {/* Page header */}
                            <div>
                                <h1 className="text-[22px] font-bold text-neutral-900">{t("inquiries.title")}</h1>
                                <p className="text-[13px] text-neutral-500 mt-0.5">
                                    {t("inquiries.subtitle", { count: counts.all })}
                                </p>
                            </div>

                            {/* Filter tabs */}
                            <div className="flex flex-wrap gap-2">
                                {tabs.map(({ key, label, icon }) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveFilter(key)}
                                        className={cn(
                                            "flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium transition-all border",
                                            activeFilter === key
                                                ? "bg-primary text-white border-primary"
                                                : "bg-white text-neutral-600 border-neutral-200 hover:border-primary/40 hover:text-neutral-900",
                                        )}
                                    >
                                        {icon}
                                        {label}
                                        {counts[key] > 0 && (
                                            <span
                                                className={cn(
                                                    "ms-1 inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold",
                                                    activeFilter === key
                                                        ? "bg-white/20 text-white"
                                                        : "bg-neutral-100 text-neutral-600",
                                                )}
                                            >
                                                {counts[key]}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Inquiry list */}
                            {isLoading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-neutral-200 rounded-2xl">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                        <MessageSquare className="w-8 h-8 text-primary/40" />
                                    </div>
                                    <p className="text-[15px] font-semibold text-neutral-800 mb-1">
                                        {t("inquiries.empty_title")}
                                    </p>
                                    <p className="text-[13px] text-neutral-500 max-w-xs">
                                        {activeFilter === "all"
                                            ? t("inquiries.empty_sub")
                                            : t("inquiries.empty_filtered")}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filtered.map((inq) => (
                                        <InquiryCard
                                            key={inq.id}
                                            inq={inq}
                                            vendorBusinessName={businessName}
                                            onAccept={(id) => updateStatusMutation.mutate({ id, status: "accepted" })}
                                            onDecline={(id) => updateStatusMutation.mutate({ id, status: "declined" })}
                                            isUpdating={updateStatusMutation.isPending}
                                        />
                                    ))}
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale || "fr", ["common"])),
    },
});
