
import { Communication } from "@/types/tenant";
import { CommunicationsList } from "./CommunicationsList";
import { useEffect, useState } from "react";
import { CommunicationFilters } from "./CommunicationFilters";
import { useLocale } from "@/components/providers/LocaleProvider";

interface CommunicationsContentProps {
  communications: Communication[];
  onCommunicationSelect: (comm: Communication) => void;
  onToggleStatus: (comm: Communication) => void;
  onDeleteCommunication: (comm: Communication) => void;
  tenantId: string;
  onCommunicationUpdate?: () => void;
}

export const CommunicationsContent = ({
  communications,
  onCommunicationSelect,
  onToggleStatus,
  onDeleteCommunication,
  tenantId,
  onCommunicationUpdate,
}: CommunicationsContentProps) => {
  const { t } = useLocale();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined,
  });

  const filteredCommunications = communications.filter(comm => {
    if (!comm) return false;
    
    const matchesSearch = searchTerm === "" || 
      (comm.subject?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       comm.content?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory || comm.category === selectedCategory;
    const matchesType = !selectedType || comm.type === selectedType;
    
    let matchesDate = true;
    if (dateRange.from || dateRange.to) {
      const commDate = new Date(comm.created_at);
      if (dateRange.from && commDate < dateRange.from) {
        matchesDate = false;
      }
      if (dateRange.to) {
        const endDate = new Date(dateRange.to);
        endDate.setHours(23, 59, 59, 999); // End of day
        if (commDate > endDate) {
          matchesDate = false;
        }
      }
    }
    
    return matchesSearch && matchesCategory && matchesType && matchesDate;
  });

  const groupedCommunications = filteredCommunications.reduce((acc, comm) => {
    if (!comm) return acc;
    
    if (!acc[comm.type]) {
      acc[comm.type] = [];
    }
    
    acc[comm.type].push(comm);
    return acc;
  }, {} as Record<string, Communication[]>);

  return (
    <div className="space-y-6">
      <CommunicationFilters
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
        onCategoryChange={setSelectedCategory}
        selectedCategory={selectedCategory}
        onTypeChange={setSelectedType}
        selectedType={selectedType}
        onDateRangeChange={setDateRange}
        dateRange={dateRange}
        communications={communications}
      />
      
      <CommunicationsList
        filteredCommunications={filteredCommunications}
        groupedCommunications={groupedCommunications}
        onCommunicationClick={onCommunicationSelect}
        onToggleStatus={onToggleStatus}
        onDeleteCommunication={onDeleteCommunication}
      />
    </div>
  );
};
