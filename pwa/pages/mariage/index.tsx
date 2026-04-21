import { useTranslation } from "next-i18next";
import Head from "next/head";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { GetServerSideProps } from "next";
import PlanningLayout from "@/components/layout/PlanningLayout";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/utils/apiClient";
import { cn } from "@/lib/utils";
import { ConsensusMatch } from "@/components/dashboard/ConsensusMatch";
import { WallOfLove } from "@/components/dashboard/WallOfLove";
import { HeroBanner } from "@/components/dashboard/HeroBanner";
import { StatsPillsRow } from "@/components/dashboard/StatsPillsRow";
import { InspirationGallery } from "@/components/dashboard/InspirationGallery";
import { VendorDiscovery } from "@/components/dashboard/VendorDiscovery";
import { MilestoneCategories } from "@/components/dashboard/MilestoneCategories";
import { WeddingPlanWidget } from "@/components/dashboard/WeddingPlanWidget";

// ─── View mode ───────────────────────────────────────────────────────────────

type ViewMode = "full" | "planning" | "senior";
const VIEW_MODE_KEY = "farah_dashboard_view_mode";

// ─── Mock data (shown when the API is unavailable or user is not logged in) ──

const FUTURE_DATE = new Date(Date.now() + 87 * 86_400_000).toISOString().split("T")[0];

const MOCK_PROFILE = {
  id: 0,
  brideName: "Yasmine",
  groomName: "Yassine",
  weddingDate: FUTURE_DATE,
  coverImage: undefined as string | undefined,
  totalBudgetMad: 120_000,
  stylePersona: "Élégant",
  quizResults: null as Record<string, unknown> | null,
  budgetItems: [{ spentAmount: 42_000 }, { spentAmount: 18_500 }],
  guests: Array.from({ length: 48 }),
  checklistTasks: [
    { id: 1, name: "Réserver la salle de réception", status: "done" as const, dueDate: "2026-03-01" },
    { id: 2, name: "Choisir le traiteur", status: "done" as const, dueDate: "2026-03-15" },
    { id: 3, name: "Envoyer les faire-parts", status: "in_progress" as const, dueDate: "2026-05-01" },
    { id: 4, name: "Confirmer le photographe", status: "todo" as const, dueDate: "2026-05-10" },
    { id: 5, name: "Essayage de la robe", status: "todo" as const, dueDate: "2026-06-01" },
    { id: 6, name: "Choisir le DJ", status: "todo" as const, dueDate: "2026-06-15" },
    { id: 7, name: "Organiser le transport", status: "todo" as const, dueDate: "2026-07-01" },
  ],
};

const MOCK_GREETINGS = [
  {
    id: 1,
    author: "Fatima Zahra",
    message: "Toutes nos félicitations ! Que votre union soit bénie et pleine de bonheur. 🤍",
    isAcknowledged: false,
    timeAgo: "2h",
  },
  {
    id: 2,
    author: "Hassan & Khadija",
    message: "Vous allez former un couple magnifique. On est tellement heureux pour vous !",
    isAcknowledged: true,
    timeAgo: "1j",
  },
  {
    id: 3,
    author: "Invité anonyme",
    message: "Bonne chance pour la préparation du grand jour ! On sera là pour vous soutenir.",
    isAcknowledged: false,
    timeAgo: "3j",
  },
];

// ─── Local types ─────────────────────────────────────────────────────────────

interface BudgetItemSummary {
  spentAmount: number;
}

interface ChecklistTaskSummary {
  id: number;
  name: string;
  status: "todo" | "in_progress" | "done";
  dueDate?: string;
}

interface GreetingRaw {
  id: number;
  message: string;
  photoUrl?: string;
  isAcknowledged: boolean;
  guest?: { fullName: string } | null;
  createdAt: string;
}

interface WeddingProfileDashboard {
  id?: number;
  "@id"?: string;
  brideName?: string;
  groomName?: string;
  weddingDate?: string;
  coverImage?: string;
  totalBudgetMad?: number;
  stylePersona?: string;
  quizResults?: Record<string, unknown> | null;
  ourStory?: string;
  galleryImages?: string[];
  budgetItems?: BudgetItemSummary[];
  guests?: unknown[];
  checklistTasks?: ChecklistTaskSummary[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTimeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffH = Math.floor(diffMs / 3_600_000);
  if (diffH < 1) return "< 1h";
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}j`;
  return `${Math.floor(diffD / 7)} sem.`;
}

function computeConsensusScore(quizResults: Record<string, unknown> | null | undefined): number {
  if (!quizResults) return 75;
  const p1 = quizResults["partner1"] as Record<string, unknown> | undefined;
  const p2 = quizResults["partner2"] as Record<string, unknown> | undefined;
  if (!p1 || !p2) return 75;
  const keys = Object.keys(p1);
  if (keys.length === 0) return 75;
  const matches = keys.filter((k) => p1[k] === p2[k]).length;
  return Math.round((matches / keys.length) * 100);
}

function computeSharedStyles(
  quizResults: Record<string, unknown> | null | undefined,
  stylePersona: string | undefined
): string[] {
  if (!quizResults) return stylePersona ? [stylePersona] : ["Élégant", "Traditionnel"];
  const p1 = quizResults["partner1"] as Record<string, unknown> | undefined;
  const p2 = quizResults["partner2"] as Record<string, unknown> | undefined;
  if (!p1 || !p2) return stylePersona ? [stylePersona] : [];
  const shared = Object.keys(p1)
    .filter((k) => p1[k] === p2[k] && typeof p1[k] === "string")
    .map((k) => p1[k] as string);
  return Array.from(new Set(shared)).slice(0, 4);
}

// ─── View Mode Selector ───────────────────────────────────────────────────────

interface ViewModeSelectorProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  t: (key: string) => string;
}

function ViewModeSelector({ value, onChange, t }: ViewModeSelectorProps) {
  const modes: ViewMode[] = ["full", "planning", "senior"];
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider me-1">
        {t("dashboard.couple.view_mode.label")}
      </span>
      <div className="flex bg-neutral-100 rounded-full p-1 gap-1">
        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
              value === mode
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            {t(`dashboard.couple.view_mode.${mode}`)}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Page component ──────────────────────────────────────────────────────────

export default function WeddingDashboard() {
  const { t } = useTranslation("common");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [viewMode, setViewMode] = useState<ViewMode>("full");

  // Persist view mode in localStorage
  useEffect(() => {
    const saved = localStorage.getItem(VIEW_MODE_KEY) as ViewMode | null;
    if (saved && ["full", "planning", "senior"].includes(saved)) {
      setViewMode(saved);
    }
  }, []);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(VIEW_MODE_KEY, mode);
  };

  const isSenior = viewMode === "senior";

  // ── Profile query ──────────────────────────────────────────────────────────
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["weddingProfile"],
    queryFn: () => apiClient.get("/api/wedding_profiles?itemsPerPage=1"),
  });

  const wp: WeddingProfileDashboard | null =
    (profileData as any)?.["hydra:member"]?.[0] ?? null;

  // Use mock data when API hasn't returned real data
  const dp = wp ?? MOCK_PROFILE;
  const isDemo = !profileLoading && !wp;

  // ── Greetings query ────────────────────────────────────────────────────────
  const { data: greetingsData } = useQuery({
    queryKey: ["greetings", wp?.id],
    queryFn: () =>
      apiClient.get(
        `/api/greetings?weddingProfile=${wp!.id}&order[createdAt]=desc&itemsPerPage=5`
      ),
    enabled: !!wp?.id,
  });

  // ── Derived stats ──────────────────────────────────────────────────────────
  const budgetSpent = (dp.budgetItems ?? []).reduce(
    (acc, item) => acc + item.spentAmount,
    0
  );
  const budgetTotal = dp.totalBudgetMad ?? 0;
  const budgetPercent =
    budgetTotal > 0 ? (budgetSpent / budgetTotal) * 100 : 0;
  const guestsCount = dp.guests?.length ?? 0;
  const tasksTotal = dp.checklistTasks?.length ?? 0;
  const tasksDone = (dp.checklistTasks ?? []).filter(
    (task) => task.status === "done"
  ).length;
  const tasksPercent =
    tasksTotal > 0 ? (tasksDone / tasksTotal) * 100 : 0;
  const tasksLeft = tasksTotal - tasksDone;

  const daysLeft = dp.weddingDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(dp.weddingDate).getTime() - Date.now()) / 86_400_000
        )
      )
    : null;

  const consensusScore = computeConsensusScore(dp.quizResults);
  const sharedStyles = computeSharedStyles(dp.quizResults, dp.stylePersona);

  // ── Greetings mapping ──────────────────────────────────────────────────────
  const apiGreetings = ((greetingsData as any)?.["hydra:member"] ?? []).map(
    (g: GreetingRaw) => ({
      id: g.id,
      author: g.guest?.fullName ?? t("dashboard.couple.wall_of_love.anonymous"),
      message: g.message,
      avatar: g.photoUrl,
      isAcknowledged: g.isAcknowledged,
      timeAgo: formatTimeAgo(g.createdAt),
    })
  );

  const greetings = isDemo ? MOCK_GREETINGS : apiGreetings;

  // ── Pulse mutation ─────────────────────────────────────────────────────────
  const pulseMutation = useMutation({
    mutationFn: (id: number) =>
      apiClient.patch(`/api/greetings/${id}`, { isAcknowledged: true }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["greetings", wp?.id] }),
  });

  const handlePulse = (id: number) => {
    if (!isDemo) pulseMutation.mutate(id);
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <PlanningLayout
      title={t("dashboard.couple.welcome", {
        name: dp.brideName ?? user?.firstName,
      })}
      description={t("dashboard.couple.subtitle")}
    >
      <Head>
        <title>{t("nav.dashboard")} — Farah.ma</title>
      </Head>

      <div className={cn("space-y-10 transition-all duration-500", isSenior && "elder-mode")}>

        {/* Top bar: demo banner + mode selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {isDemo ? (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              {t("dashboard.couple.view_mode.demo_banner")}
            </div>
          ) : (
            <div />
          )}
          <ViewModeSelector
            value={viewMode}
            onChange={handleViewModeChange}
            t={t}
          />
        </div>

        {/* 1. Hero Banner */}
        <HeroBanner
          brideName={dp.brideName ?? user?.firstName ?? ""}
          groomName={dp.groomName ?? ""}
          weddingDate={dp.weddingDate}
          coverImageUrl={dp.coverImage}
          elderMode={isSenior}
        />

        {/* 2. Stats Pills — hidden in senior mode */}
        {!isSenior && (
          <StatsPillsRow
            daysLeft={daysLeft}
            budgetTotal={budgetTotal}
            tasksLeft={tasksLeft}
            guestsCount={guestsCount}
          />
        )}

        {/* 3. Quick-nav stat cards — always shown */}
        <div className={cn(
          "grid gap-6",
          isSenior
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        )}>
          {/* Budget Card */}
          <Link href="/mariage/budget" className="group p-8 md:p-10 bg-white rounded-[2.5rem] border border-neutral-100 hover:shadow-3 transition-all duration-500 overflow-hidden relative">
            <div className="absolute top-0 end-0 p-8 opacity-5 group-hover:scale-110 transition-transform text-primary">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#FEF0ED] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full">{t("dashboard.couple.manage")}</span>
            </div>
            <h3 className={cn("font-display font-bold text-neutral-900 mb-2", isSenior ? "text-4xl" : "text-3xl")}>{t("nav.budget")}</h3>
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                <span className={cn("font-black text-neutral-900", isSenior ? "text-5xl" : "text-4xl")}>{budgetSpent.toLocaleString()}</span>
                <span className="text-[15px] font-bold text-[#717171] mb-2">/ {budgetTotal.toLocaleString()} MAD</span>
              </div>
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-1000 shadow-lg shadow-primary/20" style={{ width: `${Math.min(budgetPercent, 100)}%` }} />
              </div>
            </div>
          </Link>

          {/* Guests Card */}
          <Link href="/mariage/invites" className="group p-8 md:p-10 bg-white rounded-[2.5rem] border border-neutral-100 hover:shadow-3 transition-all duration-500 overflow-hidden relative">
            <div className="absolute top-0 end-0 p-8 opacity-5 group-hover:scale-110 transition-transform text-primary">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#FEF0ED] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-full">{t("dashboard.couple.list")}</span>
            </div>
            <h3 className={cn("font-display font-bold text-neutral-900 mb-2", isSenior ? "text-4xl" : "text-3xl")}>{t("nav.guests")}</h3>
            <div className="flex items-end gap-3">
              <span className={cn("font-black text-neutral-900", isSenior ? "text-5xl" : "text-4xl")}>{guestsCount}</span>
              <span className="text-[15px] font-bold text-[#717171] mb-2">{t("dashboard.couple.guests_unit")}</span>
            </div>
          </Link>

          {/* Checklist Card */}
          <Link href="/mariage/checklist" className="group p-8 md:p-10 bg-white rounded-[2.5rem] border border-neutral-100 hover:shadow-3 transition-all duration-500 overflow-hidden relative">
            <div className="absolute top-0 end-0 p-8 opacity-5 group-hover:scale-110 transition-transform text-neutral-900">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900 group-hover:bg-neutral-900 group-hover:text-white transition-all shadow-sm">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">{t("dashboard.couple.tasks")}</span>
            </div>
            <h3 className={cn("font-display font-bold text-neutral-900 mb-2", isSenior ? "text-4xl" : "text-3xl")}>{t("nav.checklist")}</h3>
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                <span className={cn("font-black text-neutral-900", isSenior ? "text-5xl" : "text-4xl")}>{tasksDone}</span>
                <span className="text-[15px] font-bold text-[#717171] mb-2">/ {t("dashboard.couple.tasks_done", { count: tasksTotal })}</span>
              </div>
              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-neutral-900 transition-all duration-1000" style={{ width: `${Math.min(tasksPercent, 100)}%` }} />
              </div>
            </div>
          </Link>

          {/* Wedding Website Card */}
          <Link href="/mariage/site" className={cn(
            "group p-8 md:p-10 bg-neutral-900 text-white rounded-[2.5rem] border border-neutral-800 hover:shadow-2xl transition-all duration-500 relative overflow-hidden",
            isSenior ? "sm:col-span-2" : "md:col-span-2 lg:col-span-3"
          )}>
            <div className="absolute top-0 end-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
              <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9c1.657 0 3 1.343 3 3s-1.343 3-3 3m0-6c-1.657 0-3 1.343-3 3s1.343 3 3 3m-3-7V7m0 0l-1 1m1-1l1 1m0 0v2" />
              </svg>
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t("dashboard.couple.website")}</span>
                </div>
                <h3 className={cn("font-display font-bold mb-1", isSenior ? "text-4xl" : "text-3xl")}>{t("dashboard.couple.my_website")}</h3>
                <p className="text-neutral-400 text-[15px] leading-relaxed">{t("dashboard.couple.website_desc")}</p>
              </div>
            </div>
          </Link>
        </div>

        {/* 4. Magazine sections (full + planning modes) */}
        {viewMode !== "senior" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left column */}
            <div className="lg:col-span-2 space-y-12">
              {viewMode === "full" && <InspirationGallery />}
              {viewMode === "full" && <VendorDiscovery />}
              {viewMode === "full" && <MilestoneCategories />}

              {/* Wall of Love — full mode only */}
              {viewMode === "full" && (
                <div className="p-8 bg-white rounded-[--radius-2xl] border border-neutral-100 shadow-1">
                  <WallOfLove greetings={greetings} onPulse={handlePulse} />
                </div>
              )}
            </div>

            {/* Right column — widgets */}
            <div className="lg:col-span-1 space-y-8">
              <WeddingPlanWidget
                tasks={dp.checklistTasks ?? []}
                isLoading={profileLoading}
                elderMode={false}
              />
              {viewMode === "full" && (
                <ConsensusMatch
                  score={consensusScore}
                  sharedStyles={sharedStyles}
                />
              )}
            </div>
          </div>
        )}

        {/* Senior mode: WeddingPlanWidget full width, no progress bar */}
        {viewMode === "senior" && (
          <WeddingPlanWidget
            tasks={dp.checklistTasks ?? []}
            isLoading={profileLoading}
            elderMode={true}
          />
        )}

        {/* 5. Expert Tip — always shown */}
        <div className="bg-white rounded-[3rem] p-12 md:p-16 border border-neutral-100 relative overflow-hidden shadow-2">
          <div className="absolute top-0 end-0 w-80 h-80 bg-primary/5 rounded-full -me-40 -mt-40 blur-3xl opacity-50" />
          <h4 className="text-primary text-[11px] font-black uppercase tracking-[0.4em] mb-6">{t("dashboard.couple.expert_tip")}</h4>
          <p className={cn(
            "font-display text-neutral-900 leading-[1.3] italic max-w-3xl relative z-10",
            isSenior ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"
          )}>
            &ldquo;{t("dashboard.couple.tip_content")}&rdquo;
          </p>
          <div className="mt-10 flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <span className={cn("font-bold text-neutral-500", isSenior ? "text-base" : "text-sm")}>{t("dashboard.couple.tip_author")}</span>
          </div>
        </div>

      </div>
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
