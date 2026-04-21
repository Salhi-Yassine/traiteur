import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, X, Volume2 } from "lucide-react";

interface AudioPlayerProps {
    content: string;
    title: string;
    onClose: () => void;
}

/** Strip HTML tags and return clean readable text */
function stripHtml(html: string): string {
    if (typeof window === "undefined") return html;
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent ?? tmp.innerText ?? "";
}

const SPEEDS = [1, 1.5, 2] as const;
type Speed = (typeof SPEEDS)[number];

export default function AudioPlayer({ content, title, onClose }: AudioPlayerProps) {
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState<Speed>(1);
    const [progress, setProgress] = useState(0); // 0–100
    const [hasSpeech, setHasSpeech] = useState(false); // never true on SSR
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const charIndexRef = useRef(0);
    const plainText = useRef<string>("");

    useEffect(() => {
        // Safe to access window here — only runs on client after hydration
        setHasSpeech(typeof window !== "undefined" && !!window.speechSynthesis);
    }, []);

    useEffect(() => {
        plainText.current = `${title}. ${stripHtml(content)}`;
        return () => {
            window.speechSynthesis?.cancel();
        };
    }, [content, title]);

    const speak = useCallback((startChar = 0) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();

        const text = plainText.current.slice(startChar);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "fr-FR";
        utterance.rate = speed;

        utterance.onboundary = (e) => {
            charIndexRef.current = startChar + (e.charIndex ?? 0);
            const pct = (charIndexRef.current / plainText.current.length) * 100;
            setProgress(Math.min(pct, 100));
        };

        utterance.onend = () => {
            setPlaying(false);
            setProgress(100);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setPlaying(true);
    }, [speed]);

    const togglePlay = useCallback(() => {
        if (!window.speechSynthesis) return;
        if (playing) {
            window.speechSynthesis.pause();
            setPlaying(false);
        } else {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
                setPlaying(true);
            } else {
                speak(charIndexRef.current);
            }
        }
    }, [playing, speak]);

    const skip30 = useCallback(() => {
        // Skip ~30 seconds: estimate ~150 chars/min at 1x, scale with speed
        const charsPerSec = (150 / 60) * speed;
        const skip = Math.round(charsPerSec * 30);
        const next = Math.min(charIndexRef.current + skip, plainText.current.length - 1);
        charIndexRef.current = next;
        speak(next);
    }, [speak, speed]);

    const cycleSpeed = useCallback(() => {
        window.speechSynthesis?.cancel();
        const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
        setSpeed(next);
        // Re-speak from current position with new speed
        setTimeout(() => speak(charIndexRef.current), 50);
    }, [speed, speak]);

    const handleClose = useCallback(() => {
        window.speechSynthesis?.cancel();
        setPlaying(false);
        onClose();
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 w-[min(420px,90vw)]"
            >
                <div className="bg-[#1A1A1A] text-white rounded-[2rem] shadow-2xl overflow-hidden">
                    {/* Progress bar */}
                    <div className="h-1 bg-white/10">
                        <motion.div
                            className="h-full bg-primary"
                            style={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    <div className="px-6 py-5 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                    <Volume2 className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                        Lecture en cours
                                    </p>
                                    <p className="text-[13px] font-semibold line-clamp-1 text-white/90">
                                        {title}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-white/40 hover:text-white transition-colors mt-1 shrink-0"
                                aria-label="Fermer le lecteur"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between">
                            {/* Speed toggle */}
                            <button
                                onClick={cycleSpeed}
                                className="text-[12px] font-black text-white/50 hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-full"
                            >
                                {speed}×
                            </button>

                            {/* Play / Pause */}
                            <button
                                onClick={togglePlay}
                                className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                                aria-label={playing ? "Pause" : "Lire"}
                            >
                                {playing ? (
                                    <Pause className="w-6 h-6" fill="white" />
                                ) : (
                                    <Play className="w-6 h-6 translate-x-0.5" fill="white" />
                                )}
                            </button>

                            {/* Skip 30s */}
                            <button
                                onClick={skip30}
                                className="flex flex-col items-center gap-0.5 text-white/50 hover:text-white transition-colors"
                                aria-label="Avancer de 30 secondes"
                            >
                                <SkipForward className="w-5 h-5" />
                                <span className="text-[9px] font-bold">+30s</span>
                            </button>
                        </div>

                        {!hasSpeech && (
                            <p className="text-[11px] text-white/30 text-center">
                                Lecture audio non disponible sur ce navigateur.
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
