
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
    <div className="flex flex-col gap-6 pb-12">
      {showList && (
        <div className="w-full space-y-5">
          <div className="sticky top-4 z-10 mb-4 bg-background/80 backdrop-blur-sm py-2">
            <TenantSearch 
              value={searchQuery}
              onChange={onSearchChange}
              onFilterChange={onFilterChange}
              filters={searchFilters}
            />
          </div>

          <div className="pb-8 w-full">
            <TenantList
              tenants={filteredTenants || []}
              selectedTenant={selectedTenant}
              onTenantSelect={onTenantSelect}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
            />
          </div>
        </div>
      )}

      {showDetails && (
        <div className="w-full">
          {isMobile && selectedTenant && (
            <Button
              variant="outline"
              size="sm"
              className="mb-4 flex items-center"
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
