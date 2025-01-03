import { SearchInput } from "./filters/SearchInput";
import { TypeFilter } from "./filters/TypeFilter";
import { DateFilter } from "./filters/DateFilter";

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
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <SearchInput value={searchQuery} onChange={onSearchChange} />
      <TypeFilter 
        value={selectedType} 
        types={communicationTypes} 
        onChange={onTypeChange} 
      />
      <DateFilter value={startDate} onChange={onDateChange} />
    </div>
  );
};