import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { label: "Explorer", href: "/vendors" },
    { label: "Mariage", href: "/mariage" },
    { label: "Conciergerie", href: "/conciergerie" },
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
            className={cn(
                "fixed top-0 inset-x-0 z-[60] transition-all duration-500",
                scrolled 
                    ? "bg-white/80 backdrop-blur-xl shadow-premium py-4" 
                    : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group relative z-[70]">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center border border-secondary/20 shadow-premium transition-transform group-hover:scale-105 group-hover:rotate-3">
                            <span className="text-secondary text-2xl font-black font-display tracking-tighter">F</span>
                        </div>
                        <div className="flex flex-col -gap-1">
                            <span className={cn(
                                "font-display font-black text-2xl tracking-tighter transition-colors",
                                scrolled ? "text-primary" : "text-white"
                            )}>
                                Farah<span className="text-secondary">.ma</span>
                            </span>
                            <span className={cn(
                                "text-[8px] font-black uppercase tracking-[0.4em] transition-opacity",
                                scrolled ? "text-primary/40" : "text-white/40"
                            )}>
                                L'Art de l'Exception
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-12 bg-white/5 backdrop-blur-md px-10 py-3 rounded-full border border-white/10 shadow-premium">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-secondary relative group",
                                    scrolled ? "text-primary" : "text-white"
                                )}
                            >
                                {item.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full" />
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTAs */}
                    <div className="hidden lg:flex items-center gap-6 relative z-[70]">
                        {isLoading ? (
                            <div className="w-24 h-5 animate-pulse bg-white/10 rounded-full" />
                        ) : user ? (
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="text-right">
                                        <p className={cn(
                                            "text-[10px] font-black uppercase tracking-widest leading-none",
                                            scrolled ? "text-primary" : "text-white"
                                        )}>{user.firstName}</p>
                                        <button 
                                            onClick={logout}
                                            className="text-[8px] font-black uppercase tracking-[0.3em] text-secondary hover:underline"
                                        >
                                            Quitter
                                        </button>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20 group-hover:bg-secondary/20 transition-all">
                                        <span className="text-secondary text-xs font-black">{user.firstName[0]}</span>
                                    </div>
                                </div>
                                <Button variant="premium" size="sm" className="px-6 py-2.5 rounded-xl border-none">
                                    Tableau de bord
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    className={cn(
                                        "text-[10px] font-black uppercase tracking-[0.3em] transition-colors py-2",
                                        scrolled ? "text-primary hover:text-secondary" : "text-white hover:text-secondary"
                                    )}
                                >
                                    Connexion
                                </Link>
                                <Button variant="premium" size="sm" className="rounded-xl border-none h-11 px-8">
                                    Nous Rejoindre
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className={cn(
                            "lg:hidden p-3 rounded-2xl transition-all relative z-[70]",
                            scrolled 
                                ? "bg-primary text-secondary shadow-premium" 
                                : mobileOpen ? "bg-white text-primary" : "bg-white/10 text-white backdrop-blur-md"
                        )}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            <div className={cn(
                "fixed inset-0 bg-primary z-[65] transition-transform duration-700 lg:hidden flex flex-col items-center justify-center px-12 text-center",
                mobileOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/moroccan-flower.png')] scale-150" />
                
                <nav className="relative z-10 flex flex-col gap-12">
                    {NAV_ITEMS.map((item, i) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-3xl font-display font-black text-white hover:text-secondary transition-colors"
                            onClick={() => setMobileOpen(false)}
                            style={{ transitionDelay: `${i * 100}ms` }}
                        >
                            {item.label}
                        </Link>
                    ))}
                    
                    <div className="h-0.5 w-12 bg-secondary/30 mx-auto my-4" />
                    
                    <div className="flex flex-col gap-6">
                        {user ? (
                            <Button
                                variant="secondary"
                                onClick={() => { logout(); setMobileOpen(false); }}
                                className="w-full h-16 rounded-2xl text-xs"
                            >
                                Déconnexion
                            </Button>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    className="text-white font-black uppercase tracking-[0.4em] text-xs hover:text-secondary py-4"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Se Connecter
                                </Link>
                                <Button
                                    variant="premium"
                                    onClick={() => setMobileOpen(false)}
                                    className="w-full h-16 rounded-2xl"
                                >
                                    S'Inscrire Maintenant
                                </Button>
                            </>
                        )}
                    </div>
                </nav>

                <div className="absolute bottom-20 left-0 w-full text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
                        Farah.ma — Art de Vivre Marocain
                    </p>
                </div>
            </div>
        </header>
    );
}
