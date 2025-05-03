
import { useState } from "react";
import { MaintenanceRequest } from "@/types/tenant";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useNotification } from "@/hooks/useNotification";

export const useMaintenanceActions = (onDataUpdate: () => void) => {
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { t } = useLocale();
  const { showSuccess, showError } = useNotification();

  const handleViewDetails = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setIsDetailSheetOpen(true);
  };

  const handleDeleteMaintenance = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;
      
      setIsDeleteDialogOpen(false);
      setIsDetailSheetOpen(false);
      setSelectedRequest(null);
      
      showSuccess('maintenanceRequestDeleted');
      
      onDataUpdate();
    } catch (error) {
      console.error('Error deleting maintenance request:', error);
      showError('failedToDelete', error);
    }
  };

  return {
    selectedRequest,
    isDetailSheetOpen,
    setIsDetailSheetOpen,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleViewDetails,
    handleDeleteMaintenance
  };
};
