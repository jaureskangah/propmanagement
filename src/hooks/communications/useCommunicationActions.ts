
import { useCreateCommunicationAction } from "./useCreateCommunicationAction";
import { useStatusToggleAction } from "./useStatusToggleAction";
import { useDeleteCommunicationAction } from "./useDeleteCommunicationAction";
import { Communication } from "@/types/tenant";

export const useCommunicationActions = (tenantId?: string) => {
  const { handleCreateCommunication } = useCreateCommunicationAction(tenantId);
  const { handleToggleStatus } = useStatusToggleAction();
  const { handleDeleteCommunication } = useDeleteCommunicationAction();

  return {
    handleCreateCommunication,
    handleToggleStatus,
    handleDeleteCommunication
  };
};
