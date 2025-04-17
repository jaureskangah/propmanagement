
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
  const [dialogOpen, setDialogOpen] = useState(false);

  // Sort requests by creation date (most recent first)
  useEffect(() => {
    const sortedRequests = [...unsortedRequests].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    setRequestsState(sortedRequests);
    console.log(`Sorted ${sortedRequests.length} maintenance requests`);
  }, [unsortedRequests]);

  // Check if there's a request ID in the URL parameters
  useEffect(() => {
    const requestId = searchParams.get('request');
    if (requestId) {
      console.log(`Looking for request with ID: ${requestId}`);
      const request = requestsState.find(r => r.id === requestId);
      
      if (request) {
        console.log(`Found request, opening dialog for: ${request.issue}`);
        setSelectedRequest(request);
        setDialogOpen(true);
      }
      
      // Clean up URL parameters
      setSearchParams(prev => {
        prev.delete('request');
        return prev;
      });
    }
  }, [searchParams, requestsState, setSearchParams]);

  const openRequestDialog = (request: MaintenanceRequest) => {
    console.log(`Opening dialog for request: ${request.id} - ${request.issue}`);
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const closeRequestDialog = () => {
    console.log("Closing maintenance request dialog");
    setDialogOpen(false);
    // Clear the selected request after the dialog animation finishes
    setTimeout(() => setSelectedRequest(null), 300);
  };

  const handleMaintenanceUpdateAndClose = () => {
    console.log("Updating maintenance requests and closing dialog");
    onMaintenanceUpdate();
    closeRequestDialog();
  };

  return (
    <>
      <div className="space-y-4">
        {requestsState.length > 0 ? (
          requestsState.map((request) => (
            <MaintenanceRequestItem 
              key={request.id}
              request={request}
              onClick={() => openRequestDialog(request)}
            />
          ))
        ) : (
          <EmptyMaintenanceState />
        )}
      </div>

      {selectedRequest && (
        <MaintenanceRequestDialog
          request={selectedRequest}
          onClose={closeRequestDialog}
          onUpdate={handleMaintenanceUpdateAndClose}
          open={dialogOpen}
        />
      )}
    </>
  );
};
