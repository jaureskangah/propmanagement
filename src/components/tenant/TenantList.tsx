
import { useState } from "react";
import { TenantCard } from "./TenantCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tenant } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { UserRoundSearch } from "lucide-react";

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
  const [loadedCount, setLoadedCount] = useState(3);
  
  // Simulate progressive loading for better UX
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop <= e.currentTarget.clientHeight + 200;
    if (bottom && loadedCount < tenants.length) {
      setTimeout(() => {
        setLoadedCount(prev => Math.min(prev + 3, tenants.length));
      }, 300);
    }
  };
  
  // Reset loaded count when tenants change
  useState(() => {
    setLoadedCount(Math.min(3, tenants.length));
  });

  if (tenants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-muted/30 rounded-lg border-2 border-dashed">
        <UserRoundSearch className="h-12 w-12 text-muted-foreground/50" />
        <div>
          <h3 className="font-medium">{t('noTenants')}</h3>
          <p className="text-sm text-muted-foreground mt-1">{t('noTenantsFiltered')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-6" onScroll={handleScroll}>
      {tenants.slice(0, loadedCount).map((tenant) => (
        <TenantCard
          key={tenant.id}
          tenant={tenant}
          isSelected={selectedTenant === tenant.id}
          onSelect={onTenantSelect}
          onEdit={onEditClick}
          onDelete={onDeleteClick}
        />
      ))}
      
      {loadedCount < tenants.length && (
        <div className="space-y-3">
          {[...Array(Math.min(2, tenants.length - loadedCount))].map((_, index) => (
            <Skeleton key={index} className="h-36 w-full rounded-md" />
          ))}
        </div>
      )}
    </div>
  );
};
