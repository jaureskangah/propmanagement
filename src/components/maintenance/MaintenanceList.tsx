
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

  const requests = [...unsortedRequests].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  useEffect(() => {
    const requestId = searchParams.get('request');
    if (requestId) {
      const request = requests.find(r => r.id === requestId);
      if (request) {
        setSelectedRequest(request);
      }
      setSearchParams(prev => {
        prev.delete('request');
        return prev;
      });
    }
  }, [searchParams, requests, setSearchParams]);

  const handleRequestClick = (request: MaintenanceRequest) => {
    console.log("Maintenance request clicked:", request.id);
    setSelectedRequest(request);
  };

  const handleCloseDialog = () => {
    setSelectedRequest(null);
  };

  const handleMaintenanceUpdateAndClose = () => {
    onMaintenanceUpdate();
    // Nous gardons le dialogue ouvert pour permettre à l'utilisateur de continuer à voir les messages
  };

  if (requests.length === 0) {
    return <EmptyMaintenanceState />;
  }

  return (
    <>
      <div className="space-y-4">
        {requests.map((request) => (
          <MaintenanceRequestItem 
            key={request.id}
            request={request}
            onClick={handleRequestClick}
          />
        ))}
      </div>

      <MaintenanceRequestDialog
        request={selectedRequest}
        onClose={handleCloseDialog}
        onUpdate={handleMaintenanceUpdateAndClose}
      />
    </>
  );
};
