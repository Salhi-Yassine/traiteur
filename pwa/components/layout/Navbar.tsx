import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
    {
        label: "Browse Caterers",
        href: "/caterers",
    },
    { label: "Event Types", href: "/caterers?eventType=Wedding" },
    { label: "How It Works", href: "/#how-it-works" },
];

export default function Navbar() {
    const { user, logout, isLoading } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-white/95 backdrop-blur-md shadow-[var(--shadow-nav)]"
                : "bg-transparent"
                }`}
        >
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-teal-700)] flex items-center justify-center">
                            <span className="text-white text-sm font-bold font-[var(--font-display)]">T</span>
                        </div>
                        <span
                            className={`font-display font-bold text-xl tracking-tight transition-colors ${scrolled ? "text-[var(--color-teal-800)]" : "text-white"
                                }`}
                        >
                            Traiteur
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-link text-sm font-medium transition-colors pb-1 ${scrolled
                                    ? "text-[var(--color-charcoal-700)] hover:text-[var(--color-teal-700)]"
                                    : "text-white/90 hover:text-white"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTAs */}
                    <div className="hidden lg:flex items-center gap-3">
                        {isLoading ? (
                            <div className="w-20 h-8 skeleton rounded-full" />
                        ) : user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/profile"
                                    className={`text-sm font-medium transition-colors ${scrolled ? "text-[var(--color-charcoal-700)]" : "text-white/90"}`}
                                >
                                    Hi, {user.firstName}
                                </Link>
                                <button
                                    onClick={logout}
                                    className="text-xs font-semibold px-4 py-2 rounded-full border border-[var(--color-teal-700)] text-[var(--color-teal-700)] hover:bg-[var(--color-teal-50)] transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${scrolled
                                        ? "text-[var(--color-charcoal-700)] hover:text-[var(--color-teal-700)]"
                                        : "text-white/90 hover:text-white"
                                        }`}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="text-sm font-semibold px-5 py-2.5 rounded-full bg-[var(--color-teal-700)] text-white hover:bg-[var(--color-teal-800)] transition-colors shadow-sm"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? "text-[var(--color-charcoal-700)]" : "text-white"
                            }`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="lg:hidden bg-white border-t border-[var(--color-sand-200)] px-6 py-4 shadow-lg">
                    <nav className="flex flex-col gap-1">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="py-3 px-2 text-[var(--color-charcoal-700)] font-medium border-b border-[var(--color-sand-100)] last:border-0"
                                onClick={() => setMobileOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="flex gap-3 mt-4 pt-3">
                            {user ? (
                                <>
                                    <Link
                                        href="/profile"
                                        className="flex-1 text-center py-2.5 border border-[var(--color-teal-700)] text-[var(--color-teal-700)] rounded-full text-sm font-medium"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        My Profile
                                    </Link>
                                    <button
                                        onClick={() => { logout(); setMobileOpen(false); }}
                                        className="flex-1 text-center py-2.5 bg-[var(--color-teal-700)] text-white rounded-full text-sm font-semibold"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/login"
                                        className="flex-1 text-center py-2.5 border border-[var(--color-teal-700)] text-[var(--color-teal-700)] rounded-full text-sm font-medium"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/auth/register"
                                        className="flex-1 text-center py-2.5 bg-[var(--color-teal-700)] text-white rounded-full text-sm font-semibold"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
