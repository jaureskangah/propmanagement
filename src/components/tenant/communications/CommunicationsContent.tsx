import { useState } from "react";
import { Communication } from "@/types/tenant";
import { CardContent } from "@/components/ui/card";
import { CommunicationFilters } from "./CommunicationFilters";
import { CommunicationsList } from "./CommunicationsList";
import { useCommunicationsData } from "@/hooks/communications/useCommunicationsData";
import { useCommunicationState } from "@/hooks/communications/useCommunicationState";

interface CommunicationsContentProps {
  communications: Communication[];
  onToggleStatus: (comm: Communication) => void;
  onCommunicationSelect: (comm: Communication | null) => void;
}

export const CommunicationsContent = ({
  communications,
  onToggleStatus,
  onCommunicationSelect
}: CommunicationsContentProps) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    startDate,
    setStartDate,
  } = useCommunicationState();

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
          onCommunicationClick={onCommunicationSelect}
          onToggleStatus={onToggleStatus}
        />
      </div>
    </CardContent>
  );
};