import React from 'react';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

export default function NewsletterBlock() {
    const { t } = useTranslation('common');

    return (
        <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="w-full bg-[#1A1A1A] text-white py-24 md:py-32 px-4 rounded-[3rem] shadow-2xl relative overflow-hidden my-16 md:my-24 max-w-7xl mx-auto"
        >
            {/* Background embellishments */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
                <span className="text-primary text-[12px] font-black uppercase tracking-widest bg-primary/10 px-4 py-1.5 rounded-full inline-block">
                    {t('magazine.newsletter.title').split('—')[0]?.trim() || "Le Mag"}
                </span>
                
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-balance">
                    {t('magazine.newsletter.title')}
                </h2>
                
                <p className="text-white/70 text-[18px] md:text-[20px] leading-relaxed max-w-xl mx-auto">
                    {t('magazine.newsletter.subtitle')}
                </p>

                <form className="mt-10 flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex-1 relative">
                        <input 
                            type="email" 
                            placeholder={t('magazine.newsletter.placeholder')} 
                            className="w-full h-14 bg-white/10 border border-white/20 rounded-full px-6 text-white placeholder:text-white/40 focus:outline-none focus:border-primary focus:bg-white/15 transition-all text-[16px]"
                            required
                        />
                    </div>
                    <button 
                        type="submit"
                        className="h-14 bg-primary text-white rounded-full px-8 text-[15px] font-black uppercase tracking-wider hover:scale-105 transition-transform flex items-center justify-center gap-3 shrink-0"
                    >
                        {t('magazine.newsletter.button')}
                        <Send className="w-5 h-5 rtl:-scale-x-100" />
                    </button>
                </form>

                <p className="text-white/30 text-[12px] mt-6">
                    Mise à jour hebdomadaire. Désabonnement à tout moment.
                </p>
            </div>
        </motion.section>
    );
}
