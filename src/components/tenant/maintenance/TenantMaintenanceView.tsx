
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MaintenanceList } from "./components/MaintenanceList";
import { AddMaintenanceDialog } from "./AddMaintenanceDialog";
import { MaintenanceFilters } from "./components/MaintenanceFilters";
import { MaintenanceDetailSheet } from "./components/MaintenanceDetailSheet"; 
import { MaintenanceStats } from "./components/MaintenanceStats";
import { MaintenanceSearch } from "./components/MaintenanceSearch";
import { useTenantMaintenance } from "./hooks/useTenantMaintenance";
import { MaintenanceHeader } from "./components/MaintenanceHeader";

export const TenantMaintenanceView = () => {
  const { t } = useLocale();
  const {
    requests,
    totalRequests,
    pendingRequests,
    resolvedRequests,
    tenantId,
    isAddDialogOpen,
    setIsAddDialogOpen,
    selectedRequest,
    isDetailSheetOpen,
    setIsDetailSheetOpen,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    handleMaintenanceUpdate,
    handleViewDetails
  } = useTenantMaintenance();

  if (!tenantId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            {t('notLinkedToTenant')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <MaintenanceHeader onAddClick={() => setIsAddDialogOpen(true)} />
      
      <Card>
        <CardContent className="space-y-6 pt-6">
          {/* Stats Summary */}
          <MaintenanceStats 
            totalRequests={totalRequests}
            pendingRequests={pendingRequests}
            resolvedRequests={resolvedRequests}
          />

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <MaintenanceSearch 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
            <MaintenanceFilters 
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>

          {/* List */}
          <MaintenanceList 
            requests={requests}
            onMaintenanceUpdate={handleMaintenanceUpdate}
            onViewDetails={handleViewDetails}
          />
        </CardContent>
      </Card>

      <AddMaintenanceDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        tenantId={tenantId}
        onSuccess={handleMaintenanceUpdate}
      />

      {selectedRequest && (
        <MaintenanceDetailSheet
          isOpen={isDetailSheetOpen}
          onClose={() => setIsDetailSheetOpen(false)}
          request={selectedRequest}
          onUpdate={handleMaintenanceUpdate}
          canRate={selectedRequest.status === "Resolved"}
        />
      )}
    </>
  );
};
