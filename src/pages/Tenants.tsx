import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Search, Home, Pencil } from "lucide-react";
import TenantProfile from "@/components/TenantProfile";
import { useTenants } from "@/hooks/useTenants";
import { useToast } from "@/hooks/use-toast";
import type { Tenant } from "@/types/tenant";
import { AddTenantModal } from "@/components/tenant/AddTenantModal";
import { EditTenantModal } from "@/components/tenant/EditTenantModal";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

const Tenants = () => {
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { tenants, isLoading, updateTenant } = useTenants();
  const { toast } = useToast();
  const { user } = useAuth();

  const mapTenantData = (tenant: any): Tenant => {
    return {
      ...tenant,
      documents: tenant.tenant_documents || [],
      paymentHistory: tenant.tenant_payments || [],
      maintenanceRequests: tenant.maintenance_requests || [],
      communications: tenant.tenant_communications || [],
    };
  };

  const filteredTenants = tenants?.map(mapTenantData).filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.properties?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTenantData = selectedTenant 
    ? filteredTenants?.find(t => t.id === selectedTenant)
    : null;

  const handleAddTenant = async (data: any) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter un locataire",
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

  const handleEditClick = (tenantId: string) => {
    setSelectedTenant(tenantId);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des locataires</h1>
        <Button 
          className="flex items-center gap-2 bg-[#ea384c] hover:bg-[#ea384c]/90"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Ajouter un locataire
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des locataires..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredTenants?.map((tenant) => (
              <Card
                key={tenant.id}
                className={`cursor-pointer hover:bg-accent ${
                  selectedTenant === tenant.id ? "border-primary" : ""
                }`}
                onClick={() => setSelectedTenant(tenant.id)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{tenant.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Home className="h-4 w-4" />
                        {tenant.properties?.name} - Unité {tenant.unit_number}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(tenant.id);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedTenantData ? (
            <TenantProfile tenant={selectedTenantData} />
          ) : (
            <Card className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Sélectionnez un locataire pour voir les détails</p>
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
    </div>
  );
};

export default Tenants;