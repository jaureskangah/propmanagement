
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { DateFilter } from "./DateFilter";
import { TypeFilter } from "./TypeFilter";
import { useLocale } from "@/components/providers/LocaleProvider";

interface FilterControlsProps {
  searchQuery: string;
  startDate: string;
  selectedType: string | null;
  communicationTypes: string[];
  onSearchChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onTypeChange: (value: string | null) => void;
  filtersApplied: boolean;
  onClearFilters: () => void;
}

export const FilterControls = ({
  searchQuery,
  startDate,
  selectedType,
  communicationTypes,
  onSearchChange,
  onDateChange,
  onTypeChange,
  filtersApplied,
  onClearFilters
}: FilterControlsProps) => {
  const { t } = useLocale();
  
  return (
    <div className="flex flex-col md:flex-row gap-3 bg-muted/30 p-3 rounded-lg">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={t('searchMessages')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
      
      <DateFilter 
        value={startDate} 
        onChange={onDateChange} 
      />
      
      <TypeFilter
        value={selectedType}
        onChange={onTypeChange}
        types={communicationTypes}
      />
      
      {filtersApplied && (
        <Button variant="ghost" size="sm" onClick={onClearFilters} className="flex-shrink-0">
          <X className="h-4 w-4 mr-2" />
          {t('clearFilter')}
        </Button>
      )}
    </div>
  );
};
