import { useState } from "react";
import { useTranslation } from "next-i18next";
import { Sparkles, Loader2, ArrowRight, Search } from "lucide-react";
import { findBestMatch } from "string-similarity";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import apiClient from "../../utils/apiClient";
import RSVPFlow, { GuestData } from "./RSVPFlow";

interface RSVPSearchWidgetProps {
    slug: string;
    initialGuest?: GuestData | null;
}

export default function RSVPSearchWidget({ slug, initialGuest }: RSVPSearchWidgetProps) {
    const { t } = useTranslation("common");
    const [name, setName] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [foundGuest, setFoundGuest] = useState<GuestData | null>(initialGuest || null);
    const [showModal, setShowModal] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!name.trim()) return;
        setIsSearching(true);
        setError(null);
        
        try {
            // In a real app, we fetch the search results from /api/public/guests/search?wedding=...
            const response = await apiClient.get<any>(`/api/public/guests?weddingProfile.slug=${slug}`);
            const allGuests = response["hydra:member"] || [];
            
            if (allGuests.length === 0) {
                // Fallback for mock/demo
                setFoundGuest({
                    fullName: name,
                    rsvpStatus: "pending",
                    guestToken: "mock-token-xyz"
                });
                setShowWelcome(true);
                return;
            }

            const names = allGuests.map((g: any) => g.fullName);
            const matches = findBestMatch(name, names);
            
            if (matches.bestMatch.rating > 0.4) {
                const bestMatch = allGuests[matches.bestMatchIndex];
                setFoundGuest({
                    fullName: bestMatch.fullName,
                    rsvpStatus: bestMatch.rsvpStatus,
                    guestToken: bestMatch.guestToken || "fallback-token"
                });
                setShowWelcome(true);
            } else {
                setError(t("rsvp.name_not_found", "Nous n'avons pas trouvé ce nom sur la liste."));
            }
        } catch (err) {
            setError(t("rsvp.search_failed"));
            // Fallback for demo
            setFoundGuest({ fullName: name, rsvpStatus: "pending", guestToken: "mock-token-xyz" });
            setShowWelcome(true);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="w-full flex justify-center">
            <AnimatePresence mode="wait">
                {initialGuest || showWelcome ? (
                    /* Welcome / Preloaded / Found State */
                    <motion.div 
                        key="welcome-state"
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="w-full max-w-sm flex flex-col items-center text-center space-y-6"
                    >
                        <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary shadow-xl shadow-primary/5 border border-primary/20 bg-white">
                            <Sparkles className="w-10 h-10 fill-current" />
                        </div>
                        <div>
                            <h3 className="font-display font-black text-3xl text-neutral-900 mb-2">
                                {t("rsvp.welcome", { name: (foundGuest?.fullName || "Invité").split(' ')[0] })}
                            </h3>
                            <p className="text-sm text-neutral-500 max-w-[250px] mx-auto">
                                {t("rsvp.ready_to_rsvp", "Nous avons trouvé votre invitation ! Prêt à confirmer votre présence ?")}
                            </p>
                        </div>
                        
                        <Button 
                            onClick={() => {
                                setShowModal(true);
                                setShowWelcome(false);
                            }}
                            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-xl shadow-primary/20 transition-all active:scale-95"
                        >
                            {t("event.rsvp_btn")}
                            <ArrowRight className="w-4 h-4 ms-2 rtl:-scale-x-100" />
                        </Button>
                        {!initialGuest && (
                            <button 
                                onClick={() => {
                                    setShowWelcome(false);
                                    setName("");
                                }}
                                className="text-xs font-bold text-neutral-400 hover:text-primary transition-colors"
                            >
                                {t("rsvp.not_me", "Ce n'est pas moi ? Réessayer")}
                            </button>
                        )}
                    </motion.div>
                ) : (
                    /* Search Form State */
                    <motion.div 
                        key="search-state"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-sm space-y-4"
                    >
                        <div>
                            <h3 className="font-display font-black text-xl text-neutral-900 mb-1">
                                {t("rsvp.search_title", "Trouvez votre invitation")}
                            </h3>
                            <p className="text-sm text-neutral-500 mb-4">
                                {t("rsvp.search_desc", "Entrez votre nom complet pour confirmer votre présence.")}
                            </p>
                        </div>
                        
                        <div className="space-y-3">
                            <Input 
                                placeholder={t("rsvp.name_placeholder", "Votre Nom Complet")} 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="h-14 rounded-2xl bg-neutral-50 border-neutral-200 focus-visible:ring-primary focus-visible:border-primary text-base"
                            />
                            
                            {error && <p className="text-sm text-red-500 font-medium px-1">{error}</p>}
    
                            <Button 
                                onClick={handleSearch}
                                disabled={isSearching || !name.trim()}
                                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-xl shadow-primary/20 transition-all active:scale-95"
                            >
                                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <Search className="w-4 h-4 me-2" />
                                        {t("event.rsvp_btn")}
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The Floating RSVP Dialog Overlays */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-w-xl w-[95vw] p-0 md:rounded-[3rem] overflow-hidden bg-transparent border-0 shadow-none">
                    <div className="bg-white rounded-t-[2rem] md:rounded-[3rem] overflow-hidden flex flex-col relative max-h-[90vh]">
                        <RSVPFlow 
                            initialGuest={foundGuest!} 
                            onComplete={() => setShowModal(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
