
import { useState, useEffect } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useSearchParams } from "react-router-dom";
import { MaintenanceRequest } from "./types";
import { MaintenanceRequestItem } from "./request/MaintenanceRequestItem";
import { EmptyMaintenanceState } from "./request/EmptyMaintenanceState";
import { MaintenanceRequestDialog } from "./request/MaintenanceRequestDialog";

interface MaintenanceListProps {
  requests: MaintenanceRequest[];
  onMaintenanceUpdate: () => void;
}

export const MaintenanceList = ({ 
  requests: unsortedRequests,
  onMaintenanceUpdate 
}: MaintenanceListProps) => {
  const { t } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [requestsState, setRequestsState] = useState<MaintenanceRequest[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sort requests by creation date (most recent first)
  useEffect(() => {
    // Deep copy of requests to avoid shared references
    const sortedRequests = [...unsortedRequests].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    setRequestsState(sortedRequests);
    console.log("Sorted maintenance requests:", sortedRequests.length);
  }, [unsortedRequests]);

  // Check if there's a request ID in the URL parameters
  useEffect(() => {
    const requestId = searchParams.get('request');
    if (requestId) {
      console.log("Found request ID in URL params:", requestId);
      const request = requestsState.find(r => r.id === requestId);
      if (request) {
        console.log("Found matching request:", request);
        setSelectedRequest(request);
        setIsDialogOpen(true);
      } else {
        console.log("No matching request found for ID:", requestId);
      }
      
      // Clean up the parameters after use
      setSearchParams(prev => {
        prev.delete('request');
        return prev;
      });
    }
  }, [searchParams, requestsState, setSearchParams]);

  const handleRequestClick = (request: MaintenanceRequest) => {
    console.log("Maintenance request clicked:", request.id);
    
    // First set the selected request
    setSelectedRequest(request);
    
    // Then explicitly open the dialog with a short delay
    // This ensures React has time to process the state update
    setTimeout(() => {
      setIsDialogOpen(true);
      console.log("Dialog opened, state set to:", true);
    }, 50);
  };

  const handleCloseDialog = () => {
    console.log("Closing maintenance request dialog");
    // First close the dialog
    setIsDialogOpen(false);
    // Then clear the selected request after a short delay
    setTimeout(() => {
      setSelectedRequest(null);
    }, 100);
  };

  const handleMaintenanceUpdateAndClose = () => {
    console.log("MaintenanceList: handleMaintenanceUpdateAndClose called");
    // Update the data via the parent callback
    onMaintenanceUpdate();
  };

  return (
    <>
      <div className="space-y-4">
        {requestsState.length > 0 ? (
          requestsState.map((request) => (
            <MaintenanceRequestItem 
              key={request.id}
              request={request}
              onClick={handleRequestClick}
            />
          ))
        ) : (
          <EmptyMaintenanceState />
        )}
      </div>

      {selectedRequest && (
        <MaintenanceRequestDialog
          request={selectedRequest}
          onClose={handleCloseDialog}
          onUpdate={handleMaintenanceUpdateAndClose}
          open={isDialogOpen}
        />
      )}
    </>
  );
};
