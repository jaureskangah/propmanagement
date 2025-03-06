
import { useState, useEffect } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { AlertTriangle, Clock, Mail, MessageSquare } from "lucide-react";
import { FilterControls } from "./filters/FilterControls";
import { FilterBadges } from "./filters/FilterBadges";

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
  const [filtersApplied, setFiltersApplied] = useState(false);
  
  useEffect(() => {
    setFiltersApplied(!!searchQuery || !!startDate || !!selectedType);
  }, [searchQuery, startDate, selectedType]);
  
  const handleTypeChange = (value: string | null) => {
    onTypeChange(value);
  };
  
  const handleDateChange = (value: string) => {
    onDateChange(value);
  };
  
  const handleSearchChange = (value: string) => {
    onSearchChange(value);
  };
  
  const clearFilters = () => {
    onSearchChange("");
    onDateChange("");
    onTypeChange(null);
  };
  
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />;
      case 'maintenance':
        return <Clock className="h-4 w-4 text-yellow-500 mr-2" />;
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500 mr-2" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-green-500 mr-2" />;
      default:
        return <MessageSquare className="h-4 w-4 text-muted-foreground mr-2" />;
    }
  };

  return (
    <div className="space-y-4">
      <FilterControls
        searchQuery={searchQuery}
        startDate={startDate}
        selectedType={selectedType}
        communicationTypes={communicationTypes}
        onSearchChange={handleSearchChange}
        onDateChange={handleDateChange}
        onTypeChange={handleTypeChange}
        filtersApplied={filtersApplied}
        onClearFilters={clearFilters}
      />
      
      <FilterBadges
        searchQuery={searchQuery}
        startDate={startDate}
        selectedType={selectedType}
        onClearSearch={() => handleSearchChange("")}
        onClearDate={() => handleDateChange("")}
        onClearType={() => handleTypeChange(null)}
        getTypeIcon={getTypeIcon}
      />
    </div>
  );
};
