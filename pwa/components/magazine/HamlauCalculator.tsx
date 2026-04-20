import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { Users, Coffee, Cake } from "lucide-react";

interface CalculatorResult {
    teaLiters: number;
    pastryKg: number;
    datesKg: number;
}

function calculate(guests: number): CalculatorResult {
    return {
        teaLiters: Math.ceil(guests * 0.25),
        pastryKg: Math.ceil(guests * 0.15),
        datesKg: Math.ceil(guests * 0.08),
    };
}

export default function HamlauCalculator() {
    const { t } = useTranslation("common");
    const [guestCount, setGuestCount] = useState<string>("");
    const result = guestCount && parseInt(guestCount) > 0 ? calculate(parseInt(guestCount)) : null;

    return (
        <div className="my-10 bg-[#FEF0ED] rounded-[24px] p-6 md:p-8 border border-primary/10">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="font-display text-[#1A1A1A] text-[18px] md:text-[20px]">
                        {t("magazine.hamlau_calculator.title")}
                    </h3>
                    <p className="text-[#717171] text-[13px]">{t("magazine.hamlau_calculator.subtitle")}</p>
                </div>
            </div>

            {/* Input */}
            <div className="flex items-center gap-3 mb-5">
                <div className="relative flex-1 max-w-[200px]">
                    <Users className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B0B0B0]" />
                    <input
                        type="number"
                        min="1"
                        max="2000"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        placeholder={t("magazine.hamlau_calculator.guest_count_placeholder")}
                        className="w-full ps-9 pe-4 py-3 text-[14px] bg-white border border-[#E0E0E0] rounded-[12px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                        aria-label={t("magazine.hamlau_calculator.guest_count_label")}
                    />
                </div>
                <span className="text-[#717171] text-[13px] shrink-0">
                    {t("magazine.hamlau_calculator.guest_count_label")}
                </span>
            </div>

            {/* Results */}
            {result && (
                <div className="grid grid-cols-3 gap-3 mb-5">
                    <ResultCard
                        icon={<Coffee className="w-5 h-5 text-primary" />}
                        value={result.teaLiters}
                        unit={t("magazine.hamlau_calculator.tea_unit")}
                        label={t("magazine.hamlau_calculator.tea_label")}
                    />
                    <ResultCard
                        icon={<Cake className="w-5 h-5 text-primary" />}
                        value={result.pastryKg}
                        unit={t("magazine.hamlau_calculator.pastry_unit")}
                        label={t("magazine.hamlau_calculator.pastry_label")}
                    />
                    <ResultCard
                        icon={<span className="text-[20px]">🌴</span>}
                        value={result.datesKg}
                        unit={t("magazine.hamlau_calculator.dates_unit")}
                        label={t("magazine.hamlau_calculator.dates_label")}
                    />
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-[#B0B0B0] text-[11px] italic">
                    * {t("magazine.hamlau_calculator.note")}
                </p>
                <Link
                    href="/vendors?category.slug=catering"
                    className="shrink-0 bg-primary hover:bg-primary-dark text-white text-[13px] font-bold px-5 py-2.5 rounded-[12px] transition-colors duration-200"
                >
                    {t("magazine.hamlau_calculator.cta")}
                </Link>
            </div>
        </div>
    );
}

interface ResultCardProps {
    icon: React.ReactNode;
    value: number;
    unit: string;
    label: string;
}

function ResultCard({ icon, value, unit, label }: ResultCardProps) {
    return (
        <div className="bg-white rounded-[16px] p-3 text-center shadow-sm border border-white">
            <div className="flex justify-center mb-1">{icon}</div>
            <div className="font-bold text-[22px] text-[#1A1A1A] leading-tight">
                {value}
                <span className="text-[12px] font-normal text-[#717171] ms-1">{unit}</span>
            </div>
            <div className="text-[10px] text-[#B0B0B0] uppercase tracking-wide mt-0.5">{label}</div>
        </div>
    );
}
