
import React, { useEffect } from "react";
import { useTenantPage } from "@/hooks/useTenantPage";
import { useIsMobile } from "@/hooks/use-mobile";
import AppSidebar from "@/components/AppSidebar";
import { TenantLayout } from "@/components/tenant/TenantLayout";
import { TenantModals } from "@/components/tenant/TenantModals";
import { TenantsHeader } from "@/components/tenant/TenantsHeader";
import { TenantsLoading } from "@/components/tenant/TenantsLoading";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

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
  const [searchParams] = useSearchParams();

  // Handle URL query parameters for selecting tenant and active tab
  useEffect(() => {
    const selectedFromUrl = searchParams.get('selected');
    const tabFromUrl = searchParams.get('tab');
    
    console.log("URL params:", { selectedFromUrl, tabFromUrl });
    
    if (selectedFromUrl) {
      setSelectedTenant(selectedFromUrl);
      console.log("Setting selected tenant from URL:", selectedFromUrl);
    }
    
    // We'll use the tab parameter in the TenantProfile component
  }, [searchParams, setSelectedTenant]);

  if (isLoading) {
    return <TenantsLoading />;
  }

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 container mx-auto p-6 overflow-y-auto">
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
