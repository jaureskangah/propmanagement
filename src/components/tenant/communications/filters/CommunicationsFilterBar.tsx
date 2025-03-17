
import { CommunicationFilters } from "../CommunicationFilters";
import { Dispatch, SetStateAction } from "react";

interface CommunicationsFilterBarProps {
  searchTerm: string;
  selectedType: string | null;
  selectedDateRange: [Date | null, Date | null];
  sortOrder: "newest" | "oldest";
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string | null) => void;
  onDateRangeChange: Dispatch<SetStateAction<[Date | null, Date | null]>>;
  onSortOrderChange: (order: "newest" | "oldest") => void;
}

export const CommunicationsFilterBar = ({
  searchTerm,
  selectedType,
  selectedDateRange,
  sortOrder,
  onSearchChange,
  onTypeChange,
  onDateRangeChange,
  onSortOrderChange
}: CommunicationsFilterBarProps) => {
  console.log("Rendering CommunicationsFilterBar with:", { searchTerm, selectedType, selectedDateRange, sortOrder });
  
  return (
    <CommunicationFilters
      searchQuery={searchTerm}
      startDate={selectedDateRange[0] ? selectedDateRange[0].toISOString() : ""}
      selectedType={selectedType}
      sortOrder={sortOrder}
      communicationTypes={["general", "maintenance", "urgent", "payment"]}
      onSearchChange={onSearchChange}
      onDateChange={() => {}} // This is a placeholder as we're using the date range picker
      onTypeChange={onTypeChange}
      onSortOrderChange={onSortOrderChange}
    />
  );
};
