import { useState } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Sparkles, Heart, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/utils/apiClient";
import { toast } from "sonner";
import Image from "next/image";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface QuizOption {
    id: string;
    label: string;
    desc: string;
    image?: string;
    color?: string;
    icon?: string;
}

interface QuizStep {
    id: string;
    question: string;
    options: QuizOption[];
}

const QUIZ_STEPS: QuizStep[] = [
    {
        id: "setting",
        question: "Where does your heart lead you?",
        options: [
            { id: "riad", label: "Intimate Riad", desc: "Médina charm & hidden gardens", image: "riad_sunset_wedding" },
            { id: "palace", label: "Grand Palace", desc: "Majestic halls & royal history", image: "moroccan_bride_negafa" },
            { id: "desert", label: "Saharan Dream", desc: "Golden dunes & velvet skies", image: "moroccan_wedding_centerpiece" },
            { id: "luxury", label: "Modern Luxury", desc: "Sleek lines & urban elegance", image: "moroccan_wedding_cake" }
        ]
    },
    {
        id: "palette",
        question: "Which colors sing to your soul?",
        options: [
            { id: "traditional", label: "Royal Crimson & Gold", desc: "The timeless heart of Morocco", color: "bg-[#8B0000]" },
            { id: "boho", label: "Desert Terracotta", desc: "Earthy, warm, and grounded", color: "bg-[#E8472A]" },
            { id: "andalou", label: "Zellige Pastels", desc: "Soft blues & minty freshness", color: "bg-[#A7D7C5]" },
            { id: "minimalist", label: "Pure Pearl & Silver", desc: "Clean, ethereal, and chic", color: "bg-[#F5F5F5]" }
        ]
    },
    {
        id: "vibe",
        question: "The energy of your celebration...",
        options: [
            { id: "extravagant", label: "Legendary Party", desc: "High energy from sunset to dawn", icon: "✨" },
            { id: "intimate", label: "Sacred Union", desc: "Deeply personal and contemplative", icon: "🕯️" },
            { id: "editorial", label: "Fashion Forward", desc: "Magazine-worthy and avant-garde", icon: "📸" },
            { id: "traditional", label: "The Classic Farah", desc: "Strictly adhering to heritage", icon: "🕌" }
        ]
    }
];

export default function InspirationQuiz() {
    const router = useRouter();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [finalPersona, setFinalPersona] = useState<string | null>(null);

    const handleSelect = (optionId: string) => {
        const stepId = QUIZ_STEPS[currentStep].id;
        setAnswers({ ...answers, [stepId]: optionId });
        
        if (currentStep < QUIZ_STEPS.length - 1) {
            setTimeout(() => setCurrentStep(currentStep + 1), 400);
        } else {
            calculateResult();
        }
    };

    const calculateResult = async () => {
        setIsSubmitting(true);
        
        // Logic to determine persona
        let persona = "Traditional Fassi";
        if (answers.setting === "riad" && answers.vibe === "intimate") persona = "Boho Médina";
        if (answers.setting === "desert") persona = "Saharan Nomad";
        if (answers.palette === "minimalist") persona = "Modern Minimalist";
        if (answers.vibe === "editorial") persona = "Modern Saharan";

        setFinalPersona(persona);

        if (user) {
            try {
                // Save to WeddingProfile if user is logged in
                const profileResponse = await apiClient.get<any>("/api/me");
                const profileIri = profileResponse.weddingProfile?.["@id"];
                
                if (profileIri) {
                    await apiClient.patch(profileIri, {
                        stylePersona: persona,
                        quizResults: answers
                    });
                }
            } catch (e) {
                console.error("Failed to save quiz results", e);
            }
        }
        
        setIsSubmitting(false);
    };

    if (finalPersona) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-xl w-full text-center space-y-10"
                >
                    <div className="w-24 h-24 bg-[#E8472A]/10 text-[#E8472A] rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-4">
                        <span className="text-[#717171] uppercase tracking-[0.2em] font-bold text-sm">Your Wedding Persona is</span>
                        <h1 className="font-display text-6xl text-[#1A1A1A]">{finalPersona}</h1>
                        <p className="text-[18px] text-[#717171] leading-relaxed">
                            {finalPersona === "Boho Médina" 
                                ? "Intimate, earthy, and deeply rooted in the magic of old world Morocco with a bohemian twist."
                                : "A majestic celebration of heritage, luxury, and the timeless elegance of Moroccan royalty."}
                        </p>
                    </div>
                    <div className="pt-10 flex flex-col gap-4">
                        <Button asChild size="lg" className="rounded-full bg-[#1A1A1A] text-white h-16 text-lg">
                            <Link href="/inspiration">Explore Your Personalized Hub</Link>
                        </Button>
                        <Button variant="ghost" onClick={() => router.push("/inspiration")} className="text-[#717171]">
                            Maybe later
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const step = QUIZ_STEPS[currentStep];
    const progress = ((currentStep + 1) / QUIZ_STEPS.length) * 100;

    return (
        <div className="min-h-screen bg-white selection:bg-[#E8472A]/30">
            <Head>
                <title>Wedding Style Discovery — Farah.ma</title>
            </Head>

            {/* Navigation */}
            <nav className="fixed top-0 inset-x-0 h-20 px-6 flex items-center justify-between z-50">
                <Button 
                    variant="ghost" 
                    onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : router.back()}
                    className="gap-2 text-[#717171] hover:text-[#1A1A1A]"
                >
                    <ChevronLeft size={18} />
                    Back
                </Button>
                <div className="flex-1 max-w-[200px] h-1 bg-[#F1F1F1] rounded-full mx-10 overflow-hidden">
                    <motion.div 
                        className="h-full bg-[#E8472A]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>
                <div className="w-[100px] text-end font-bold text-[#E8472A]">
                    {currentStep + 1} / {QUIZ_STEPS.length}
                </div>
            </nav>

            <main className="pt-32 pb-20 container mx-auto px-6 max-w-5xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-16"
                    >
                        <div className="space-y-4">
                            <span className="text-[#E8472A] font-bold text-[12px] uppercase tracking-widest flex items-center gap-2">
                                <Sparkles size={14} />
                                Step {currentStep + 1}
                            </span>
                            <h2 className="font-display text-[44px] md:text-[64px] text-[#1A1A1A] leading-tight max-w-3xl">
                                {step.question}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {step.options.map((option) => (
                                <motion.button
                                    key={option.id}
                                    whileHover={{ y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleSelect(option.id)}
                                    className={cn(
                                        "group relative text-start p-8 rounded-[2.5rem] border-2 transition-all duration-300",
                                        answers[step.id] === option.id 
                                            ? "border-[#E8472A] bg-[#E8472A]/5" 
                                            : "border-[#F1F1F1] hover:border-[#1A1A1A] bg-white"
                                    )}
                                >
                                    <div className="flex flex-col gap-6">
                                        {option.image ? (
                                            <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-neutral-100">
                                                <Image 
                                                    src={`/images/inspiration/${option.image}.png`}
                                                    alt={option.label}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : option.color ? (
                                            <div className={cn("w-16 h-16 rounded-full border border-black/5", option.color)} />
                                        ) : (
                                            <div className="w-16 h-16 bg-[#F7F7F7] rounded-2xl flex items-center justify-center text-3xl">
                                                {option.icon}
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <h3 className="font-display text-2xl text-[#1A1A1A]">{option.label}</h3>
                                                <p className="text-[#717171]">{option.desc}</p>
                                            </div>
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                                answers[step.id] === option.id ? "bg-[#E8472A] text-white" : "bg-[#F7F7F7] text-[#1A1A1A] opacity-0 group-hover:opacity-100"
                                            )}>
                                                <ArrowRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}

export async function getStaticProps({ locale }: { locale: string }) {
    return {
        props: {
            ...(await serverSideTranslations(locale || "fr", ["common"])),
        },
    };
}
