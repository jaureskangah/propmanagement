
import { useMemo } from "react";
import { Communication } from "@/types/tenant";
import { useCommunicationsFilter } from "./hooks/useCommunicationsFilter";
import { CommunicationsTabs } from "./components/CommunicationsTabs";

interface CommunicationsContentProps {
  communications: Communication[];
  onToggleStatus: (comm: Communication) => void;
  onCommunicationSelect: (comm: Communication) => void;
  onCommunicationUpdate?: () => void;
  onDeleteCommunication: (comm: Communication) => void;
  tenantId: string;
}

export const CommunicationsContent = ({
  communications,
  onToggleStatus,
  onCommunicationSelect,
  onCommunicationUpdate,
  onDeleteCommunication,
  tenantId
}: CommunicationsContentProps) => {
  const {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    selectedDate,
    setSelectedDate,
    showAll,
    toggleShowAll,
    filteredCommunications,
    displayedCommunications,
    displayedGroupedCommunications,
    unreadCount,
    urgentCount,
    INITIAL_DISPLAY_COUNT
  } = useCommunicationsFilter(communications);

  return (
    <div className="px-6 pb-6">
      <CommunicationsTabs
        communications={communications}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        unreadCount={unreadCount}
        urgentCount={urgentCount}
        showAll={showAll}
        toggleShowAll={toggleShowAll}
        filteredCommunications={filteredCommunications}
        displayedCommunications={displayedCommunications}
        displayedGroupedCommunications={displayedGroupedCommunications}
        initialDisplayCount={INITIAL_DISPLAY_COUNT}
        onCommunicationSelect={onCommunicationSelect}
        onToggleStatus={onToggleStatus}
        onDeleteCommunication={onDeleteCommunication}
      />
    </div>
  );
};
