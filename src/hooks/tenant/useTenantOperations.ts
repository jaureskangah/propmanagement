
import { useState } from "react";
import { useTenantAddition } from "./operations/useTenantAddition";
import { useTenantUpdate } from "./operations/useTenantUpdate";
import { useTenantDeletion } from "./operations/useTenantDeletion";

export const useTenantOperations = (refetch: () => void, invalidateCache: () => void) => {
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  
  const { handleAddTenant } = useTenantAddition(refetch);
  const { handleUpdateTenant: updateTenant } = useTenantUpdate(refetch);
  const { handleDeleteTenant } = useTenantDeletion(refetch, invalidateCache);

  const handleUpdateTenant = async (data: any) => {
    await updateTenant(selectedTenant, data);
  };

  const handleDeleteTenantWithData = async (selectedTenantData: any) => {
    await handleDeleteTenant(selectedTenantData);
    setSelectedTenant(null);
  };

  return {
    selectedTenant,
    setSelectedTenant,
    handleAddTenant,
    handleUpdateTenant,
    handleDeleteTenant: handleDeleteTenantWithData,
  };
};
