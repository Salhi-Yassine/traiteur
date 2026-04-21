import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { cn } from '@/lib/utils';

const LOCALES = [
  { code: 'fr',  label: 'FR' },
  { code: 'ary', label: 'دارجة' },
  { code: 'ar',  label: 'عربي' },
  { code: 'en',  label: 'EN' },
];

interface LanguageSwitcherProps {
  scrolled?: boolean;
  mobile?: boolean;
}

export default function LanguageSwitcher({ scrolled, mobile }: LanguageSwitcherProps) {
  const router = useRouter();
  const { asPath, query, locale: activeLocale } = router;

  const changeLanguage = (newLocale: string) => {
    router.push({ pathname: router.pathname, query }, asPath, { locale: newLocale });
  };

  if (mobile) {
    return (
      <div className="grid grid-cols-4 gap-2 mt-4 px-2">
        {LOCALES.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => changeLanguage(code)}
            className={cn(
              "py-2 text-[12px] font-bold rounded-xl transition-all border-2",
              activeLocale === code
                ? "bg-primary border-primary text-white"
                : "border-neutral-100 text-neutral-500 hover:border-neutral-200"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 bg-neutral-100/10 p-1 rounded-full border border-white/10">
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => changeLanguage(code)}
          className={cn(
            "px-2.5 py-1 text-[11px] font-bold rounded-full transition-all",
            activeLocale === code
              ? "bg-[#E8472A] text-white shadow-sm"
              : scrolled
                ? "text-[#484848] hover:bg-[#F7F7F7]"
                : "text-white/70 hover:bg-white/10 hover:text-white"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
