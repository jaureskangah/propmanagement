
import { Communication } from "@/types/tenant";
import { CommunicationsList } from "../CommunicationsList";

interface CommunicationsListContainerProps {
  filteredCommunications: Communication[];
  groupedCommunications: Record<string, Communication[]>;
  onCommunicationClick: (comm: Communication) => void;
  onToggleStatus: (comm: Communication) => void;
  onDeleteCommunication: (comm: Communication) => void;
  searchTerm?: string;
}

export const CommunicationsListContainer = ({
  filteredCommunications,
  groupedCommunications,
  onCommunicationClick,
  onToggleStatus,
  onDeleteCommunication,
  searchTerm = '',
}: CommunicationsListContainerProps) => {
  console.log("Rendering CommunicationsListContainer with:", {
    filteredCount: filteredCommunications.length,
    groupedKeys: Object.keys(groupedCommunications)
  });

  return (
    <CommunicationsList
      filteredCommunications={filteredCommunications}
      groupedCommunications={groupedCommunications}
      onCommunicationClick={onCommunicationClick}
      onToggleStatus={onToggleStatus}
      onDeleteCommunication={onDeleteCommunication}
      searchTerm={searchTerm}
    />
  );
};
