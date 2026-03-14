import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "next-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

// v3.0 nav items per PRD section 7
const NAV_ITEM_KEYS = [
    { labelKey: "nav.vendors", href: "/vendors" },
    { labelKey: "nav.inspiration",  href: "/inspiration" },
    { labelKey: "nav.real_weddings", href: "/real-weddings" },
];

// v3.0 Navbar — white-first, terracotta CTA, Airbnb style
export default function Navbar() {
    const { user, logout, isLoading } = useAuth();
    const [scrolled, setScrolled]   = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { t } = useTranslation("common");

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 80);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close drawer on ESC
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 inset-x-0 z-50 transition-all duration-300",
                    scrolled
                        ? "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] py-3"
                        : "bg-transparent py-5"
                )}
            >
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center justify-between gap-8">

                        {/* ── Logo ── */}
                        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                            {/* Star mark */}
                            <div className="w-9 h-9 rounded-xl bg-[#E8472A] flex items-center justify-center transition-transform group-hover:scale-105">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
                                    {/* Eight-pointed star mark */}
                                    <path d="M12 2l2.4 6.6H21l-5.4 4 2.1 6.4-5.7-4.1-5.7 4.1 2.1-6.4L3 8.6h6.6z" />
                                </svg>
                            </div>
                            <span className={cn(
                                "font-display font-semibold text-[20px] tracking-tight transition-colors",
                                scrolled ? "text-[#1A1A1A]" : "text-white"
                            )}>
                                Farah<span className="text-[#E8472A]">.ma</span>
                            </span>
                        </Link>

                        {/* ── Desktop Nav ── */}
                        <nav className="hidden lg:flex items-center gap-8" aria-label="Navigation principale">
                            {NAV_ITEM_KEYS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "nav-link text-[14px] font-medium transition-colors py-1",
                                        scrolled
                                            ? "text-[#484848] hover:text-[#1A1A1A]"
                                            : "text-white/85 hover:text-white"
                                    )}
                                >
                                    {t(item.labelKey)}
                                </Link>
                            ))}
                        </nav>

                        {/* ── Desktop CTAs ── */}
                        <div className="hidden lg:flex items-center gap-3 shrink-0">
                            <LanguageSwitcher scrolled={scrolled} />

                            <div className="w-px h-6 bg-current opacity-10 mx-1" />

                            {isLoading ? (
                                <div className="w-20 h-8 bg-white/10 animate-pulse rounded-lg" />
                            ) : user ? (
                                <div className="flex items-center gap-3">
                                    <span className={cn(
                                        "text-[14px] font-medium",
                                        scrolled ? "text-[#484848]" : "text-white/85"
                                    )}>
                                        {user.firstName}
                                    </span>
                                    <button
                                        onClick={logout}
                                        className={cn(
                                            "text-[13px] transition-colors underline underline-offset-2",
                                            scrolled ? "text-[#717171] hover:text-[#1A1A1A]" : "text-white/60 hover:text-white"
                                        )}
                                    >
                                        {t('nav.logout', 'Déconnexion')}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/login"
                                        className={cn(
                                            "text-[14px] font-medium transition-colors px-3 py-2 rounded-lg hover:bg-white/10",
                                            scrolled ? "text-[#484848] hover:bg-[#F7F7F7]" : "text-white/85"
                                        )}
                                    >
                                        {t("nav.login")}
                                    </Link>
                                    <Button variant="default" size="sm" asChild>
                                        <Link href="/auth/register">{t("nav.start")}</Link>
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* ── Mobile: hamburger ── */}
                        <button
                            className={cn(
                                "lg:hidden p-2 rounded-lg transition-all",
                                scrolled
                                    ? "text-[#1A1A1A] hover:bg-[#F7F7F7]"
                                    : "text-white hover:bg-white/10"
                            )}
                            onClick={() => setMobileOpen(true)}
                            aria-label="Ouvrir le menu"
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-drawer"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Mobile Drawer ── */}
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-[60] bg-black/40 lg:hidden transition-opacity duration-300",
                    mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
            />
            {/* Slide-in panel */}
            <div
                id="mobile-drawer"
                role="dialog"
                aria-label="Menu navigation"
                aria-modal="true"
                className={cn(
                    "fixed top-0 right-0 bottom-0 z-[70] w-[300px] bg-white shadow-[0_8px_28px_rgba(0,0,0,0.12)] flex flex-col lg:hidden transition-transform duration-300 ease-out",
                    mobileOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between p-5 border-b border-[#DDDDDD]">
                    <span className="font-display font-semibold text-[18px] text-[#1A1A1A]">
                        Farah<span className="text-[#E8472A]">.ma</span>
                    </span>
                    <button
                        className="p-2 rounded-lg hover:bg-[#F7F7F7] transition-colors"
                        onClick={() => setMobileOpen(false)}
                        aria-label="Fermer le menu"
                    >
                        <svg className="w-5 h-5 text-[#484848]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex flex-col p-4 gap-1" aria-label="Navigation mobile">
                    {NAV_ITEM_KEYS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-[15px] font-medium text-[#484848] hover:text-[#1A1A1A] hover:bg-[#F7F7F7] px-4 py-3 rounded-lg transition-colors"
                            onClick={() => setMobileOpen(false)}
                        >
                            {t(item.labelKey)}
                        </Link>
                    ))}
                </nav>

                <div className="mx-4 h-px bg-[#DDDDDD]" />

                {/* Language Switcher Mobile */}
                <div className="px-4 py-4">
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest px-2 mb-2">Langue</p>
                    <LanguageSwitcher mobile />
                </div>

                {/* Auth CTAs */}
                <div className="p-4 mt-auto space-y-2 border-t border-[#DDDDDD]">
                    {user ? (
                        <>
                            <p className="text-[13px] text-[#717171] px-2 mb-3">
                                Connecté en tant que <strong className="text-[#1A1A1A]">{user.firstName}</strong>
                            </p>
                            <Button
                                variant="ghost"
                                className="w-full"
                                onClick={() => { logout(); setMobileOpen(false); }}
                            >
                                {t('nav.logout', 'Déconnexion')}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" className="w-full" asChild>
                                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                                    {t("nav.login")}
                                </Link>
                            </Button>
                            <Button variant="default" className="w-full" asChild>
                                <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                                    {t("nav.start")}
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
