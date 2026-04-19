import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "next-i18next";
import { motion } from "framer-motion";
import Image from "next/image";

interface VenueLocationProps {
    venueName: string;
    city: string;
    address: string;
}

export default function VenueLocation({ venueName, city, address }: VenueLocationProps) {
    const { t } = useTranslation("common");
    
    // Construct Google Maps URL
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venueName} ${address} ${city}`)}`;

    return (
        <section className="py-24 bg-white" id="venue">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest mb-6"
                    >
                        <MapPin className="w-3.5 h-3.5" />
                        {t("vendor_profile.location.title")}
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-display text-5xl font-black text-neutral-900 mb-6"
                    >
                        {venueName || t("event.venue_placeholder", "Le Lieu de la Cérémonie")}
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-neutral-500 max-w-2xl mx-auto"
                    >
                        {address} • {city}
                    </motion.p>
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative rounded-[3.5rem] overflow-hidden aspect-video md:aspect-[21/9] shadow-2xl group shadow-primary/5 border border-neutral-100"
                >
                    <Image 
                        src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200" 
                        alt="Venue Map Preview" 
                        fill
                        className="object-cover grayscale opacity-20"
                    />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-transparent via-white/40 to-white/90">
                        <div className="w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center text-primary mb-6 animate-bounce">
                            <MapPin className="w-10 h-10 fill-current" />
                        </div>
                        <div className="space-y-4">
                            <p className="font-display text-2xl font-black text-neutral-900">{venueName}</p>
                            <div className="flex flex-col md:flex-row gap-4">
                                <Button 
                                    asChild
                                    className="rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold h-14 px-8 shadow-xl shadow-primary/20"
                                >
                                    <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                                        <Navigation className="w-4 h-4 me-2" />
                                        Google Maps
                                    </a>
                                </Button>
                                <Button 
                                    variant="outline"
                                    asChild
                                    className="rounded-2xl border-neutral-200 bg-white/50 backdrop-blur-md hover:bg-white text-neutral-900 font-bold h-14 px-8"
                                >
                                    <a href={`maps://?q=${encodeURIComponent(`${venueName} ${city}`)}`} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-4 h-4 me-2" />
                                        Apple Maps
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
