
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DateFilter } from "./DateFilter";
import { TypeFilter } from "./TypeFilter";
import { useLocale } from "@/components/providers/LocaleProvider";

interface FilterControlsProps {
  startDate: string;
  selectedType: string | null;
  communicationTypes: string[];
  onDateChange: (value: string) => void;
  onTypeChange: (value: string | null) => void;
  filtersApplied: boolean;
  onClearFilters: () => void;
}

export const FilterControls = ({
  startDate,
  selectedType,
  communicationTypes,
  onDateChange,
  onTypeChange,
  filtersApplied,
  onClearFilters
}: FilterControlsProps) => {
  const { t } = useLocale();
  
  return (
    <div className="flex flex-col md:flex-row gap-3 bg-muted/30 p-3 rounded-lg">
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
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearFilters} 
          className="flex-shrink-0 mt-2 md:mt-0"
          type="button"
        >
          <X className="h-4 w-4 mr-2" />
          {t('clearFilter')}
        </Button>
      )}
    </div>
  );
};
