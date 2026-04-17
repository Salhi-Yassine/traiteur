import Link from "next/link";
import { useTranslation } from "next-i18next";
import { X } from "lucide-react";
import type { ReactNode } from "react";

interface AuthCardProps {
    /** Where the X close button links to. Defaults to "/" */
    closeHref?: string;
    /** i18n key for the X button aria-label. Defaults to "auth.back_home" */
    closeLabelKey?: string;
    children: ReactNode;
}

/**
 * Shared card shell for all auth pages.
 */
export function AuthCard({
    closeHref = "/",
    closeLabelKey = "auth.back_home",
    children,
}: AuthCardProps) {
    const { t } = useTranslation("common");

    return (
        <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center px-4 py-10">
            <div className="w-full max-w-[568px] bg-white rounded-xl shadow-3 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-500">

                {/* Header — Airbnb pattern: [X]  [Logo centered] */}
                <div className="relative flex items-center justify-center h-[64px] border-b border-neutral-200 px-6">
                    <Link
                        href={closeHref}
                        aria-label={t(closeLabelKey)}
                        className="absolute start-5 p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-900"
                    >
                        <X className="w-4 h-4" />
                    </Link>
                    <span className="font-display italic text-primary text-[18px] select-none">
                        Farah.ma
                    </span>
                </div>

                {/* Body */}
                <div className="px-8 py-8 md:px-10">
                    {children}
                </div>
            </div>
        </div>
    );
}

/**
 * Airbnb-style social login button (Google, Facebook, etc.)
 */
AuthCard.SocialButton = function SocialButton({
    href,
    onClick,
    children,
}: {
    href?: string;
    onClick?: () => void;
    children: React.ReactNode;
}) {
    const className = "w-full flex items-center justify-center gap-3 h-[52px] border border-neutral-300 rounded-xl bg-white text-[15px] font-bold text-neutral-900 hover:bg-neutral-100 hover:border-neutral-900 transition-all duration-200 active:scale-[0.98]";

    if (href) {
        return (
            <Link href={href} className={className}>
                {children}
            </Link>
        );
    }

    return (
        <button type="button" onClick={onClick} className={className}>
            {children}
        </button>
    );
};
