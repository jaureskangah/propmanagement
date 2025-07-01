
import React from "react";
import { TenantCard } from "./TenantCard";
import { EmptyTenantState } from "./EmptyTenantState";
import type { Tenant } from "@/types/tenant";

interface TenantListProps {
  tenants: Tenant[];
  selectedTenant: string | null;
  onTenantSelect: (id: string) => void;
  onEditClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
  onInviteClick: (id: string) => void;
}

export const TenantList = ({
  tenants,
  selectedTenant,
  onTenantSelect,
  onEditClick,
  onDeleteClick,
  onInviteClick,
}: TenantListProps) => {
  if (tenants.length === 0) {
    return <EmptyTenantState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
      {tenants.map((tenant) => (
        <TenantCard
          key={tenant.id}
          tenant={tenant}
          isSelected={selectedTenant === tenant.id}
          onSelect={() => onTenantSelect(tenant.id)}
          onEdit={() => onEditClick(tenant.id)}
          onDelete={() => onDeleteClick(tenant.id)}
          onInvite={() => onInviteClick(tenant.id)}
        />
      ))}
    </div>
  );
};
