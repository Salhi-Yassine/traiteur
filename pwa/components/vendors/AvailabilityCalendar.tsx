import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "next-i18next";

interface DateRange {
  from: string | null;
  to: string | null;
}

interface AvailabilityCalendarProps {
  bookedDates?: string[];
  range?: DateRange;
  onRangeSelect?: (range: DateRange) => void;
  variant?: "default" | "compact";
}

export default function AvailabilityCalendar({
  bookedDates = [],
  range = { from: null, to: null },
  onRangeSelect,
  variant = "default",
}: AvailabilityCalendarProps) {
  const { t, i18n } = useTranslation("common");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const isCompact = variant === "compact";

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth, year, month };
  };

  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

  const dayNames = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      // 2024-01-07 was a Sunday
      const date = new Date(2024, 0, 7 + i);
      return date.toLocaleDateString(i18n.language, { weekday: 'short' });
    });
  }, [i18n.language]);

  const handleDateClick = (dateStr: string) => {
    if (!onRangeSelect) return;

    if (!range.from || (range.from && range.to)) {
      // Start new range
      onRangeSelect({ from: dateStr, to: null });
    } else {
      // Complete range
      const fromDate = new Date(range.from);
      const toDate = new Date(dateStr);

      if (toDate < fromDate) {
        onRangeSelect({ from: dateStr, to: null });
      } else {
        onRangeSelect({ from: range.from, to: dateStr });
      }
    }
  };

  const renderMonth = (date: Date) => {
    const { firstDay, daysInMonth, year, month } = getDaysInMonth(date);
    const monthName = date.toLocaleDateString(i18n.language, { month: "long", year: "numeric" });
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay }, (_, i) => i);

    return (
      <div className="flex-1 min-w-[300px]">
        <h3 className="text-base font-bold text-neutral-900 mb-6 capitalize text-center">
          {monthName}
        </h3>
        <div className="grid grid-cols-7 gap-y-0">
          {dayNames.map((d) => (
            <div key={d} className="text-[10px] font-black uppercase tracking-widest text-neutral-400 text-center pb-4">
              {d}
            </div>
          ))}
          {blanks.map((b) => (
            <div key={`blank-${b}`} />
          ))}
          {days.map((day) => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isBooked = bookedDates.includes(dateStr);
            const isStart = range.from === dateStr;
            const isEnd = range.to === dateStr;
            const isToday = new Date().toISOString().split('T')[0] === dateStr;
            
            // Range highlight logic
            let isInRange = false;
            let isHoverRange = false;

            if (range.from && range.to) {
              isInRange = dateStr > range.from && dateStr < range.to;
            } else if (range.from && hoveredDate) {
               isHoverRange = dateStr > range.from && dateStr <= hoveredDate;
            }

            return (
              <div 
                key={day} 
                className={cn(
                  "relative h-12 flex items-center justify-center",
                  (isInRange || isHoverRange) && "bg-neutral-100",
                  isStart && range.to && "rounded-s-full bg-neutral-100",
                  isEnd && "rounded-e-full bg-neutral-100"
                )}
              >
                <button
                  disabled={isBooked}
                  onClick={() => handleDateClick(dateStr)}
                  onMouseEnter={() => !range.to && setHoveredDate(dateStr)}
                  onMouseLeave={() => setHoveredDate(null)}
                  className={cn(
                    "relative h-10 w-10 flex items-center justify-center text-sm font-bold transition-all rounded-full border-2 border-transparent",
                    isBooked 
                      ? "text-neutral-300 line-through cursor-not-allowed font-medium" 
                      : "text-neutral-900 hover:border-neutral-900 cursor-pointer",
                    (isStart || isEnd) && "bg-neutral-900 text-white hover:bg-neutral-800 border-neutral-900 z-10",
                    isToday && !isStart && !isEnd && !isInRange && !isHoverRange && "text-primary ring-1 ring-primary/20 bg-primary/5"
                  )}
                >
                  {day}
                  {isToday && !isStart && !isEnd && (
                    <span className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handlePrev = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNext = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="w-full bg-white">
      {!isCompact && (
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
              {t("vendor_profile.availability.title")}
            </h2>
            <p className="text-sm text-neutral-500 font-medium">
              {t("vendor_profile.availability.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrev}
              className="p-2 rounded-full hover:bg-neutral-100 transition-colors border border-neutral-200 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
            <button 
              onClick={handleNext}
              className="p-2 rounded-full hover:bg-neutral-100 transition-colors border border-neutral-200 shadow-sm"
            >
              <ChevronRight className="w-5 h-5 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {isCompact && (
        <div className="flex items-center justify-between mb-4">
           <button onClick={handlePrev} className="p-1 hover:bg-neutral-100 rounded-full transition-colors">
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
           </button>
           <button onClick={handleNext} className="p-1 hover:bg-neutral-100 rounded-full transition-colors">
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
           </button>
        </div>
      )}

      <div className={cn(
        "flex flex-col gap-12 lg:gap-16",
        isCompact ? "lg:flex-row gap-0" : "lg:flex-row gap-16"
      )}>
        {renderMonth(currentMonth)}
        {!isCompact && (
          <div className="hidden lg:block">
            {renderMonth(nextMonth)}
          </div>
        )}
      </div>

      {!isCompact && (
        <div className="mt-10 flex flex-wrap items-center gap-6 text-xs font-bold text-neutral-500 border-t border-neutral-100 pt-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-neutral-200 bg-white" />
            <span>{t("vendor_profile.availability.available")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neutral-900" />
            <span>{t("vendor_profile.availability.selected")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden">
              <div className="w-full h-[1px] bg-neutral-300 rotate-45 scale-150" />
            </div>
            <span>{t("vendor_profile.availability.unavailable")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
