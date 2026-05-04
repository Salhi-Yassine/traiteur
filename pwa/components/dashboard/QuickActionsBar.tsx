import Link from 'next/link';
import { UserPlus, Banknote, ExternalLink } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { cn } from '@/lib/utils';

interface QuickActionsBarProps {
  websiteUrl?: string;
  className?: string;
}

export function QuickActionsBar({ websiteUrl, className }: QuickActionsBarProps) {
  const { t } = useTranslation('common');

  return (
    <div className={cn('flex gap-3 overflow-x-auto scrollbar-hide snap-x pb-1', className)}>
      <Link
        href="/mariage/invites"
        className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-200 bg-white text-sm font-bold text-neutral-700 card-hover whitespace-nowrap"
      >
        <UserPlus className="w-4 h-4 shrink-0" />
        {t('dashboard.couple.quick_actions.add_guest')}
      </Link>

      <Link
        href="/mariage/budget"
        className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-200 bg-white text-sm font-bold text-neutral-700 card-hover whitespace-nowrap"
      >
        <Banknote className="w-4 h-4 shrink-0" />
        {t('dashboard.couple.quick_actions.update_budget')}
      </Link>

      <Link
        href={websiteUrl ?? '/mariage/site'}
        className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white text-sm font-bold card-hover whitespace-nowrap"
      >
        <ExternalLink className="w-4 h-4 shrink-0" />
        {t('dashboard.couple.quick_actions.view_site')}
      </Link>
    </div>
  );
}
