import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import TenantProfile from "@/components/TenantProfile";
import { useTenants } from "@/hooks/useTenants";
import { useToast } from "@/hooks/use-toast";
import type { Tenant } from "@/types/tenant";
import { AddTenantModal } from "@/components/tenant/AddTenantModal";
import { EditTenantModal } from "@/components/tenant/EditTenantModal";
import { DeleteTenantDialog } from "@/components/tenant/DeleteTenantDialog";
import { TenantList } from "@/components/tenant/TenantList";
import { TenantSearch, SearchFilters } from "@/components/tenant/TenantSearch";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tenants Management</h1>
        <Button 
          className="flex items-center gap-2 bg-[#ea384c] hover:bg-[#ea384c]/90"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Tenant
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="mb-4">
            <TenantSearch 
              value={searchQuery}
              onChange={setSearchQuery}
              onFilterChange={setSearchFilters}
            />
          </div>

          <TenantList
            tenants={filteredTenants || []}
            selectedTenant={selectedTenant}
            onTenantSelect={setSelectedTenant}
            onEditClick={(id) => {
              setSelectedTenant(id);
              setIsEditModalOpen(true);
            }}
            onDeleteClick={(id) => {
              setSelectedTenant(id);
              setIsDeleteDialogOpen(true);
            }}
          />
        </div>

        <div className="lg:col-span-2">
          {selectedTenantData ? (
            <TenantProfile tenant={selectedTenantData} />
          ) : (
            <Card className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Select a tenant to view details</p>
            </Card>
          )}
        </div>
      </div>

      <AddTenantModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTenant}
      />

      {selectedTenantData && (
        <EditTenantModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          tenant={selectedTenantData}
          onSubmit={handleUpdateTenant}
        />
      )}

      <DeleteTenantDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteTenant}
      />
    </div>
  );
};

export default Tenants;