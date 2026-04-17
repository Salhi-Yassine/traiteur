"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ANIMATIONS = {
    confetti: "https://lottie.host/81e5926b-968e-4fbd-8051-419b78c9597b/pY1GzJ35kU.json",
    checkmark: "https://lottie.host/86d6e273-0495-46f9-b80c-7b0028a2b535/nN6H0zJ2uY.json",
};

interface SuccessAnimationProps {
    type?: keyof typeof ANIMATIONS;
    show: boolean;
    onComplete?: () => void;
    overlay?: boolean;
    title?: string;
    subtitle?: string;
}

export default function SuccessAnimation({
    type = "confetti",
    show,
    onComplete,
    overlay = true,
    title,
    subtitle
}: SuccessAnimationProps) {
    const [animationData, setAnimationData] = useState<any>(null);

    useEffect(() => {
        if (show) {
            fetch(ANIMATIONS[type])
                .then((res) => res.json())
                .then((data) => setAnimationData(data))
                .catch(err => console.error("Lottie load error:", err));
        } else {
            setAnimationData(null);
        }
    }, [show, type]);

    if (!show || !animationData) return null;

    const lottieContent = (
        <Lottie
            animationData={animationData}
            loop={false}
            onComplete={onComplete}
            className="w-full h-full"
        />
    );

    if (overlay) {
        return (
            <div
                className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
                onClick={onComplete}
            >
                <div
                    className="bg-white rounded-[2.5rem] p-10 shadow-3xl max-w-lg w-full relative overflow-hidden flex flex-col items-center text-center animate-in zoom-in-95 duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="w-full aspect-square max-w-[280px] pointer-events-none">
                        {lottieContent}
                    </div>
                    
                    <div className="mt-4 animate-in slide-in-from-bottom-4 duration-500 delay-300">
                        <h3 className="font-display font-black text-3xl text-neutral-900 mb-3">
                            {title || "Félicitations !"}
                        </h3>
                        <p className="text-neutral-500 font-medium px-4 leading-relaxed">
                            {subtitle || "Vous avez franchi une étape importante vers le mariage de vos rêves."}
                        </p>
                    </div>

                    <button
                        onClick={onComplete}
                        className="mt-10 px-8 h-12 bg-neutral-900 text-white rounded-full font-bold hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/10"
                    >
                        Continuer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full pointer-events-none">
            {lottieContent}
        </div>
    );
}
