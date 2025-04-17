
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
    console.log("Sorted maintenance requests:", sortedRequests);
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
    // Find the most up-to-date version of the request
    const updatedRequest = requestsState.find(r => r.id === request.id) || request;
    console.log("Selected request for dialog:", updatedRequest);
    
    // First set the selected request
    setSelectedRequest(updatedRequest);
    // Then open the dialog
    setTimeout(() => {
      setIsDialogOpen(true);
      console.log("Dialog opened:", isDialogOpen);
    }, 0);
  };

  const handleCloseDialog = () => {
    console.log("Closing maintenance request dialog");
    setIsDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleMaintenanceUpdateAndClose = () => {
    console.log("MaintenanceList: handleMaintenanceUpdateAndClose called");
    // Update the data via the parent callback
    onMaintenanceUpdate();
    
    // Update the selected request if it still exists
    if (selectedRequest) {
      const updatedRequest = [...unsortedRequests]
        .find(r => r.id === selectedRequest.id);
      
      if (updatedRequest) {
        console.log("Updating selected request with latest data:", updatedRequest);
        setSelectedRequest(updatedRequest);
      }
    }
  };

  if (requestsState.length === 0) {
    return <EmptyMaintenanceState />;
  }

  return (
    <>
      <div className="space-y-4">
        {requestsState.map((request) => (
          <MaintenanceRequestItem 
            key={request.id}
            request={request}
            onClick={handleRequestClick}
          />
        ))}
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
