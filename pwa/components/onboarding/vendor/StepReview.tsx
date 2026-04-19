import { Check, Edit2, MapPin, Store } from "lucide-react";
import { useTranslation } from "next-i18next";
import { WizardValues, City, Category } from "./WizardTypes";

interface StepReviewProps {
    values: WizardValues;
    cities: City[];
    categories: Category[];
    setStage: (stage: number) => void;
    setScreen: (screen: number) => void;
}

export default function StepReview({
    values,
    cities,
    categories,
    setStage,
    setScreen,
}: StepReviewProps) {
    const { t } = useTranslation("common");

    const categoryName = categories.find(c => `/api/categories/${c.id}` === values.category)?.name || values.category;
    const cityNames = values.cities.map(iri => cities.find(c => `/api/cities/${c.id}` === iri)?.name).filter(Boolean);

    const blocks = [
        { 
            title: t("onboarding.review.activity"), 
            stage: 1, screen: 0,
            items: [
                { label: t("onboarding.fields.category"), value: categoryName },
                { label: t("onboarding.fields.business_name"), value: values.businessName },
                { label: t("onboarding.fields.tagline"), value: values.tagline || t("common.none") },
            ]
        },
        { 
            title: t("onboarding.review.location_price"), 
            stage: 2, screen: 0,
            items: [
                { label: t("onboarding.fields.cities"), value: cityNames.join(", ") },
                { label: t("onboarding.fields.price_range"), value: values.priceRange },
                { label: t("onboarding.fields.starting_price"), value: values.startingPrice ? `${values.startingPrice} MAD` : t("common.none") },
            ]
        },
        { 
            title: t("onboarding.review.contact"), 
            stage: 2, screen: 2,
            items: [
                { label: t("onboarding.fields.whatsapp"), value: values.whatsapp },
                { label: t("onboarding.fields.website"), value: values.website || t("common.none") },
            ]
        }
    ];

    return (
        <div className="space-y-10">
            <div className="mb-8">
                <h1 className="font-display text-[32px] leading-tight text-[#1A1A1A] mb-2">
                    {t("onboarding.fields.review_question")}
                </h1>
                <p className="text-[15px] text-[#717171] leading-relaxed">{t("onboarding.fields.review_sub")}</p>
            </div>

            <div className="space-y-6">
                {blocks.map((block, i) => (
                    <div key={i} className="p-6 rounded-2xl border-2 border-[#EBEBEB] bg-white">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-100">
                            <h3 className="font-bold text-[16px] text-[#1A1A1A]">{block.title}</h3>
                            <button
                                type="button"
                                onClick={() => { setStage(block.stage); setScreen(block.screen); }}
                                className="p-2 rounded-full hover:bg-neutral-100 text-[#E8472A] transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {block.items.map((item, j) => (
                                <div key={j} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                    <span className="text-[14px] text-[#717171]">{item.label}</span>
                                    <span className="text-[14px] font-semibold text-[#1A1A1A]">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 rounded-2xl bg-[#FEF0ED] border border-[#E8472A]/20 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-[#E8472A]" />
                </div>
                <div>
                    <p className="text-[14px] font-bold text-[#1A1A1A] mb-0.5">{t("onboarding.review.final_title")}</p>
                    <p className="text-[13px] text-[#717171] leading-relaxed">{t("onboarding.review.final_sub")}</p>
                </div>
            </div>
        </div>
    );
}
