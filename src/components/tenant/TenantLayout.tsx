import { Card } from "@/components/ui/card";
import TenantProfile from "@/components/TenantProfile";
import { TenantList } from "@/components/tenant/TenantList";
import { TenantSearch, SearchFilters } from "@/components/tenant/TenantSearch";
import type { Tenant } from "@/types/tenant";

interface TenantLayoutProps {
  filteredTenants: Tenant[];
  selectedTenant: string | null;
  searchQuery: string;
  searchFilters: SearchFilters;
  onSearchChange: (value: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
  onTenantSelect: (id: string) => void;
  onEditClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
  selectedTenantData: Tenant | null;
}

export const TenantLayout = ({
  filteredTenants,
  selectedTenant,
  searchQuery,
  searchFilters,
  onSearchChange,
  onFilterChange,
  onTenantSelect,
  onEditClick,
  onDeleteClick,
  selectedTenantData,
}: TenantLayoutProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="mb-4">
          <TenantSearch 
            value={searchQuery}
            onChange={onSearchChange}
            onFilterChange={onFilterChange}
          />
        </div>

        <TenantList
          tenants={filteredTenants || []}
          selectedTenant={selectedTenant}
          onTenantSelect={onTenantSelect}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
      </div>

      <div className="lg:col-span-2">
        {selectedTenantData ? (
          <TenantProfile tenant={selectedTenantData} />
        ) : (
          <Card className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Select a tenant to view details</p>
          </Card>
        )}
      </div>
    </div>
  );
};