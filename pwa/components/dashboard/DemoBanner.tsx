import { useTranslation } from 'next-i18next';

export function DemoBanner() {
  const { t } = useTranslation('common');

  return (
    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-4 py-2 rounded-full w-fit">
      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />
      {t('dashboard.couple.view_mode.demo_banner')}
    </div>
  );
}
