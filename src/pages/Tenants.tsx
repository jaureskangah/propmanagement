
import React, { useState } from "react";
import { useTenantPage } from "@/hooks/useTenantPage";
import { useIsMobile } from "@/hooks/use-mobile";
import AppSidebar from "@/components/AppSidebar";
import { TenantLayout } from "@/components/tenant/TenantLayout";
import { TenantModals } from "@/components/tenant/TenantModals";
import { TenantsHeader } from "@/components/tenant/TenantsHeader";
import { TenantsLoading } from "@/components/tenant/TenantsLoading";
import { motion } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { useLocale } from "@/components/providers/LocaleProvider";

const Tenants = () => {
  const { t } = useLocale();
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
    isDeleting,
  } = useTenantPage();
  
  const isMobile = useIsMobile();

  if (isLoading) {
    return <TenantsLoading />;
  }

  return (
    <TooltipProvider>
      <AppSidebar />
      <ResponsiveLayout title={t('tenants')} className="p-6 md:p-8">
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
            isDeleting={isDeleting}
          />
        </motion.div>
      </ResponsiveLayout>
    </TooltipProvider>
  );
};

export default Tenants;
