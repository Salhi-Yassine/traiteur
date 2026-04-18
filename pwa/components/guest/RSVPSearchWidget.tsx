import { useState } from "react";
import { useTranslation } from "next-i18next";
import { Sparkles, Loader2, ArrowRight, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent } from "../../components/ui/dialog";
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
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!name.trim()) return;
        setIsSearching(true);
        setError(null);
        
        try {
            // Mock backend call (Fallback until real API endpoint is built)
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Allow any name to pass the mock logic
            setFoundGuest({
                fullName: name,
                rsvpStatus: "pending",
                guestToken: "mock-token-xyz"
            });
            setShowModal(true);
        } catch (err) {
            setError(t("rsvp.search_failed"));
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="w-full flex justify-center">
            {initialGuest ? (
                /* Magic Link / Preloaded State */
                <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary shadow-xl shadow-primary/5 border border-primary/20">
                        <Sparkles className="w-8 h-8 fill-current" />
                    </div>
                    <div>
                        <h3 className="font-display font-black text-2xl text-neutral-900 mb-2">
                            {t("rsvp.welcome", { name: initialGuest.fullName.split(' ')[0] })}
                        </h3>
                        <p className="text-sm text-neutral-500">
                            {t("rsvp.ready_to_rsvp", "Ready to RSVP for the wedding?")}
                        </p>
                    </div>
                    
                    <Button 
                        onClick={() => {
                            setFoundGuest(initialGuest);
                            setShowModal(true);
                        }}
                        className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-xl shadow-primary/20 transition-all active:scale-95"
                    >
                        {t("event.rsvp_btn")}
                        <ArrowRight className="w-4 h-4 ms-2" />
                    </Button>
                </div>
            ) : (
                /* Native Search Form State */
                <div className="w-full max-w-sm space-y-4">
                    <div>
                        <h3 className="font-display font-black text-xl text-neutral-900 mb-1">
                            {t("rsvp.search_title", "Find Your Invitation")}
                        </h3>
                        <p className="text-sm text-neutral-500 mb-4">
                            {t("rsvp.search_desc", "Enter your first and last name to RSVP.")}
                        </p>
                    </div>
                    
                    <div className="space-y-3">
                        <Input 
                            placeholder={t("rsvp.name_placeholder", "Your Full Name")} 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="h-14 rounded-2xl bg-neutral-50 border-neutral-200 focus-visible:ring-primary focus-visible:border-primary text-base"
                        />
                        
                        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

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
                </div>
            )}

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
