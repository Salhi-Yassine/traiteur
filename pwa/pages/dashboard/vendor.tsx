import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import { useQuery } from "@tanstack/react-query";
import {
    LayoutDashboard,
    User,
    MessageSquare,
    Settings,
    ExternalLink,
    Edit3,
    Share2,
    Clock,
    CheckCircle2,
    Eye,
    Star,
    ChevronRight,
    Camera,
    FileText,
    MapPin,
    Phone,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../utils/apiClient";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

// ── Avatar initials ───────────────────────────────────────────────────────────
function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    const sizes = { sm: "w-8 h-8 text-[12px]", md: "w-11 h-11 text-[15px]", lg: "w-16 h-16 text-[22px]" };
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

// ── Profile completion ring ───────────────────────────────────────────────────
function CompletionRing({ percent }: { percent: number }) {
    const r = 36;
    const circ = 2 * Math.PI * r;
    const offset = circ - (percent / 100) * circ;
    return (
        <svg width="88" height="88" viewBox="0 0 88 88" className="shrink-0 -rotate-90">
            <circle cx="44" cy="44" r={r} fill="none" stroke="#F4F4F4" strokeWidth="8" />
            <circle
                cx="44"
                cy="44"
                r={r}
                fill="none"
                stroke="#E8472A"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                className="transition-all duration-700"
            />
        </svg>
    );
}

// ── Completion suggestion row ─────────────────────────────────────────────────
function CompletionRow({
    icon,
    label,
    href,
    ctaLabel,
}: {
    icon: React.ReactNode;
    label: string;
    href: string;
    ctaLabel: string;
}) {
    return (
        <div className="flex items-center justify-between gap-3 py-3 border-t border-neutral-100">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {icon}
                </div>
                <span className="text-[13px] text-neutral-700">{label}</span>
            </div>
            <Link href={href}>
                <Button size="sm" variant="outline" className="shrink-0 h-8 text-[12px] rounded-lg">
                    {ctaLabel}
                </Button>
            </Link>
        </div>
    );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
    icon,
    label,
    value,
    sub,
    empty,
    emptyHint,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    sub?: string;
    empty?: boolean;
    emptyHint?: string;
}) {
    return (
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                {icon}
            </div>
            <div>
                <p className={cn("text-[28px] font-bold", empty ? "text-neutral-300" : "text-neutral-900")}>{value}</p>
                <p className="text-[13px] font-medium text-neutral-600">{label}</p>
                {empty && emptyHint ? (
                    <p className="text-[11px] text-neutral-400 mt-0.5">{emptyHint}</p>
                ) : sub ? (
                    <p className="text-[11px] text-neutral-400 mt-0.5">{sub}</p>
                ) : null}
            </div>
        </div>
    );
}

export default function VendorDashboardPage() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.replace("/auth/login");
        } else if (user.userType !== "vendor") {
            router.replace("/");
        }
    }, [user, authLoading, router]);

    const { data: vendorProfile } = useQuery({
        queryKey: ["vendorProfile", user?.vendorProfile?.id],
        queryFn: () => apiClient.get(`/api/vendor_profiles/${user!.vendorProfile!.id}`),
        enabled: !!user?.vendorProfile?.id,
    });

    const { data: inquiriesData } = useQuery({
        queryKey: ["recentInquiries", vendorProfile?.["@id"]],
        queryFn: () =>
            apiClient.get(
                `/api/quote_requests?vendorProfile=${encodeURIComponent(vendorProfile?.["@id"])}&itemsPerPage=5&order[id]=desc`,
            ),
        enabled: !!vendorProfile?.["@id"],
    });

    const inquiries = inquiriesData?.["hydra:member"] ?? [];

    if (authLoading || !user || user.userType !== "vendor") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const isPending = vendorProfile?.status === "pending" || (!vendorProfile && user.vendorProfile);
    const isApproved = vendorProfile?.status === "approved";
    const profileSlug = vendorProfile?.slug ?? "";

    // Profile completeness
    const completenessFields: [boolean, string, string][] = [
        [!!vendorProfile?.businessName,          "completion_add_description", "/onboarding/vendor"],
        [!!vendorProfile?.description,           "completion_add_description", "/onboarding/vendor"],
        [!!vendorProfile?.category,              "completion_add_category",    "/onboarding/vendor"],
        [vendorProfile?.cities?.length > 0,      "completion_add_cities",      "/onboarding/vendor"],
        [!!vendorProfile?.whatsapp,              "completion_add_whatsapp",    "/onboarding/vendor"],
        [!!vendorProfile?.coverImageUrl,         "completion_add_cover",       "/onboarding/vendor"],
        [!!vendorProfile?.priceRange,            "completion_add_price",       "/onboarding/vendor"],
    ];
    const completedCount = completenessFields.filter(([done]) => done).length;
    const completeness = Math.round((completedCount / completenessFields.length) * 100);

    // Top 3 incomplete suggestions
    const suggestions = completenessFields.filter(([done]) => !done).slice(0, 3);

    const suggestionIcons: Record<string, React.ReactNode> = {
        completion_add_cover:       <Camera className="w-4 h-4" />,
        completion_add_description: <FileText className="w-4 h-4" />,
        completion_add_category:    <Zap className="w-4 h-4" />,
        completion_add_cities:      <MapPin className="w-4 h-4" />,
        completion_add_whatsapp:    <Phone className="w-4 h-4" />,
        completion_add_price:       <Star className="w-4 h-4" />,
    };

    const fullName = `${user.firstName} ${user.lastName}`;

    return (
        <>
            <Head>
                <title>{t("dashboard.vendor.title")} — Farah.ma</title>
            </Head>
            <Navbar />

            <div className="min-h-screen bg-neutral-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                    <div className="flex gap-8">

                        {/* ── Sidebar ── */}
                        <aside className="hidden lg:flex flex-col gap-1 w-56 shrink-0">
                            {/* User card */}
                            <div className="flex items-center gap-3 px-4 py-3 mb-4">
                                <Avatar name={fullName} size="md" />
                                <div className="min-w-0">
                                    <p className="text-[14px] font-semibold text-neutral-900 truncate">{fullName}</p>
                                    <p className="text-[12px] text-neutral-500 truncate">
                                        {vendorProfile?.businessName ?? user.email}
                                    </p>
                                </div>
                            </div>
                            <SidebarLink href="/dashboard/vendor" icon={<LayoutDashboard className="w-5 h-5" />} label={t("dashboard.vendor.nav_dashboard")} active />
                            {profileSlug && (
                                <SidebarLink href={`/vendors/${profileSlug}`} icon={<User className="w-5 h-5" />} label={t("dashboard.vendor.nav_profile")} />
                            )}
                            <SidebarLink href="#" icon={<MessageSquare className="w-5 h-5" />} label={t("dashboard.vendor.nav_inquiries")} />
                            <SidebarLink href="/account/profile" icon={<Settings className="w-5 h-5" />} label={t("dashboard.vendor.nav_account")} />
                        </aside>

                        {/* ── Main content ── */}
                        <main className="flex-1 min-w-0 space-y-6">

                            {/* Status banners */}
                            {isPending && (
                                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-[14px] text-amber-800">
                                    <Clock className="w-5 h-5 mt-0.5 shrink-0 text-amber-500" />
                                    <div>
                                        <p className="font-semibold">{t("dashboard.vendor.pending_banner")}</p>
                                        <p className="text-[13px] text-amber-700 mt-0.5">
                                            {t("dashboard.vendor.pending_timeline")}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {isApproved && (
                                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl text-[14px] text-green-800">
                                    <CheckCircle2 className="w-5 h-5 shrink-0 text-green-500" />
                                    <p className="font-semibold">{t("dashboard.vendor.approved_banner")}</p>
                                </div>
                            )}
                            {isApproved && completeness < 40 && (
                                <div className="flex items-center gap-3 p-4 bg-[#FEF0ED] border border-[#E8472A]/20 rounded-2xl text-[14px] text-[#E8472A]">
                                    <Zap className="w-5 h-5 shrink-0" />
                                    <div>
                                        <p className="font-semibold">{t("dashboard.vendor.boost_banner")}</p>
                                        <p className="text-[13px] text-[#E8472A]/80 mt-0.5">
                                            {t("dashboard.vendor.boost_banner_sub")}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Hero card — welcome + completion ring */}
                            <div className="bg-white border border-neutral-200 rounded-2xl p-6">
                                <div className="flex items-start gap-6">
                                    {/* Completion ring */}
                                    <div className="relative shrink-0">
                                        <CompletionRing percent={completeness} />
                                        <span className="absolute inset-0 flex items-center justify-center text-[15px] font-bold text-neutral-900">
                                            {completeness}%
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-1">
                                            <div>
                                                <h1 className="text-[20px] font-bold text-neutral-900">
                                                    {t("dashboard.vendor.welcome", { name: user.firstName })}
                                                </h1>
                                                <p className="text-[13px] text-neutral-500 mt-0.5">
                                                    {t("dashboard.vendor.completion_title", { percent: completeness })}
                                                </p>
                                            </div>
                                            {isPending ? (
                                                <Badge variant="warning" className="shrink-0">
                                                    <Clock className="w-3 h-3 me-1" />
                                                    {t("dashboard.vendor.pending_badge")}
                                                </Badge>
                                            ) : isApproved ? (
                                                <Badge variant="verified" className="shrink-0">
                                                    <CheckCircle2 className="w-3 h-3 me-1" />
                                                    {t("dashboard.vendor.approved_badge")}
                                                </Badge>
                                            ) : null}
                                        </div>

                                        {/* Completion suggestions */}
                                        {suggestions.length > 0 && (
                                            <div>
                                                {suggestions.map(([, key, href]) => (
                                                    <CompletionRow
                                                        key={key}
                                                        icon={suggestionIcons[key]}
                                                        label={t(`dashboard.vendor.${key}`)}
                                                        href={href}
                                                        ctaLabel={t("dashboard.vendor.completion_cta")}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        {suggestions.length === 0 && (
                                            <p className="text-[13px] text-green-600 font-medium mt-3 flex items-center gap-1.5">
                                                <CheckCircle2 className="w-4 h-4" />
                                                {t("dashboard.vendor.profile_complete")}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <StatCard
                                    icon={<Eye className="w-5 h-5" />}
                                    label={t("dashboard.vendor.stats_views")}
                                    value="—"
                                    empty
                                    emptyHint={t("dashboard.vendor.stats_empty_hint")}
                                />
                                <StatCard
                                    icon={<MessageSquare className="w-5 h-5" />}
                                    label={t("dashboard.vendor.stats_inquiries")}
                                    value={String(inquiriesData?.["hydra:totalItems"] ?? "—")}
                                    empty={!inquiriesData?.["hydra:totalItems"]}
                                    emptyHint={!inquiriesData?.["hydra:totalItems"] ? t("dashboard.vendor.stats_empty_hint") : undefined}
                                    sub={t("dashboard.vendor.stats_period")}
                                />
                                <StatCard
                                    icon={<Star className="w-5 h-5" />}
                                    label={t("dashboard.vendor.stats_rating")}
                                    value={vendorProfile?.averageRating ? Number(vendorProfile.averageRating).toFixed(1) : "—"}
                                    empty={!vendorProfile?.averageRating}
                                    emptyHint={!vendorProfile?.averageRating ? t("dashboard.vendor.stats_empty_hint") : undefined}
                                    sub={vendorProfile?.reviewCount ? `${vendorProfile.reviewCount} avis` : undefined}
                                />
                            </div>

                            {/* Quick actions */}
                            <div className="bg-white border border-neutral-200 rounded-2xl p-6">
                                <h2 className="text-[15px] font-bold text-neutral-900 mb-4">
                                    {t("dashboard.vendor.quick_actions")}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <Link href="/onboarding/vendor">
                                        <Button variant="outline" className="w-full justify-start gap-2 h-12 rounded-xl">
                                            <Edit3 className="w-4 h-4" />
                                            {t("dashboard.vendor.edit_profile")}
                                        </Button>
                                    </Link>
                                    {profileSlug && (
                                        <Link href={`/vendors/${profileSlug}`} target="_blank">
                                            <Button variant="outline" className="w-full justify-start gap-2 h-12 rounded-xl">
                                                <ExternalLink className="w-4 h-4" />
                                                {t("dashboard.vendor.view_public")}
                                            </Button>
                                        </Link>
                                    )}
                                    {profileSlug && (
                                        <a
                                            href={`https://wa.me/?text=${encodeURIComponent(`Découvrez mon profil sur Farah.ma : ${typeof window !== "undefined" ? window.location.origin : ""}/vendors/${profileSlug}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button variant="whatsapp" className="w-full justify-start gap-2 h-12 rounded-xl">
                                                <Share2 className="w-4 h-4" />
                                                {t("dashboard.vendor.share_whatsapp")}
                                            </Button>
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Recent inquiries */}
                            <div className="bg-white border border-neutral-200 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-[15px] font-bold text-neutral-900">
                                        {t("dashboard.vendor.recent_inquiries")}
                                    </h2>
                                    <Link
                                        href="#"
                                        className="text-[13px] text-primary font-semibold hover:text-primary-dark flex items-center gap-1"
                                    >
                                        {t("dashboard.vendor.view_all_inquiries")}
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>

                                {inquiries.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                            <MessageSquare className="w-8 h-8 text-primary/40" />
                                        </div>
                                        <p className="text-[15px] font-semibold text-neutral-800 mb-1">
                                            {t("dashboard.vendor.no_inquiries")}
                                        </p>
                                        <p className="text-[13px] text-neutral-500 mb-5 max-w-xs">
                                            {t("dashboard.vendor.no_inquiries_sub")}
                                        </p>
                                        {profileSlug && (
                                            <a
                                                href={`https://wa.me/?text=${encodeURIComponent(`Découvrez mon profil sur Farah.ma : ${typeof window !== "undefined" ? window.location.origin : ""}/vendors/${profileSlug}`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button variant="whatsapp" size="sm" className="gap-2 rounded-xl">
                                                    <Share2 className="w-4 h-4" />
                                                    {t("dashboard.vendor.share_profile")}
                                                </Button>
                                            </a>
                                        )}
                                    </div>
                                ) : (
                                    <div className="divide-y divide-neutral-100">
                                        {inquiries.map((inq: any) => (
                                            <div key={inq.id} className="py-4 flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-[14px] font-semibold text-neutral-900">
                                                        {inq.client?.firstName} {inq.client?.lastName}
                                                    </p>
                                                    <p className="text-[12px] text-neutral-500 mt-0.5">
                                                        {inq.eventDate
                                                            ? new Date(inq.eventDate).toLocaleDateString("fr-FR")
                                                            : "—"}{" "}
                                                        · {inq.guestCount ?? "?"} invités
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant={
                                                        inq.status === "pending"
                                                            ? "warning"
                                                            : inq.status === "accepted"
                                                            ? "verified"
                                                            : "neutral"
                                                    }
                                                    className="shrink-0 capitalize"
                                                >
                                                    {inq.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

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
