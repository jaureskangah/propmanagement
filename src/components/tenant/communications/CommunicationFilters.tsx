
import { useState } from "react";
import { Search, Calendar as CalendarIcon, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useLocale } from "@/components/providers/LocaleProvider";
import { fr, enUS } from 'date-fns/locale';
import { SortOrderFilter } from "./filters/SortOrderFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CommunicationFiltersProps {
  searchQuery: string;
  selectedType: string | null;
  startDate: string;
  sortOrder: "newest" | "oldest";
  communicationTypes: string[];
  onSearchChange: (value: string) => void;
  onTypeChange: (type: string | null) => void;
  onDateChange: (date: string) => void;
  onSortOrderChange: (order: "newest" | "oldest") => void;
}

export const CommunicationFilters = ({
  searchQuery,
  selectedType,
  startDate,
  sortOrder,
  communicationTypes,
  onSearchChange,
  onTypeChange,
  onDateChange,
  onSortOrderChange,
}: CommunicationFiltersProps) => {
  const { t, language } = useLocale();
  const [date, setDate] = useState<Date | undefined>(
    startDate ? new Date(startDate) : undefined
  );
  
  const dateLocale = language === 'fr' ? fr : enUS;
  const [filtersExpanded, setFiltersExpanded] = useState(false);

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

  const handleTypeChange = (value: string) => {
    onTypeChange(value === "all" ? null : value);
  };

  const toggleFilters = () => {
    setFiltersExpanded(!filtersExpanded);
  };

  return (
    <div className="flex flex-col gap-3 bg-background rounded-lg p-3 shadow-sm border border-border">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Barre de recherche */}
        <div className="relative flex-1 min-w-[200px]">
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

        {/* Filtre de tri */}
        <SortOrderFilter sortOrder={sortOrder} onSortOrderChange={onSortOrderChange} />

        {/* Bouton pour afficher/masquer les filtres supplémentaires sur mobile */}
        <Button
          variant="outline"
          size="sm"
          className="md:hidden"
          onClick={toggleFilters}
        >
          <Filter className="h-4 w-4 mr-2" />
          {t("filter")}
        </Button>

        {/* Filtres toujours visibles sur desktop */}
        <div className="hidden md:flex items-center gap-3">
          {/* Filtre de date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  date && "text-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: dateLocale }) : t("filterByDate")}
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
                locale={dateLocale}
              />
            </PopoverContent>
          </Popover>

          {/* Filtre de type */}
          <Select 
            value={selectedType || "all"} 
            onValueChange={handleTypeChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t("selectCategory")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allMessages")}</SelectItem>
              {communicationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {t(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filtres supplémentaires pour mobile, affichés uniquement si développés */}
      {filtersExpanded && (
        <div className="flex flex-col md:hidden gap-3 mt-2 pt-2 border-t">
          {/* Filtre de date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-full",
                  date && "text-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: dateLocale }) : t("filterByDate")}
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
                locale={dateLocale}
              />
            </PopoverContent>
          </Popover>

          {/* Filtre de type */}
          <Select 
            value={selectedType || "all"} 
            onValueChange={handleTypeChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("selectCategory")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allMessages")}</SelectItem>
              {communicationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {t(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Affichage des filtres actifs */}
      {(selectedType || date) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedType && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 capitalize"
            >
              {t(selectedType)}
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 ml-1"
                onClick={() => onTypeChange(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {date && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1"
            >
              {format(date, "PPP", { locale: dateLocale })}
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 ml-1"
                onClick={handleResetDate}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground text-xs h-6"
            onClick={() => {
              onTypeChange(null);
              handleResetDate();
            }}
          >
            {t("clearFilter")}
          </Button>
        </div>
      )}
    </div>
  );
};
