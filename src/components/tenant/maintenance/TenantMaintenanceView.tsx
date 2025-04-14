
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
import { DeleteMaintenanceDialog } from "./DeleteMaintenanceDialog";

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
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleMaintenanceUpdate,
    handleDeleteMaintenance,
    handleViewDetails
  } = useTenantMaintenance();

  if (!tenantId) {
    return (
      <Card className="dark:bg-gray-900/80 dark:border-gray-800">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground dark:text-gray-400">
            {t('notLinkedToTenant')}
          </p>
        </CardContent>
      </Card>
    );
  }

  console.log("Current sort order:", sortBy); // Debug log

  return (
    <>
      <MaintenanceHeader 
        onAddClick={() => setIsAddDialogOpen(true)} 
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      
      <Card className="dark:bg-gray-900/80 dark:border-gray-800 dark:shadow-md">
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

      {selectedRequest && (
        <DeleteMaintenanceDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          request={selectedRequest}
          onSuccess={handleMaintenanceUpdate}
        />
      )}
    </>
  );
};
