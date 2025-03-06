
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { DateFilter } from "./DateFilter";
import { TypeFilter } from "./TypeFilter";
import { useLocale } from "@/components/providers/LocaleProvider";
import { SearchInput } from "./SearchInput";

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
      <SearchInput value={searchQuery} onChange={onSearchChange} />
      
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
