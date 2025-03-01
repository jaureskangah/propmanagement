
import { CommunicationFilters } from "../CommunicationFilters";
import { Dispatch, SetStateAction } from "react";

interface CommunicationsFilterBarProps {
  searchTerm: string;
  selectedType: string | null;
  selectedDateRange: [Date | null, Date | null];
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string | null) => void;
  onDateRangeChange: Dispatch<SetStateAction<[Date | null, Date | null]>>;
}

export const CommunicationsFilterBar = ({
  searchTerm,
  selectedType,
  selectedDateRange,
  onSearchChange,
  onTypeChange,
  onDateRangeChange
}: CommunicationsFilterBarProps) => {
  console.log("Rendering CommunicationsFilterBar with:", { searchTerm, selectedType, selectedDateRange });
  
  return (
    <CommunicationFilters
      searchQuery={searchTerm}
      startDate={selectedDateRange[0] ? selectedDateRange[0].toISOString() : ""}
      selectedType={selectedType}
      communicationTypes={["general", "maintenance", "urgent", "payment"]}
      onSearchChange={onSearchChange}
      onDateChange={() => {}} // This is a placeholder as we're using the date range picker
      onTypeChange={onTypeChange}
    />
  );
};
