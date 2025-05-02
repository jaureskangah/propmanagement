
import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
  className?: string;
  align?: "start" | "center" | "end";
  locale?: string;
}

export function DateRangePicker({
  value,
  onChange,
  className,
  align = "start",
  locale = "fr",
}: DateRangePickerProps) {
  const localeObj = locale === 'fr' ? fr : enUS;
  const placeholderText = locale === 'fr' ? "Sélectionner une période" : "Select a date range";
  
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y", { locale: localeObj })} -{" "}
                  {format(value.to, "LLL dd, y", { locale: localeObj })}
                </>
              ) : (
                format(value.from, "LLL dd, y", { locale: localeObj })
              )
            ) : (
              <span>{placeholderText}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
            locale={localeObj}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
