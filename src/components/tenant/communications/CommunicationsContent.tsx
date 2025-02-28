
import { useState } from "react";
import { Communication } from "@/types/tenant";
import { CardContent } from "@/components/ui/card";
import { useCommunicationsData } from "@/hooks/communications/useCommunicationsData";
import { useCommunicationActions } from "@/hooks/communications/useCommunicationActions";
import { CommunicationsFilterBar } from "./filters/CommunicationsFilterBar";
import { CommunicationsListContainer } from "./list/CommunicationsListContainer";

interface CommunicationsContentProps {
  communications: Communication[];
  onToggleStatus: (comm: Communication) => void;
  onCommunicationSelect: (comm: Communication | null) => void;
  onCommunicationUpdate?: () => void;
  tenantId?: string;
}

export const CommunicationsContent = ({
  communications,
  onToggleStatus,
  onCommunicationSelect,
  onCommunicationUpdate,
  tenantId
}: CommunicationsContentProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");

  const { handleDeleteCommunication } = useCommunicationActions(tenantId);

  const {
    groupedCommunications,
    communicationTypes,
    filteredCommunications
  } = useCommunicationsData(
    communications, 
    searchQuery, 
    selectedType, 
    startDate ? new Date(startDate) : null
  );

  const handleDelete = async (comm: Communication) => {
    console.log("Attempting to delete communication:", comm.id);
    const success = await handleDeleteCommunication(comm.id);
    if (success) {
      console.log("Communication deleted successfully");
      if (onCommunicationUpdate) {
        onCommunicationUpdate();
      }
    }
  };

  const handleCommunicationClick = (comm: Communication) => {
    console.log("Communication clicked:", comm.id);
    onCommunicationSelect(comm);
  };

  console.log("CommunicationsContent render:", {
    totalCommunications: communications.length,
    filteredCount: filteredCommunications.length,
    selectedType,
    startDate
  });

  return (
    <CardContent>
      <div className="space-y-4">
        <CommunicationsFilterBar
          searchQuery={searchQuery}
          startDate={startDate}
          selectedType={selectedType}
          communicationTypes={communicationTypes}
          onSearchChange={setSearchQuery}
          onDateChange={setStartDate}
          onTypeChange={setSelectedType}
        />

        <CommunicationsListContainer
          filteredCommunications={filteredCommunications}
          groupedCommunications={groupedCommunications}
          onCommunicationClick={handleCommunicationClick}
          onToggleStatus={onToggleStatus}
          onDeleteCommunication={handleDelete}
        />
      </div>
    </CardContent>
  );
};
