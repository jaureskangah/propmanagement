
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useLocale } from "@/components/providers/LocaleProvider";

interface DateFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const DateFilter = ({ value, onChange }: DateFilterProps) => {
  const { locale, t } = useLocale();
  
  const dateLocale = locale === 'fr' ? fr : enUS;
  const date = value ? new Date(value) : undefined;

  const handleDateChange = (newDate: Date | undefined) => {
    onChange(newDate ? newDate.toISOString() : '');
  };

  const handleClearDate = () => {
    onChange('');
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 border-dashed flex items-center gap-1"
          >
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            {date ? (
              <span>{format(date, "PPP", { locale: dateLocale })}</span>
            ) : (
              <span className="text-muted-foreground">{t('filterByDate')}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
            locale={dateLocale}
          />
          {date && (
            <div className="flex justify-end px-4 pb-2">
              <Button variant="ghost" size="sm" onClick={handleClearDate}>
                {t('clearFilter')}
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};
