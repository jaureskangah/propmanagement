import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { SearchInput } from "./filters/SearchInput";
import { DateFilter } from "./filters/DateFilter";

interface CommunicationFiltersProps {
  searchQuery: string;
  startDate: string;
  selectedType: string | null;
  communicationTypes: string[];
  onSearchChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

export const CommunicationFilters = ({
  searchQuery,
  startDate,
  onSearchChange,
  onDateChange,
}: CommunicationFiltersProps) => {
  console.log("CommunicationFilters render:", {
    startDate
  });

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <SearchInput value={searchQuery} onChange={onSearchChange} />
      <DateFilter value={startDate} onChange={onDateChange} />
    </div>
  );
};