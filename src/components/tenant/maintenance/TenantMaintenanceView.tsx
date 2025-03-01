
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MaintenanceList } from "./components/MaintenanceList";
import { AddMaintenanceDialog } from "./AddMaintenanceDialog";
import { MaintenanceFilters } from "./components/MaintenanceFilters";
import { MaintenanceDetailSheet } from "./components/MaintenanceDetailSheet"; 
import { MaintenanceStats } from "./components/MaintenanceStats";
import { MaintenanceSearch } from "./components/MaintenanceSearch";
import { useTenantMaintenance } from "./hooks/useTenantMaintenance";

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{t('maintenanceRequestTitle')}</CardTitle>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#ea384c] hover:bg-[#ea384c]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('addNewTask')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
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
    </Card>
  );
};
