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
    selectedType, 
    startDate ? new Date(startDate) : null
  );

  console.log("CommunicationsContent render:", {
    totalCommunications: communications.length,
    filteredCount: filteredCommunications.length,
    selectedType,
    startDate,
    communications
  });

  const categories = ["general", "urgent", "maintenance", "payment"];

  return (
    <CardContent>
      <div className="space-y-4">
        <CommunicationFilters
          searchQuery={searchQuery}
          startDate={startDate}
          selectedType={selectedType}
          communicationTypes={categories}
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