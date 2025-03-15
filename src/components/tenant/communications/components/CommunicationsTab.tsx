
import { Communication } from "@/types/tenant";
import { CommunicationsListContainer } from "../list/CommunicationsListContainer";
import { ShowMoreLessButton } from "./ShowMoreLessButton";

interface CommunicationsTabProps {
  displayedCommunications: Communication[];
  displayedGroupedCommunications: Record<string, Communication[]>;
  filteredCommunications: Communication[];
  showAll: boolean;
  toggleShowAll: () => void;
  initialDisplayCount: number;
  onCommunicationClick: (comm: Communication) => void;
  onToggleStatus: (comm: Communication) => void;
  onDeleteCommunication: (comm: Communication) => void;
}

export const CommunicationsTab = ({
  displayedCommunications,
  displayedGroupedCommunications,
  filteredCommunications,
  showAll,
  toggleShowAll,
  initialDisplayCount,
  onCommunicationClick,
  onToggleStatus,
  onDeleteCommunication
}: CommunicationsTabProps) => {
  return (
    <div className="space-y-4">
      <CommunicationsListContainer
        filteredCommunications={displayedCommunications}
        groupedCommunications={displayedGroupedCommunications}
        onCommunicationClick={onCommunicationClick}
        onToggleStatus={onToggleStatus}
        onDeleteCommunication={onDeleteCommunication}
      />
      <ShowMoreLessButton
        showAll={showAll}
        toggleShowAll={toggleShowAll}
        totalCount={filteredCommunications.length}
        initialDisplayCount={initialDisplayCount}
      />
    </div>
  );
};
