import { motion, AnimatePresence } from "framer-motion";
import { useArticleReactions, ReactionType } from "@/hooks/useArticleReactions";
import { cn } from "@/lib/utils";

const REACTIONS: Array<{ type: ReactionType; emoji: string; label: string; color: string }> = [
    { type: "love",   emoji: "❤️", label: "Inspirant",   color: "text-rose-500 bg-rose-50 border-rose-200" },
    { type: "useful", emoji: "🤔", label: "Très utile",  color: "text-amber-600 bg-amber-50 border-amber-200" },
    { type: "wow",    emoji: "✨", label: "Époustouflant", color: "text-violet-600 bg-violet-50 border-violet-200" },
];

interface ArticleReactionsProps {
    articleId: number;
    className?: string;
}

export default function ArticleReactions({ articleId, className }: ArticleReactionsProps) {
    const { userReaction, counts, react } = useArticleReactions(articleId);

    return (
        <div className={cn("py-10 border-t border-neutral-100", className)}>
            <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-5 text-center">
                Cet article vous a inspiré ?
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
                {REACTIONS.map(({ type, emoji, label, color }) => {
                    const active = userReaction === type;
                    return (
                        <motion.button
                            key={type}
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => react(type)}
                            className={cn(
                                "flex items-center gap-3 px-5 py-3 rounded-full border transition-all duration-200 font-semibold text-[14px]",
                                active
                                    ? cn(color, "shadow-md")
                                    : "border-neutral-200 text-neutral-500 bg-white hover:border-neutral-300 hover:bg-neutral-50"
                            )}
                            aria-pressed={active}
                            aria-label={`Réagir avec ${label}`}
                        >
                            <span className="text-xl leading-none" role="img" aria-hidden="true">
                                {emoji}
                            </span>
                            <span>{label}</span>
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={counts[type]}
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 4 }}
                                    className={cn(
                                        "text-[12px] font-bold tabular-nums",
                                        active ? "opacity-100" : "text-neutral-400"
                                    )}
                                >
                                    {counts[type].toLocaleString("fr-MA")}
                                </motion.span>
                            </AnimatePresence>
                        </motion.button>
                    );
                })}
            </div>

            {userReaction && (
                <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-[12px] text-neutral-400 mt-4"
                >
                    Merci pour votre réaction 🙏
                </motion.p>
            )}
        </div>
    );
}
