
import React from "react";
import { useTenantPage } from "@/hooks/useTenantPage";
import { useIsMobile } from "@/hooks/use-mobile";
import AppSidebar from "@/components/AppSidebar";
import { TenantLayout } from "@/components/tenant/TenantLayout";
import { TenantModals } from "@/components/tenant/TenantModals";
import { TenantsHeader } from "@/components/tenant/TenantsHeader";
import { TenantsLoading } from "@/components/tenant/TenantsLoading";
import { motion } from "framer-motion";

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
    tenants,
    isLoading,
    filteredTenants,
    selectedTenantData,
    handleAddTenant,
    handleUpdateTenant,
    handleDeleteTenant,
  } = useTenantPage();
  
  const isMobile = useIsMobile();

  if (isLoading) {
    return <TenantsLoading />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="p-6 md:p-8 pt-24 md:pt-8 md:ml-[270px]">
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
            onFilterChange={setSearchFilters}
            onTenantSelect={setSelectedTenant}
            onEditClick={(id) => {
              setSelectedTenant(id);
              setIsEditModalOpen(true);
            }}
            onDeleteClick={(id) => {
              setSelectedTenant(id);
              setIsDeleteDialogOpen(true);
            }}
            selectedTenantData={selectedTenantData}
          />

          <TenantModals
            isAddModalOpen={isAddModalOpen}
            isEditModalOpen={isEditModalOpen}
            isDeleteDialogOpen={isDeleteDialogOpen}
            selectedTenantData={selectedTenantData}
            onAddClose={() => setIsAddModalOpen(false)}
            onEditClose={() => setIsEditModalOpen(false)}
            onDeleteClose={() => setIsDeleteDialogOpen(false)}
            onAddSubmit={handleAddTenant}
            onEditSubmit={handleUpdateTenant}
            onDeleteConfirm={handleDeleteTenant}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Tenants;
