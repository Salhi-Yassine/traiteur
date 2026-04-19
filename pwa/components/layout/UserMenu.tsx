import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "next-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { 
    LayoutDashboard, 
    User as UserIcon, 
    Settings, 
    LogOut, 
    HelpCircle,
    ChevronDown,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PATHS } from "../../constants/paths";

interface UserMenuProps {
    scrolled?: boolean;
}

export default function UserMenu({ scrolled }: UserMenuProps) {
    const { user, logout } = useAuth();
    const { t } = useTranslation("common");
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) return null;

    const dashboardPath = user.userType === "vendor" 
        ? PATHS.DASHBOARD_VENDOR 
        : PATHS.DASHBOARD_COUPLE;

    const dashboardLabel = user.userType === "vendor"
        ? t("nav.user_menu.vendor_dashboard")
        : t("nav.user_menu.couple_dashboard");

    const initials = (user.firstName?.[0] || "") + (user.lastName?.[0] || "");

    return (
        <div className="relative" ref={menuRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 p-1.5 rounded-full transition-all duration-300 group",
                    isOpen 
                        ? "bg-primary/10 border-primary/20 shadow-lg shadow-primary/5" 
                        : scrolled 
                            ? "hover:bg-neutral-100 border-transparent" 
                            : "hover:bg-white/10 border-transparent",
                    "border-2"
                )}
            >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-black shadow-md shadow-primary/20">
                    {initials || <UserIcon className="w-4 h-4" />}
                </div>
                <span className={cn(
                    "hidden md:block text-[14px] font-bold me-1",
                    scrolled ? "text-neutral-900" : "text-white"
                )}>
                    {user.firstName}
                </span>
                <ChevronDown className={cn(
                    "w-4 h-4 transition-transform duration-300",
                    isOpen && "rotate-180",
                    scrolled ? "text-neutral-400" : "text-white/60"
                )} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10, x: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10, x: 20 }}
                        className="absolute end-0 top-full mt-3 w-64 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-neutral-100 overflow-hidden z-[60]"
                    >
                        {/* Header/Profile Info */}
                        <div className="p-6 bg-neutral-50/50 border-b border-neutral-100">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">
                                {t("nav.connected_as")}
                            </p>
                            <p className="font-display font-black text-neutral-900 truncate">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                        </div>

                        {/* Menu Links */}
                        <div className="p-3">
                            <MenuLink 
                                href={dashboardPath} 
                                icon={<LayoutDashboard className="w-4 h-4" />}
                                onClick={() => setIsOpen(false)}
                            >
                                {dashboardLabel}
                            </MenuLink>
                            
                            <MenuLink 
                                href="/account" 
                                icon={<Settings className="w-4 h-4" />}
                                onClick={() => setIsOpen(false)}
                            >
                                {t("nav.user_menu.profile")}
                            </MenuLink>

                            <MenuLink 
                                href="/faq" 
                                icon={<HelpCircle className="w-4 h-4" />}
                                onClick={() => setIsOpen(false)}
                            >
                                {t("nav.user_menu.help")}
                            </MenuLink>
                        </div>

                        {/* Footer / Logout */}
                        <div className="p-3 bg-neutral-50/50 border-t border-neutral-100">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    logout();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                {t("nav.user_menu.logout")}
                            </button>
                        </div>

                        {/* Promotion/Sparkle tag */}
                        <div className="px-6 py-3 bg-primary/5 flex items-center justify-center gap-2">
                            <Sparkles className="w-3 h-3 text-primary" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary">
                                Premium Plan
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MenuLink({ href, icon, children, onClick }: { href: string; icon: React.ReactNode; children: React.ReactNode; onClick: () => void }) {
    return (
        <Link 
            href={href} 
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold text-neutral-600 hover:text-primary hover:bg-primary/5 transition-all group"
        >
            <div className="text-neutral-400 group-hover:text-primary transition-colors">
                {icon}
            </div>
            {children}
        </Link>
    );
}
