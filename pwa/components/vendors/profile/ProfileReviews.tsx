import { useState } from "react";
import { useTranslation } from "next-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ReviewData } from "./ProfileTypes";

interface ProfileReviewsProps {
    reviews: ReviewData[];
    rating: number;
    reviewCount: number;
}

export default function ProfileReviews({ reviews, rating, reviewCount }: ProfileReviewsProps) {
    const { t } = useTranslation("common");
    const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());
    const [showAllReviews, setShowAllReviews] = useState(false);

    const toggleReview = (id: number) => {
        setExpandedReviews(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <div id="avis" className="py-12 border-t border-neutral-200 mt-12 scroll-mt-24">
            <div className="flex items-center gap-2 mb-10">
                 <svg className="w-6 h-6 text-primary fill-primary" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
                </svg>
                <h3 className="font-display text-3xl font-black text-neutral-900">
                    {rating} · {reviewCount} {t("vendor_profile.reviews.count", "avis")}
                </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {reviews.slice(0, showAllReviews ? reviews.length : 2).map((review) => (
                    <div key={review.id} className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center font-black text-neutral-900">
                                {review.author?.firstName[0]}
                            </div>
                            <div>
                                <p className="font-bold text-neutral-900">{review.author?.firstName} {review.author?.lastName[0]}.</p>
                                <p className="text-xs text-neutral-500">{new Date(review.createdAt).toLocaleDateString('fr-MA', { month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>
                        <p className={cn("text-neutral-700 leading-relaxed font-medium", expandedReviews.has(review.id) ? "" : "line-clamp-3")}>&quot;{review.body}&quot;</p>
                        {!expandedReviews.has(review.id) && review.body.length > 150 && (
                            <button
                                onClick={() => toggleReview(review.id)}
                                className="text-sm font-black underline underline-offset-4"
                            >
                                {t("common.show_more")}
                            </button>
                        )}
                    </div>
                ))}
            </div>
            
            {reviewCount > 2 && (
                <Button
                    variant="outline"
                    onClick={() => setShowAllReviews(prev => !prev)}
                    className="mt-12 rounded-xl border-neutral-900 h-12 px-8 font-bold hover:bg-neutral-100 transition-all shadow-sm"
                >
                    {showAllReviews
                        ? t("common.show_less")
                        : t("vendor_profile.reviews.show_all", { count: reviewCount })}
                </Button>
            )}
        </div>
    );
}
