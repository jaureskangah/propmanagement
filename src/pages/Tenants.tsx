
import React, { useState } from "react";
import { useTenantPage } from "@/hooks/useTenantPage";
import { useIsMobile } from "@/hooks/use-mobile";
import AppSidebar from "@/components/AppSidebar";
import { TenantLayout } from "@/components/tenant/TenantLayout";
import { TenantModals } from "@/components/tenant/TenantModals";
import { TenantsHeader } from "@/components/tenant/TenantsHeader";
import { TenantsLoading } from "@/components/tenant/TenantsLoading";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const Tenants = () => {
  const {
    selectedTenant,
    setSelectedTenant,
    searchQuery,
    setSearchQuery,
    searchFilters,
    setSearchFilters,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isInviteDialogOpen,
    setIsInviteDialogOpen,
    tenants,
    isLoading,
    filteredTenants,
    selectedTenantData,
    handleAddTenant,
    handleUpdateTenant,
    handleDeleteTenant,
    handleInviteTenant,
  } = useTenantPage();
  
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (isLoading) {
    return <TenantsLoading />;
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <AppSidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
        <div className={cn(
          "p-6 md:p-8 pt-24 md:pt-8 transition-all duration-300",
          sidebarCollapsed ? "md:ml-[80px]" : "md:ml-[270px]"
        )}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <TenantsHeader 
              tenantCount={tenants?.length || 0}
              onAddClick={() => setIsAddModalOpen(true)}
              isMobile={isMobile}
            />
            
            <TenantLayout
              filteredTenants={filteredTenants || []}
              selectedTenant={selectedTenant}
              searchQuery={searchQuery}
              searchFilters={searchFilters}
              onSearchChange={setSearchQuery}
              onFilterChange={(filters) => setSearchFilters(filters)}
              onTenantSelect={setSelectedTenant}
              onEditClick={(id) => {
                setSelectedTenant(id);
                setIsEditModalOpen(true);
              }}
              onDeleteClick={(id) => {
                setSelectedTenant(id);
                setIsDeleteDialogOpen(true);
              }}
              onInviteClick={handleInviteTenant}
              selectedTenantData={selectedTenantData}
            />

            <TenantModals
              isAddModalOpen={isAddModalOpen}
              isEditModalOpen={isEditModalOpen}
              isDeleteDialogOpen={isDeleteDialogOpen}
              isInviteDialogOpen={isInviteDialogOpen}
              selectedTenantData={selectedTenantData}
              onAddClose={() => setIsAddModalOpen(false)}
              onEditClose={() => setIsEditModalOpen(false)}
              onDeleteClose={() => setIsDeleteDialogOpen(false)}
              onInviteClose={() => setIsInviteDialogOpen(false)}
              onAddSubmit={handleAddTenant}
              onEditSubmit={handleUpdateTenant}
              onDeleteConfirm={handleDeleteTenant}
            />
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Tenants;
