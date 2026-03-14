import Link from "next/link";
import { cn } from "@/lib/utils";

const FOOTER_LINKS = {
    Découvrir: [
        { label: "Tous les prestataires", href: "/vendors" },
        { label: "Salles & Palais", href: "/vendors?category=Salles" },
        { label: "Traiteurs Gastronomiques", href: "/vendors?category=Catering" },
        { label: "Négafas & Parures", href: "/vendors?category=Negrafa" },
        { label: "Photo & Cinéma", href: "/vendors?category=Photography" },
    ],
    "Outils Planning": [
        { label: "Tableau de Bord", href: "/mariage" },
        { label: "Gestion du Budget", href: "/mariage/budget" },
        { label: "Liste d'Invités", href: "/mariage/invites" },
        { label: "Checklist Mariage", href: "/mariage/checklist" },
    ],
    "Farah.ma": [
        { label: "À propos de nous", href: "#" },
        { label: "Blog & Tendances", href: "#" },
        { label: "Espace Prestataire", href: "/auth/register?type=vendor" },
        { label: "Contactez-nous", href: "#" },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-primary text-white border-t border-secondary/10 relative overflow-hidden">
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/moroccan-flower.png')] scale-125" />
            
            {/* Main content */}
            <div className="container mx-auto max-w-7xl px-6 py-24 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
                    {/* Brand */}
                    <div className="lg:col-span-1 space-y-8">
                        <Link href="/" className="inline-flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center border border-white/10 shadow-premium transition-transform group-hover:rotate-3">
                                <span className="text-primary text-2xl font-black font-display tracking-tighter">F</span>
                            </div>
                            <span className="font-display font-black text-3xl text-white tracking-tighter">
                                Farah<span className="text-secondary">.ma</span>
                            </span>
                        </Link>
                        <p className="text-white/40 text-sm leading-relaxed italic border-l-2 border-secondary/30 pl-6 py-1">
                            "L'excellence au service de vos plus belles célébrations marocaines. Une curation minutieuse pour un héritage éternel."
                        </p>
                        {/* Social */}
                        <div className="flex gap-4">
                            {["instagram", "facebook", "twitter"].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:bg-secondary hover:text-primary hover:border-secondary flex items-center justify-center transition-all shadow-premium group"
                                    aria-label={social}
                                >
                                    <SocialIcon name={social} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
                        <div key={heading} className="space-y-8">
                            <h3 className="text-secondary text-[10px] font-black uppercase tracking-[0.4em]">
                                {heading}
                            </h3>
                            <ul className="space-y-5">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-white/50 hover:text-secondary text-xs transition-all font-black uppercase tracking-widest hover:pl-2"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/5 bg-black/20 relative z-10">
                <div className="container mx-auto max-w-7xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
                        © 2026 Farah.ma — Plateforme d'Excellence Événementielle
                    </p>
                    <div className="flex items-center gap-8">
                        <Link href="#" className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] hover:text-secondary">Confidentialité</Link>
                        <Link href="#" className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] hover:text-secondary">CGU</Link>
                        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                            Fait avec <span className="text-secondary animate-pulse text-lg">♥</span> au Maroc
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ name }: { name: string }) {
    const icons: Record<string, React.ReactNode> = {
        instagram: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        ),
        facebook: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
        twitter: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    };
    return <>{icons[name] ?? null}</>;
}
