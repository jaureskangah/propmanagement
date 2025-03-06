
import { Communication } from "@/types/tenant";
import { CommunicationsList } from "./CommunicationsList";
import { useEffect, useState } from "react";
import { FilterControls } from "./filters/FilterControls";
import { FilterBadges } from "./filters/FilterBadges";
import { useLocale } from "@/components/providers/LocaleProvider";
import { AlertTriangle, Clock, Mail, MessageSquare } from "lucide-react";

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
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);

  useEffect(() => {
    setFiltersApplied(!!startDate || !!selectedType);
  }, [startDate, selectedType]);

  const filteredCommunications = communications.filter(comm => {
    if (!comm) return false;
    
    const matchesType = !selectedType || comm.type === selectedType;
    
    let matchesDate = true;
    if (startDate) {
      const commDate = new Date(comm.created_at);
      const filterDate = new Date(startDate);
      if (commDate < filterDate) {
        matchesDate = false;
      }
    }
    
    return matchesType && matchesDate;
  });

  const groupedCommunications = filteredCommunications.reduce((acc, comm) => {
    if (!comm) return acc;
    
    if (!acc[comm.type]) {
      acc[comm.type] = [];
    }
    
    acc[comm.type].push(comm);
    return acc;
  }, {} as Record<string, Communication[]>);

  // Extract unique communication types for the filter
  const communicationTypes = [...new Set(communications.map(comm => comm.type))];

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'urgent':
        return <AlertTriangle className="h-3 w-3 text-red-500" />;
      case 'maintenance':
        return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'email':
        return <Mail className="h-3 w-3 text-blue-500" />;
      case 'message':
        return <MessageSquare className="h-3 w-3 text-green-500" />;
      default:
        return <MessageSquare className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const clearFilters = () => {
    setStartDate("");
    setSelectedType(null);
  };

  return (
    <div className="space-y-4">
      <FilterControls
        startDate={startDate}
        selectedType={selectedType}
        communicationTypes={communicationTypes}
        onDateChange={setStartDate}
        onTypeChange={setSelectedType}
        filtersApplied={filtersApplied}
        onClearFilters={clearFilters}
      />
      
      <FilterBadges
        startDate={startDate}
        selectedType={selectedType}
        onClearDate={() => setStartDate("")}
        onClearType={() => setSelectedType(null)}
        getTypeIcon={getTypeIcon}
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
