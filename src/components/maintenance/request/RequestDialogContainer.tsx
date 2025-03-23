
import React from "react";
import { MaintenanceRequest } from "../types";
import { MaintenanceRequestDialog } from "./MaintenanceRequestDialog";

interface RequestDialogContainerProps {
  selectedRequest: MaintenanceRequest | null;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

export const RequestDialogContainer: React.FC<RequestDialogContainerProps> = ({
  selectedRequest,
  onClose,
  onUpdateSuccess
}) => {
  if (!selectedRequest) return null;
  
  return (
    <MaintenanceRequestDialog
      request={selectedRequest}
      onClose={onClose}
      onUpdateSuccess={onUpdateSuccess}
    />
  );
};
