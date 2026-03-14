import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

interface PlanningLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
}

const NAV_LINKS = [
    { label: "Tableau de Bord", href: "/mariage", icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
    )},
    { label: "Budget", href: "/mariage/budget", icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    )},
    { label: "Invités", href: "/mariage/invites", icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    )},
    { label: "Checklist", href: "/mariage/checklist", icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
    )},
];

export default function PlanningLayout({ children, title, description }: PlanningLayoutProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!user || user.userType !== 'couple')) {
            router.push("/auth/login");
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) return <div className="min-h-screen bg-[var(--color-background)]" />;

    return (
        <div className="bg-[var(--color-background)] min-h-screen pb-20">
            <Navbar />
            
            <div className="pt-24 lg:pt-32">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Sidebar Navigation */}
                        <aside className="lg:w-72 shrink-0">
                            <div className="sticky top-32 space-y-2">
                                <div className="px-6 py-4 mb-4">
                                    <h2 className="font-display font-black text-2xl text-[var(--color-primary)]">
                                        Mon Mariage
                                    </h2>
                                    <p className="text-[var(--color-charcoal-400)] text-xs font-bold uppercase tracking-widest mt-1">
                                        Gestion de l'événement
                                    </p>
                                </div>
                                <nav className="space-y-1">
                                    {NAV_LINKS.map((link) => {
                                        const isActive = router.pathname === link.href;
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all group ${
                                                    isActive 
                                                    ? "bg-[var(--color-primary)] text-white shadow-xl shadow-[var(--color-primary)]/20" 
                                                    : "text-[var(--color-charcoal-600)] hover:bg-white hover:text-[var(--color-primary)] hover:translate-x-1"
                                                }`}
                                            >
                                                <div className={`${isActive ? "text-[var(--color-accent)]" : "text-[var(--color-charcoal-400)] group-hover:text-[var(--color-accent)]"}`}>
                                                    {link.icon}
                                                </div>
                                                {link.label}
                                            </Link>
                                        );
                                    })}
                                </nav>

                                {/* Quick tips / Decoration Card */}
                                <div className="mt-12 p-8 rounded-[2.5rem] bg-[var(--color-primary)] text-white relative overflow-hidden group border border-[var(--color-accent)]/10">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-accent)]/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                    <h4 className="font-display font-bold text-xl mb-3 relative z-10">Besoin d'aide ?</h4>
                                    <p className="text-white/70 text-sm leading-relaxed mb-6 font-medium relative z-10">
                                        Nos experts sont là pour vous accompagner dans chaque étape.
                                    </p>
                                    <Link href="/vendors" className="relative z-10 text-[var(--color-accent)] font-black text-xs uppercase tracking-widest hover:underline">
                                        Voir les experts →
                                    </Link>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <main className="flex-1 min-w-0">
                            {/* Content Header */}
                            <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                                <div>
                                    <div className="w-12 h-1.5 bg-[var(--color-accent)] rounded-full mb-6" />
                                    <h1 className="font-display text-4xl md:text-5xl font-black text-[var(--color-primary)] leading-tight mb-2">
                                        {title}
                                    </h1>
                                    <p className="text-[var(--color-charcoal-500)] text-lg font-medium leading-relaxed max-w-xl">
                                        {description}
                                    </p>
                                </div>
                            </div>

                            {/* Page Content */}
                            <div className="fade-in-up">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}
