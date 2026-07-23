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
import { WeddingHeroCard } from '@/components/dashboard/WeddingHeroCard';
import { QuickActionsBar } from '@/components/dashboard/QuickActionsBar';
import { ProgressTimeline } from '@/components/dashboard/ProgressTimeline';
import { BudgetCard, GuestsCard, ChecklistCard } from '@/components/dashboard/QuickStatCards';
import { InspirationGallery } from '@/components/dashboard/InspirationGallery';
import { VendorDiscovery } from '@/components/dashboard/VendorDiscovery';
import { MilestoneCategories } from '@/components/dashboard/MilestoneCategories';
import { WeddingPlanWidget } from '@/components/dashboard/WeddingPlanWidget';
import { DemoBanner } from '@/components/dashboard/DemoBanner';
import { MOCK_PROFILE } from '@/components/dashboard/mock';
import type {
  WeddingDashboardProfile,
  TimelineMilestone,
} from '@/components/dashboard/types';
import type { HydraCollection } from '@/types/api';
import { unwrapCollection } from '@/utils/hydra';


// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeDaysLeft(weddingDate?: string): number | null {
  if (!weddingDate) return null;
  return Math.max(0, Math.ceil((new Date(weddingDate).getTime() - Date.now()) / 86_400_000));
}

function inferVendorCategory(taskName: string): string | undefined {
  const n = taskName.toLowerCase();
  if (n.includes('salle') || n.includes('lieu')) return 'salle';
  if (n.includes('traiteur')) return 'traiteur';
  if (n.includes('photo') || n.includes('vidéo') || n.includes('video')) return 'photographe';
  if (n.includes('robe') || n.includes('costume') || n.includes('essayage')) return 'robe';
  if (n.includes('musique') || n.includes('dj') || n.includes('orchestre')) return 'musique';
  if (n.includes('déco') || n.includes('deco')) return 'decoration';
  if (n.includes('transport') || n.includes('voiture')) return 'transport';
  if (n.includes('faire-part') || n.includes('invitation')) return 'faire-part';
  return undefined;
}

function buildMilestones(tasks: WeddingDashboardProfile['checklistTasks']): TimelineMilestone[] {
  return (tasks ?? [])
    .filter((t) => t.status !== 'done')
    .sort((a, b) =>
      !a.dueDate ? 1 : !b.dueDate ? -1
        : new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
    .slice(0, 5)
    .map((t) => ({
      id: t.id,
      title: t.name,
      dueDate: t.dueDate ?? '',
      status: t.status,
      isOverdue: !!t.dueDate && new Date(t.dueDate) < new Date(),
      relatedVendorCategory: t.relatedVendorCategory ?? inferVendorCategory(t.name),
    }));
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WeddingDashboard() {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // ── Wedding profile ────────────────────────────────────────────────────────
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['weddingProfile'],
    queryFn: () =>
      apiClient.get<HydraCollection<WeddingDashboardProfile>>(
        '/api/wedding_profiles?itemsPerPage=1'
      ),
  });

  const wp: WeddingDashboardProfile | null =
    unwrapCollection<WeddingDashboardProfile>(profileData)[0] ?? null;

  const dp = wp ?? MOCK_PROFILE;
  const isDemo = !profileLoading && !wp;

  // ── Toggle task mutation ───────────────────────────────────────────────────
  const toggleTaskMutation = useMutation({
    mutationFn: (id: number) =>
      apiClient.patch(`/api/checklist_tasks/${id}`, { status: 'done' }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['weddingProfile'] }),
  });
  const handleToggleTask = (id: number) => { if (!isDemo) toggleTaskMutation.mutate(id); };

  // ── Derived stats ──────────────────────────────────────────────────────────
  const budgetSpent = (dp.budgetItems ?? []).reduce((acc, item) => acc + item.spentAmount, 0);
  const budgetTotal = dp.totalBudgetMad ?? 0;
  const guestsCount = dp.guests?.length ?? 0;
  const tasksTotal = dp.checklistTasks?.length ?? 0;
  const tasksDone = (dp.checklistTasks ?? []).filter((t) => t.status === 'done').length;
  const daysLeft = computeDaysLeft(dp.weddingDate);
  const completionPercent = tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 100) : 0;

  const milestones = buildMilestones(dp.checklistTasks);



  // ─────────────────────────────────────────────────────────────────────────

  return (
    <PlanningLayout
      title={t('dashboard.couple.welcome', { name: dp.brideName ?? user?.firstName })}
      description={t('dashboard.couple.subtitle')}
    >
      <Head>
        <title>{t('nav.dashboard')} — Farah.ma</title>
      </Head>

      <div className="space-y-6 transition-all duration-500">

        {/* Top bar — DemoBanner owns mode toggle */}
        <DemoBanner isDemo={isDemo} />

        {/* 1 — Hero */}
        <WeddingHeroCard
          brideName={dp.brideName ?? user?.firstName ?? ''}
          groomName={dp.groomName ?? ''}
          weddingDate={dp.weddingDate}
          weddingCity={dp.weddingCity}
          coverImageUrl={dp.coverImage}
          budgetTotal={budgetTotal}
          guestsCount={guestsCount}
          completionPercent={completionPercent}
          isDemo={isDemo}
        />

        {/* 2 — Quick actions */}
        <QuickActionsBar />

        {/* 3 — Progress timeline (only when tasks exist) */}
        {milestones.length > 0 && (
          <ProgressTimeline milestones={milestones} completionPercent={completionPercent} />
        )}

        {/* 4 — Summary Hub (Bento Box) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BudgetCard spent={budgetSpent} total={budgetTotal} />
          <GuestsCard count={guestsCount} />
          <ChecklistCard done={tasksDone} total={tasksTotal} />
        </div>

        {/* 5 — Planning & Discovery Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left — Main Focus: Task management & Categories */}
          <div className="xl:col-span-2 space-y-8">
            <WeddingPlanWidget
              tasks={dp.checklistTasks ?? []}
              isLoading={profileLoading}
              onToggleTask={handleToggleTask}
            />
            <MilestoneCategories />
          </div>

          {/* Right — Discovery & Inspiration */}
          <div className="xl:col-span-1 space-y-8">
            <InspirationGallery stylePersona={dp.stylePersona} isDemo={isDemo} />
            <VendorDiscovery weddingCity={dp.weddingCity} stylePersona={dp.stylePersona} />
          </div>
        </div>

      </div>
    </PlanningLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'fr', ['common'])),
  },
});
