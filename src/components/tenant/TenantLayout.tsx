
import { Card } from "@/components/ui/card";
import TenantProfile from "@/components/TenantProfile";
import { TenantList } from "@/components/tenant/TenantList";
import { TenantSearch, SearchFilters } from "@/components/tenant/TenantSearch";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft } from "lucide-react";
import type { Tenant } from "@/types/tenant";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";

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
  const isMobile = useIsMobile();
  const showList = !isMobile || !selectedTenant;
  const showDetails = !isMobile || selectedTenant;
  const { t } = useLocale();

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-3'} gap-6`}>
      {showList && (
        <div className="lg:col-span-1 space-y-4">
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
      )}

      {showDetails && (
        <div className="lg:col-span-2">
          {isMobile && selectedTenant && (
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => onTenantSelect("")}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t('back')}
            </Button>
          )}
          
          {selectedTenantData ? (
            <TenantProfile tenant={selectedTenantData} />
          ) : (
            <Card className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">{t('selectTenantToView')}</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
