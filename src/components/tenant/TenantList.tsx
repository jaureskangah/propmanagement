
import type { Tenant } from "@/types/tenant";
import { EmptyTenantState } from "./EmptyTenantState";
import { TenantCard } from "./TenantCard";
import { useLocale } from "@/components/providers/LocaleProvider";

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
  const { t } = useLocale();

  if (!tenants?.length) {
    return <EmptyTenantState />;
  }

  return (
    <div className="space-y-4" role="list" aria-label={t('tenantsList')}>
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
