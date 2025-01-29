import { useState } from "react";
import { Communication } from "@/types/tenant";
import { CardContent } from "@/components/ui/card";
import { CommunicationFilters } from "./CommunicationFilters";
import { CommunicationsList } from "./CommunicationsList";
import { useCommunicationsData } from "@/hooks/communications/useCommunicationsData";
import { useCommunicationActions } from "@/hooks/communications/useCommunicationActions";
import { CommunicationDetailsDialog } from "./CommunicationDetailsDialog";

interface CommunicationsContentProps {
  communications: Communication[];
  onToggleStatus: (comm: Communication) => void;
  onCommunicationSelect: (comm: Communication | null) => void;
  onCommunicationUpdate?: () => void;
}

export const CommunicationsContent = ({
  communications,
  onToggleStatus,
  onCommunicationSelect,
  onCommunicationUpdate
}: CommunicationsContentProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [selectedComm, setSelectedComm] = useState<Communication | null>(null);

  const { handleDeleteCommunication } = useCommunicationActions();

  const {
    groupedCommunications,
    communicationTypes,
    filteredCommunications
  } = useCommunicationsData(
    communications, 
    searchQuery, 
    null, 
    startDate ? new Date(startDate) : null
  );

  const handleDelete = async (comm: Communication) => {
    const success = await handleDeleteCommunication(comm.id);
    if (success) {
      onCommunicationUpdate?.();
    }
  };

  const handleCommunicationClick = (comm: Communication) => {
    console.log("Communication clicked:", comm);
    setSelectedComm(comm);
    onCommunicationSelect(comm);
  };

  console.log("CommunicationsContent render:", {
    totalCommunications: communications.length,
    filteredCount: filteredCommunications.length,
    selectedType,
    startDate,
    communications: communications.map(c => ({
      id: c.id,
      subject: c.subject,
      category: c.category,
      created_at: c.created_at
    }))
  });

  return (
    <CardContent>
      <div className="space-y-4">
        <CommunicationFilters
          searchQuery={searchQuery}
          startDate={startDate}
          selectedType={selectedType}
          communicationTypes={communicationTypes}
          onSearchChange={setSearchQuery}
          onDateChange={setStartDate}
          onTypeChange={setSelectedType}
        />

        <CommunicationsList
          filteredCommunications={filteredCommunications}
          groupedCommunications={groupedCommunications}
          onCommunicationClick={handleCommunicationClick}
          onToggleStatus={onToggleStatus}
          onDeleteCommunication={handleDelete}
        />

        <CommunicationDetailsDialog
          communication={selectedComm}
          onClose={() => setSelectedComm(null)}
        />
      </div>
    </CardContent>
  );
};