import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useTranslation } from "next-i18next";
import PriceRange from "../ui/PriceRange";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import AvailabilityCalendar from "./AvailabilityCalendar";
import { Flame, Users } from "lucide-react";

interface DateRange {
  from: string | null;
  to: string | null;
}

interface ReservationWidgetProps {
  vendorId: number;
  vendorName: string;
  priceRange: string;
  range?: DateRange;
  onRangeChange?: (range: DateRange) => void;
  bookedDates?: string[];
}

export default function ReservationWidget({ 
  vendorId, 
  vendorName, 
  priceRange,
  range = { from: null, to: null },
  onRangeChange,
  bookedDates = []
}: ReservationWidgetProps) {
  const { t, i18n } = useTranslation("common");
  const [submitted, setSubmitted] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Use native browser Intl for date formatting
  const getBrowserLocale = () => {
    const lang = i18n.language || "fr";
    if (lang === "ary") return "ar-MA";
    return lang;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleRangeSelect = (newRange: DateRange) => {
    onRangeChange?.(newRange);
    if (newRange.from && newRange.to) {
      setIsCalendarOpen(false);
    }
  };

  const formatShortDate = (dateStr: string) => {
    return new Intl.DateTimeFormat(getBrowserLocale(), { day: '2-digit', month: 'short' }).format(new Date(dateStr));
  };

  const displayFrom = range.from 
    ? formatShortDate(range.from) 
    : t("vendor_profile.reservation.add_date");
    
  const displayTo = range.to 
    ? formatShortDate(range.to) 
    : t("vendor_profile.reservation.add_date");

  if (submitted) {
    return (
      <Card className="sticky top-32 overflow-hidden border border-neutral-200 shadow-3 rounded-xl bg-white p-6 md:p-8">
        <CardContent className="p-0 text-center space-y-6">
          <div className="w-16 h-16 bg-success-bg text-success rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-display text-2xl font-black text-neutral-900">
            {t("vendor_profile.reservation.request_sent", "Demande envoyée !")}
          </h3>
          <p className="text-sm text-neutral-500 leading-relaxed">
            {t("vendor_profile.reservation.success_desc", { name: vendorName })}
          </p>
          <Button 
            className="w-full mt-4 rounded-xl h-12 font-bold" 
            variant="outline" 
            onClick={() => setSubmitted(false)}
          >
            {t("vendor_profile.reservation.another_request", "Faire une autre demande")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-32 overflow-hidden border border-neutral-200 shadow-3 rounded-xl bg-white">
      <CardHeader className="p-6 md:p-8 pb-4 space-y-4">
        <div className="flex items-baseline justify-between">
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">
              {t("vendor_card.starting_at")}
            </span>
            <PriceRange value={priceRange} label className="text-neutral-900 font-black text-xl" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 md:p-8 pt-0">
        {/* Social Proof / Urgency Badge */}
        <div className="mb-6 p-3 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-700">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Users className="w-4 h-4 text-orange-600" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
            </div>
            <span className="text-[11px] font-bold text-orange-700">
              {(vendorId % 8) + 3} personnes consultent ce profil
            </span>
          </div>
          <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 border border-neutral-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-neutral-900 transition-all">
            <div className="border-b border-neutral-300">
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <div className="flex items-center w-full cursor-pointer divide-x rtl:divide-x-reverse divide-neutral-300 group">
                    <button 
                      type="button"
                      className="flex-1 p-3 text-start hover:bg-neutral-50 transition-colors focus:outline-none"
                    >
                      <Label className="text-[8px] font-black uppercase tracking-widest text-neutral-900 block cursor-pointer mb-1">
                        {t("vendor_profile.reservation.check_in")}
                      </Label>
                      <span className={`text-[13px] font-medium ${range.from ? 'text-neutral-900' : 'text-neutral-400'}`}>
                        {displayFrom}
                      </span>
                    </button>
                    <button 
                      type="button"
                      className="flex-1 p-3 text-start hover:bg-neutral-50 transition-colors focus:outline-none"
                    >
                      <Label className="text-[8px] font-black uppercase tracking-widest text-neutral-900 block cursor-pointer mb-1">
                        {t("vendor_profile.reservation.check_out")}
                      </Label>
                      <span className={`text-[13px] font-medium ${range.to ? 'text-neutral-900' : 'text-neutral-400'}`}>
                        {displayTo}
                      </span>
                    </button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[380px] p-4 bg-white shadow-2xl border-neutral-200" align="end">
                  <AvailabilityCalendar 
                    variant="compact"
                    range={range}
                    onRangeSelect={handleRangeSelect}
                    bookedDates={bookedDates}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="p-3">
              <Label htmlFor="guests" className="text-[9px] font-black uppercase tracking-widest text-neutral-900">
                {t("nav.guests")}
              </Label>
              <Input 
                id="guests" 
                type="number" 
                placeholder="Ex: 200" 
                required 
                className="border-none shadow-none focus-visible:ring-0 h-8 p-0 text-sm font-medium bg-transparent text-start"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <Button 
              type="submit" 
              className="w-full h-14 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-base transition-all active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!range.from || !range.to}
            >
              {t("vendor_profile.reservation.reserve")}
            </Button>
            
            <p className="text-[11px] text-center text-neutral-500 font-medium">
              {t("vendor_profile.reservation.no_payment")}
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-neutral-200">
             <div className="flex items-center justify-between text-sm text-neutral-700">
                <span className="underline decoration-neutral-300">
                  {t("vendor_profile.reservation.service_fee")}
                </span>
                <span>0 {t("common.currency")}</span>
             </div>
             <div className="flex items-center justify-between font-bold text-neutral-900 mt-4 pt-4 border-t border-neutral-200">
                <span>{t("vendor_profile.reservation.total_estimated")}</span>
                <span>{t("vendor_profile.reservation.to_be_confirmed")}</span>
             </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
