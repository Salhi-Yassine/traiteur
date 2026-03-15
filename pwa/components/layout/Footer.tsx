import Link from "next/link";
import { useTranslation } from "next-i18next";

// v3.0 Footer — neutral-900 bg, clean white/neutral-300 text, no gold
export default function Footer() {
    const { t } = useTranslation("common");

    const FOOTER_LINKS = {
        [t("footer.sections.platform")]: [
            { label: t("nav.vendors"), href: "/vendors" },
            { label: t("nav.inspiration"), href: "/inspiration" },
            { label: t("nav.real_weddings"), href: "/real-weddings" },
            { label: t("footer.about"), href: "/about" },
        ],
        [t("footer.sections.planning")]: [
            { label: t("footer.dashboard"), href: "/plan" },
            { label: t("footer.budget"), href: "/plan/budget" },
            { label: t("footer.guests"), href: "/plan/guests" },
            { label: t("footer.checklist"), href: "/plan/checklist" },
        ],
        [t("footer.sections.vendors")]: [
            { label: t("footer.list_business"), href: "/for-vendors" },
            { label: t("footer.vendor_login"), href: "/auth/login" },
            { label: t("footer.pricing"), href: "/for-vendors#pricing" },
            { label: t("footer.faq"), href: "/about#faq" },
        ],
    };

    return (
        <footer className="bg-[#1A1A1A] text-white" role="contentinfo">
            {/* Main grid */}
            <div className="container mx-auto max-w-7xl px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

                    {/* Brand column */}
                    <div className="space-y-6 lg:col-span-1">
                        <Link href="/" className="inline-flex items-center gap-2.5 group">
                            <div className="flex items-center justify-center transition-transform group-hover:scale-105 text-4xl" aria-hidden="true">
                                💞
                            </div>
                            <span className="font-display font-semibold text-[18px] tracking-tight">
                                Farah<span className="text-[#E8472A]">.ma</span>
                            </span>
                        </Link>

                        <p className="text-[#717171] text-[14px] leading-relaxed">
                            {t("footer.tagline")}
                        </p>

                        {/* Social icons */}
                        <div className="flex gap-3">
                            {[
                                { name: "Instagram", href: "#", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                                { name: "Facebook", href: "#", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                                { name: "TikTok", href: "#", path: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34v-7.1a8.16 8.16 0 004.77 1.52V6.27a4.85 4.85 0 01-1-.42z" },
                            ].map(({ name, href, path }) => (
                                <a
                                    key={name}
                                    href={href}
                                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#E8472A] text-[#717171] hover:text-white flex items-center justify-center transition-all duration-150"
                                    aria-label={name}
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d={path} />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
                        <div key={heading} className="space-y-5">
                            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#B0B0B0]">
                                {heading}
                            </h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-[14px] text-[#717171] hover:text-white transition-colors"
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
            <div className="border-t border-white/[0.06]">
                <div className="container mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[13px] text-[#484848]">
                        {t("footer.rights")}
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/about#privacy" className="text-[13px] text-[#484848] hover:text-[#717171] transition-colors">{t("footer.privacy")}</Link>
                        <Link href="/about#terms" className="text-[13px] text-[#484848] hover:text-[#717171] transition-colors">{t("footer.terms")}</Link>
                        <span className="text-[13px] text-[#484848]">{t("footer.made_in")} 🇲🇦</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
