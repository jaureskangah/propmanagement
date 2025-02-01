import { CommunicationFilters } from "../CommunicationFilters";

interface CommunicationsFilterBarProps {
  searchQuery: string;
  startDate: string;
  selectedType: string | null;
  communicationTypes: string[];
  onSearchChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onTypeChange: (value: string | null) => void;
}

export const CommunicationsFilterBar = ({
  searchQuery,
  startDate,
  selectedType,
  communicationTypes,
  onSearchChange,
  onDateChange,
  onTypeChange
}: CommunicationsFilterBarProps) => {
  console.log("Rendering CommunicationsFilterBar with:", { searchQuery, selectedType, startDate });
  
  return (
    <CommunicationFilters
      searchQuery={searchQuery}
      startDate={startDate}
      selectedType={selectedType}
      communicationTypes={communicationTypes}
      onSearchChange={onSearchChange}
      onDateChange={onDateChange}
      onTypeChange={onTypeChange}
    />
  );
};