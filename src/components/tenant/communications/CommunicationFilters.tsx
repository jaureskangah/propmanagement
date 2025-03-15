
import { useState } from "react";
import { Search, Calendar as CalendarIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useLocale } from "@/components/providers/LocaleProvider";

interface CommunicationFiltersProps {
  searchQuery: string;
  selectedType: string | null;
  startDate: string;
  communicationTypes: string[];
  onSearchChange: (value: string) => void;
  onTypeChange: (type: string | null) => void;
  onDateChange: (date: string) => void;
}

export const CommunicationFilters = ({
  searchQuery,
  selectedType,
  startDate,
  communicationTypes,
  onSearchChange,
  onTypeChange,
  onDateChange,
}: CommunicationFiltersProps) => {
  const { t } = useLocale();
  const [date, setDate] = useState<Date | undefined>(
    startDate ? new Date(startDate) : undefined
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleResetDate = () => {
    setDate(undefined);
    onDateChange("");
  };

  const handleSelectDate = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      onDateChange(date.toISOString());
    } else {
      onDateChange("");
    }
  };

  const handleTypeClick = (type: string) => {
    if (selectedType === type) {
      onTypeChange(null);
    } else {
      onTypeChange(type);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("searchMessages")}
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-9 w-full"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-7 w-7 p-0"
            onClick={() => onSearchChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "min-w-[180px] justify-start text-left font-normal",
              date && "text-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : t("filterByDate")}
            {date && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleResetDate();
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelectDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2">
        {communicationTypes.map((type) => (
          <Badge
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            className={cn(
              "cursor-pointer capitalize",
              selectedType === type
                ? type === "urgent"
                  ? "bg-red-500 hover:bg-red-600"
                  : type === "maintenance"
                  ? "bg-amber-500 hover:bg-amber-600"
                  : type === "payment"
                  ? "bg-green-500 hover:bg-green-600"
                  : ""
                : ""
            )}
            onClick={() => handleTypeClick(type)}
          >
            {t(type)}
          </Badge>
        ))}
        {selectedType && (
          <Badge
            variant="outline"
            className="cursor-pointer bg-transparent hover:bg-destructive/10"
            onClick={() => onTypeChange(null)}
          >
            <X className="h-3 w-3 mr-1" />
            {t("clearFilter")}
          </Badge>
        )}
      </div>
    </div>
  );
};
