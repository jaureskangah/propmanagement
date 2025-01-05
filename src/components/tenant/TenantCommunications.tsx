import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Communication } from "@/types/tenant";
import { CommunicationsList } from "./communications/CommunicationsList";
import { CommunicationFilters } from "./communications/CommunicationFilters";
import { NewCommunicationDialog } from "./communications/NewCommunicationDialog";
import { CommunicationDetailsDialog } from "./communications/CommunicationDetailsDialog";
import { CommunicationsHeader } from "./communications/header/CommunicationsHeader";
import { useCommunicationState } from "@/hooks/communications/useCommunicationState";
import { useCommunicationActions } from "@/hooks/communications/useCommunicationActions";
import { useMemo } from "react";

interface TenantCommunicationsProps {
  communications: Communication[];
  tenantId: string;
  onCommunicationUpdate?: () => void;
}

export const TenantCommunications = ({ 
  communications, 
  tenantId,
  onCommunicationUpdate 
}: TenantCommunicationsProps) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    startDate,
    setStartDate,
    isNewCommDialogOpen,
    setIsNewCommDialogOpen,
    selectedComm,
    setSelectedComm,
    newCommData,
    setNewCommData
  } = useCommunicationState();

  const { handleCreateCommunication, handleToggleStatus } = useCommunicationActions(tenantId);

  // Group communications by type
  const groupedCommunications = useMemo(() => {
    return communications.reduce((acc, comm) => {
      if (!acc[comm.type]) {
        acc[comm.type] = [];
      }
      acc[comm.type].push(comm);
      return acc;
    }, {} as Record<string, Communication[]>);
  }, [communications]);

  // Get unique communication types
  const communicationTypes = useMemo(() => {
    return Array.from(new Set(communications.map(comm => comm.type)));
  }, [communications]);

  // Filter communications based on search, type, and date
  const filteredCommunications = useMemo(() => {
    let filtered = communications;

    if (searchQuery) {
      filtered = filtered.filter(comm => 
        comm.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(comm => comm.type === selectedType);
    }

    if (startDate) {
      filtered = filtered.filter(comm => 
        new Date(comm.created_at) >= new Date(startDate)
      );
    }

    return filtered;
  }, [communications, searchQuery, selectedType, startDate]);

  const handleCreateSubmit = async () => {
    console.log("Attempting to create communication with tenantId:", tenantId);
    const success = await handleCreateCommunication(newCommData);
    if (success) {
      setIsNewCommDialogOpen(false);
      setNewCommData({ type: "", subject: "", content: "", category: "general" });
      onCommunicationUpdate?.();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CommunicationsHeader 
          onNewClick={() => setIsNewCommDialogOpen(true)}
        />
      </CardHeader>
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
            onCommunicationClick={setSelectedComm}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </CardContent>

      <NewCommunicationDialog
        isOpen={isNewCommDialogOpen}
        onClose={() => setIsNewCommDialogOpen(false)}
        newCommData={newCommData}
        onDataChange={setNewCommData}
        onSubmit={handleCreateSubmit}
      />

      <CommunicationDetailsDialog
        communication={selectedComm}
        onClose={() => setSelectedComm(null)}
      />
    </Card>
  );
};