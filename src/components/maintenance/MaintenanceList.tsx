
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

  // Trier les demandes par date de création (les plus récentes en premier)
  useEffect(() => {
    // Copie profonde des demandes pour éviter des références partagées
    const sortedRequests = [...unsortedRequests].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    setRequestsState(sortedRequests);
    console.log("Sorted maintenance requests:", sortedRequests);
  }, [unsortedRequests]);

  // Vérifier s'il y a un ID de demande dans les paramètres d'URL
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
      
      // Nettoyer les paramètres après utilisation
      setSearchParams(prev => {
        prev.delete('request');
        return prev;
      });
    }
  }, [searchParams, requestsState, setSearchParams]);

  const handleRequestClick = (request: MaintenanceRequest) => {
    console.log("Maintenance request clicked:", request.id);
    // Trouver la version la plus à jour de la demande
    const updatedRequest = requestsState.find(r => r.id === request.id) || request;
    console.log("Selected request for dialog:", updatedRequest);
    setSelectedRequest(updatedRequest);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    console.log("Closing maintenance request dialog");
    setIsDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleMaintenanceUpdateAndClose = () => {
    console.log("MaintenanceList: handleMaintenanceUpdateAndClose called");
    // Mettre à jour les données via le callback parent
    onMaintenanceUpdate();
    
    // Mettre à jour la demande sélectionnée si elle existe encore
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

      {selectedRequest && isDialogOpen && (
        <MaintenanceRequestDialog
          request={selectedRequest}
          onClose={handleCloseDialog}
          onUpdate={handleMaintenanceUpdateAndClose}
        />
      )}
    </>
  );
};
