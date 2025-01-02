import type { Tenant } from "@/types/tenant";
import { EmptyTenantState } from "./EmptyTenantState";
import { TenantCard } from "./TenantCard";

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
  if (!tenants?.length) {
    return <EmptyTenantState />;
  }

  return (
    <div className="space-y-4">
      {tenants.map((tenant) => (
        <TenantCard
          key={tenant.id}
          tenant={tenant}
          isSelected={selectedTenant === tenant.id}
          onSelect={onTenantSelect}
          onEdit={onEditClick}
          onDelete={onDeleteClick}
        />
      ))}
    </div>
  );
};