import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

interface WeddingCountdownProps {
    targetDate: string;
}

export default function WeddingCountdown({ targetDate }: WeddingCountdownProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();
            let timeLeft: TimeLeft | null = null;

            if (difference > 0) {
                timeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return timeLeft;
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        setTimeLeft(calculateTimeLeft());

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) return null;

    return (
        <div className="flex justify-center gap-4 md:gap-8">
            <TimeUnit value={timeLeft.days} label="Jours" />
            <TimeUnit value={timeLeft.hours} label="Heures" />
            <TimeUnit value={timeLeft.minutes} label="Minutes" />
            <TimeUnit value={timeLeft.seconds} label="Secondes" />
        </div>
    );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <div className="relative w-16 h-20 md:w-24 md:h-28 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={value}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="text-3xl md:text-5xl font-display font-black text-white"
                    >
                        {String(value).padStart(2, "0")}
                    </motion.span>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />
            </div>
            <span className="mt-3 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40">
                {label}
            </span>
        </div>
    );
}
