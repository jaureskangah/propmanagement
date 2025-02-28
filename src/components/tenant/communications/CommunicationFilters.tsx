
import { SearchInput } from "./filters/SearchInput";
import { DateFilter } from "./filters/DateFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Label } from "@/components/ui/label";

interface CommunicationFiltersProps {
  searchQuery: string;
  startDate: string;
  selectedType: string | null;
  communicationTypes: string[];
  onSearchChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onTypeChange: (value: string | null) => void;
}

export const CommunicationFilters = ({
  searchQuery,
  startDate,
  selectedType,
  communicationTypes,
  onSearchChange,
  onDateChange,
  onTypeChange,
}: CommunicationFiltersProps) => {
  const { t } = useLocale();
  
  console.log("CommunicationFilters render:", {
    startDate,
    selectedType,
    types: communicationTypes
  });

  const handleTypeChange = (value: string) => {
    onTypeChange(value === "all" ? null : value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <SearchInput value={searchQuery} onChange={onSearchChange} />
      <DateFilter value={startDate} onChange={onDateChange} />
      
      <div className="min-w-[180px]">
        <Select 
          value={selectedType || "all"} 
          onValueChange={handleTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('filter')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allMessages')}</SelectItem>
            {communicationTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
