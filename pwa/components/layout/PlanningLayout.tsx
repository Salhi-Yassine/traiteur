import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface PlanningLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
}

export default function PlanningLayout({ children, title, description }: PlanningLayoutProps) {
    const { t } = useTranslation("common");
    const { user, isLoading } = useAuth();
    const router = useRouter();

    const NAV_LINKS = [
        { label: t("nav.dashboard"), href: "/mariage", icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        )},
        { label: t("nav.budget"), href: "/mariage/budget", icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )},
        { label: t("nav.guests"), href: "/mariage/invites", icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        )},
        { label: t("nav.checklist"), href: "/mariage/checklist", icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        )},
    ];

    useEffect(() => {
        if (!isLoading && (!user || user.userType !== 'couple')) {
            router.push("/auth/login");
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) return <div className="min-h-screen bg-neutral-100" />;

    return (
        <div className="bg-[#F7F7F7] min-h-screen pb-20">
            <Navbar />
            
            <div className="pt-24 lg:pt-32">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Sidebar Navigation */}
                        <aside className="lg:w-80 shrink-0">
                            <div className="sticky top-32 space-y-4">
                                <div className="px-6 py-2 mb-2">
                                    <h2 className="font-display font-black text-3xl text-neutral-900 leading-tight">
                                        {t("nav.my_wedding")}
                                    </h2>
                                    <p className="text-[#717171] text-[11px] font-bold uppercase tracking-widest mt-2">
                                        {t("nav.mgmt_desc")}
                                    </p>
                                </div>
                                <nav className="space-y-2">
                                    {NAV_LINKS.map((link) => {
                                        const isActive = router.pathname === link.href;
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 group ${
                                                    isActive 
                                                    ? "bg-white text-neutral-900 shadow-2 border border-neutral-100" 
                                                    : "text-[#717171] hover:bg-white/50 hover:text-neutral-900 hover:translate-x-1"
                                                }`}
                                            >
                                                <div className={cn(
                                                    "transition-colors",
                                                    isActive ? "text-primary" : "text-[#B0B0B0] group-hover:text-primary"
                                                )}>
                                                    {link.icon}
                                                </div>
                                                <span className="text-[15px]">{link.label}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>

                                {/* Expert Help Center Card */}
                                <div className="mt-8 p-10 rounded-[2.5rem] bg-neutral-900 text-white relative overflow-hidden group shadow-3">
                                    <div className="absolute top-0 end-0 w-32 h-32 bg-primary/20 rounded-full -me-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                                    <h4 className="font-display font-bold text-2xl mb-4 relative z-10">{t("nav.need_help")}</h4>
                                    <p className="text-white/60 text-[14px] leading-relaxed mb-8 font-medium relative z-10">
                                        {t("nav.help_desc")}
                                    </p>
                                    <Link 
                                        href="/vendors" 
                                        className="relative z-10 flex items-center gap-2 text-white font-black text-[12px] uppercase tracking-widest group-hover:text-primary transition-colors"
                                    >
                                        {t("nav.see_experts")}
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:translate-x-1 transition-all">
                                            →
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <main className="flex-1 min-w-0">
                            {/* Content Header */}
                            <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                                <div>
                                    <div className="w-12 h-1.5 bg-primary rounded-full mb-6" />
                                    <h1 className="font-display text-4xl md:text-5xl font-black text-neutral-900 leading-tight mb-2">
                                        {title}
                                    </h1>
                                    <p className="text-neutral-500 text-lg font-medium leading-relaxed max-w-xl">
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
