
import { useEffect } from "react";
import { EmptyTenantState } from "./EmptyTenantState";
import { VirtualizedTenantList } from "./VirtualizedTenantList";
import type { Tenant } from "@/types/tenant";

interface TenantListProps {
  tenants: Tenant[];
  selectedTenant: string | null;
  onTenantSelect: (id: string) => void;
  onEditClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

export const TenantList = ({
  tenants,
  selectedTenant,
  onTenantSelect,
  onEditClick,
  onDeleteClick,
}: TenantListProps) => {
  // Add debugging to help with performance optimization
  useEffect(() => {
    console.log(`TenantList rendering with ${tenants.length} tenants`);
  }, [tenants.length]);
  
  if (tenants.length === 0) {
    return <EmptyTenantState />;
  }

  return (
    <VirtualizedTenantList
      tenants={tenants}
      selectedTenant={selectedTenant}
      onTenantSelect={onTenantSelect}
      onEditClick={onEditClick}
      onDeleteClick={onDeleteClick}
    />
  );
};
