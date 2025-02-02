import React, { useState } from "react";
import { useTenants } from "@/hooks/useTenants";
import { useToast } from "@/hooks/use-toast";
import type { Tenant } from "@/types/tenant";
import { SearchFilters } from "@/components/tenant/TenantSearch";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { TenantActions } from "@/components/tenant/TenantActions";
import { TenantLayout } from "@/components/tenant/TenantLayout";
import { TenantModals } from "@/components/tenant/TenantModals";
import AppSidebar from "@/components/AppSidebar";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

const Tenants = () => {
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    propertyId: null,
    leaseStatus: "all",
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { tenants, isLoading, updateTenant, deleteTenant } = useTenants();
  const { toast } = useToast();
  const { user } = useAuth();

  const mapTenantData = (tenant: any): Tenant => ({
    ...tenant,
    documents: tenant.tenant_documents || [],
    paymentHistory: tenant.tenant_payments || [],
    maintenanceRequests: tenant.maintenance_requests || [],
    communications: tenant.tenant_communications || [],
  });

  const filterTenants = (tenant: Tenant) => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.properties?.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const today = new Date();
    const leaseEnd = new Date(tenant.lease_end);
    const monthsUntilEnd = (leaseEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);

    switch (searchFilters.leaseStatus) {
      case "active":
        return leaseEnd > today && monthsUntilEnd > 2;
      case "expiring":
        return leaseEnd > today && monthsUntilEnd <= 2;
      case "expired":
        return leaseEnd < today;
      default:
        return true;
    }
  };

  const filteredTenants = tenants?.map(mapTenantData).filter(filterTenants);
  const selectedTenantData = selectedTenant 
    ? filteredTenants?.find(tenant => tenant.id === selectedTenant) 
    : null;

  const handleAddTenant = async (data: any) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a tenant",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("tenants").insert({
      ...data,
      user_id: user.id,
    });

    if (error) {
      throw error;
    }
  };

  const handleUpdateTenant = async (data: any) => {
    if (!selectedTenantData) return;
    await updateTenant.mutateAsync({
      id: selectedTenantData.id,
      ...data,
    });
  };

  const handleDeleteTenant = async () => {
    if (!selectedTenantData) return;
    await deleteTenant.mutateAsync(selectedTenantData.id);
    setSelectedTenant(null);
    setIsDeleteDialogOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 container mx-auto p-6">
        <div className="mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">
                Tenants
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your tenants, track payments, and handle maintenance requests
              </p>
            </div>
            <div className="flex items-center justify-end gap-4">
              <Badge variant="secondary" className="text-sm px-3 py-1.5">
                <Info className="h-4 w-4 mr-1.5" />
                {tenants?.length} {tenants?.length === 1 ? 'Tenant' : 'Tenants'}
              </Badge>
              <TenantActions onAddClick={() => setIsAddModalOpen(true)} />
            </div>
          </div>
        </div>
        
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
      </div>
    </div>
  );
};

export default Tenants;