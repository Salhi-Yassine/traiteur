import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetServerSideProps } from 'next';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/utils/apiClient';
import PlanningLayout from '@/components/layout/PlanningLayout';
import { HeroBanner } from '@/components/dashboard/HeroBanner';
import { StatsPillsRow } from '@/components/dashboard/StatsPillsRow';
import { QuickStatGrid } from '@/components/dashboard/QuickStatCards';
import { WallOfLove } from '@/components/dashboard/WallOfLove';
import { InspirationGallery } from '@/components/dashboard/InspirationGallery';
import { VendorDiscovery } from '@/components/dashboard/VendorDiscovery';
import { MilestoneCategories } from '@/components/dashboard/MilestoneCategories';
import { WeddingPlanWidget } from '@/components/dashboard/WeddingPlanWidget';
import { ConsensusMatch } from '@/components/dashboard/ConsensusMatch';
import { ViewModeSelector } from '@/components/dashboard/ViewModeSelector';
import { DemoBanner } from '@/components/dashboard/DemoBanner';
import { MOCK_PROFILE, MOCK_GREETINGS, MOCK_CONSENSUS } from '@/components/dashboard/mock';
import type { ViewMode, WeddingDashboardProfile, GreetingSummary } from '@/components/dashboard/types';
import type { HydraCollection } from '@/types/api';

// ─── Constants ────────────────────────────────────────────────────────────────

const VIEW_MODE_KEY = 'farah_dashboard_view_mode';
const VALID_MODES: ViewMode[] = ['full', 'planning', 'senior'];

// ─── API-specific type (not exported) ────────────────────────────────────────

interface GreetingRaw {
  id: number;
  message: string;
  photoUrl?: string;
  isAcknowledged: boolean;
  guest?: { fullName: string } | null;
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffH = Math.floor(diffMs / 3_600_000);
  if (diffH < 1) return '< 1h';
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}j`;
  return `${Math.floor(diffD / 7)} sem.`;
}

function computeDaysLeft(weddingDate?: string): number | null {
  if (!weddingDate) return null;
  return Math.max(
    0,
    Math.ceil((new Date(weddingDate).getTime() - Date.now()) / 86_400_000)
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WeddingDashboard() {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // ── View mode — persisted in localStorage ──────────────────────────────────
  const [viewMode, setViewMode] = useState<ViewMode>('full');

  useEffect(() => {
    const saved = localStorage.getItem(VIEW_MODE_KEY) as ViewMode | null;
    if (saved && VALID_MODES.includes(saved)) setViewMode(saved);
  }, []);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(VIEW_MODE_KEY, mode);
  };

  const isSenior = viewMode === 'senior';
  const isFull = viewMode === 'full';

  // ── Wedding profile ────────────────────────────────────────────────────────
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['weddingProfile'],
    queryFn: () =>
      apiClient.get<HydraCollection<WeddingDashboardProfile>>(
        '/api/wedding_profiles?itemsPerPage=1'
      ),
  });

  const wp: WeddingDashboardProfile | null =
    (profileData as HydraCollection<WeddingDashboardProfile> | undefined)?.['hydra:member']?.[0] ?? null;

  const dp = wp ?? MOCK_PROFILE;
  const isDemo = !profileLoading && !wp;

  // ── Greetings ──────────────────────────────────────────────────────────────
  const { data: greetingsData } = useQuery({
    queryKey: ['greetings', wp?.id],
    queryFn: () =>
      apiClient.get<HydraCollection<GreetingRaw>>(
        `/api/greetings?weddingProfile=${wp!.id}&order[createdAt]=desc&itemsPerPage=5`
      ),
    enabled: !!wp?.id,
  });

  const apiGreetings: GreetingSummary[] = (
    (greetingsData as HydraCollection<GreetingRaw> | undefined)?.['hydra:member'] ?? []
  ).map((g: GreetingRaw) => ({
    id: g.id,
    author: g.guest?.fullName ?? t('dashboard.couple.wall_of_love.anonymous'),
    message: g.message,
    avatar: g.photoUrl,
    isAcknowledged: g.isAcknowledged,
    timeAgo: formatTimeAgo(g.createdAt),
  }));

  const greetings: GreetingSummary[] = isDemo ? MOCK_GREETINGS : apiGreetings;

  // ── Pulse mutation ─────────────────────────────────────────────────────────
  const pulseMutation = useMutation({
    mutationFn: (id: number) =>
      apiClient.patch(`/api/greetings/${id}`, { isAcknowledged: true }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['greetings', wp?.id] }),
  });

  const handlePulse = (id: number) => {
    if (!isDemo) pulseMutation.mutate(id);
  };

  // ── Derived stats ──────────────────────────────────────────────────────────
  const budgetSpent = (dp.budgetItems ?? []).reduce(
    (acc, item) => acc + item.spentAmount,
    0
  );
  const budgetTotal = dp.totalBudgetMad ?? 0;
  const guestsCount = dp.guests?.length ?? 0;
  const tasksTotal = dp.checklistTasks?.length ?? 0;
  const tasksDone = (dp.checklistTasks ?? []).filter((t) => t.status === 'done').length;
  const tasksLeft = tasksTotal - tasksDone;
  const daysLeft = computeDaysLeft(dp.weddingDate);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <PlanningLayout
      title={t('dashboard.couple.welcome', { name: dp.brideName ?? user?.firstName })}
      description={t('dashboard.couple.subtitle')}
    >
      <Head>
        <title>{t('nav.dashboard')} — Farah.ma</title>
      </Head>

      <div className={cn('space-y-8 transition-all duration-500', isSenior && 'elder-mode')}>

        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {isDemo ? <DemoBanner /> : <div />}
          <ViewModeSelector value={viewMode} onChange={handleViewModeChange} />
        </div>

        {/* 1 — Hero */}
        <HeroBanner
          brideName={dp.brideName ?? user?.firstName ?? ''}
          groomName={dp.groomName ?? ''}
          weddingDate={dp.weddingDate}
          coverImageUrl={dp.coverImage}
          elderMode={isSenior}
        />

        {/* 2 — Stats pills (hidden in senior mode) */}
        {!isSenior && (
          <StatsPillsRow
            daysLeft={daysLeft}
            budgetTotal={budgetTotal}
            tasksLeft={tasksLeft}
            guestsCount={guestsCount}
          />
        )}

        {/* 3 — Quick stat cards */}
        <QuickStatGrid
          budgetSpent={budgetSpent}
          budgetTotal={budgetTotal}
          guestsCount={guestsCount}
          tasksDone={tasksDone}
          tasksTotal={tasksTotal}
          elderMode={isSenior}
        />

        {/* 4 — Magazine sections (full + planning modes only) */}
        {!isSenior && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left — discovery content */}
            <div className="lg:col-span-2 space-y-12">
              {isFull && <InspirationGallery />}
              {isFull && <VendorDiscovery />}
              {isFull && <MilestoneCategories />}
              {isFull && (
                <div className="p-6 sm:p-8 bg-white rounded-3xl border border-neutral-100 shadow-1">
                  <WallOfLove greetings={greetings} onPulse={handlePulse} />
                </div>
              )}
            </div>

            {/* Right — widgets */}
            <div className="lg:col-span-1 space-y-6">
              <WeddingPlanWidget
                tasks={dp.checklistTasks ?? []}
                isLoading={profileLoading}
                elderMode={false}
              />
              {isFull && (
                <ConsensusMatch
                  score={MOCK_CONSENSUS.score}
                  sharedStyles={MOCK_CONSENSUS.sharedStyles}
                />
              )}
            </div>
          </div>
        )}

        {/* Senior mode — plan widget full width */}
        {isSenior && (
          <WeddingPlanWidget
            tasks={dp.checklistTasks ?? []}
            isLoading={profileLoading}
            elderMode
          />
        )}

      </div>
    </PlanningLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'fr', ['common'])),
  },
});
