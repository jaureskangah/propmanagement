import { useState } from "react";
import { useQueryCache } from "@/hooks/useQueryCache";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import type { Tenant } from "@/types/tenant";
import type { SearchFilters } from "@/components/tenant/TenantSearch";

export const useTenantPage = () => {
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    propertyId: null,
    leaseStatus: "all",
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Helper function to get property name safely
  const getPropertyName = (tenant: any): string => {
    if (!tenant.properties) {
      return '';
    }
    
    if (typeof tenant.properties === 'object' && !Array.isArray(tenant.properties) && tenant.properties !== null) {
      if ('name' in tenant.properties && typeof tenant.properties.name === 'string') {
        return tenant.properties.name;
      }
    }
    
    if (Array.isArray(tenant.properties) && tenant.properties.length > 0) {
      const firstProperty = tenant.properties[0];
      if (typeof firstProperty === 'object' && firstProperty !== null && 'name' in firstProperty) {
        return firstProperty.name;
      }
    }
    
    return '';
  };

  const { data: tenants, isLoading, refetch } = useQueryCache<any[]>(
    ["tenants"],
    async () => {
      console.log("Fetching tenants data with cache optimization...");
      const { data, error } = await supabase
        .from("tenants")
        .select(`
          *,
          properties:property_id (
            name
          ),
          tenant_documents (
            id,
            name,
            created_at
          ),
          tenant_payments (
            id,
            amount,
            status,
            payment_date,
            created_at
          ),
          maintenance_requests (
            id,
            issue,
            status,
            created_at
          ),
          tenant_communications (
            id,
            type,
            subject,
            created_at
          )
        `);

      if (error) {
        console.error("Error fetching tenants:", error);
        toast({
          title: "Error fetching tenants",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      console.log("Tenants data fetched successfully with cache:", data?.length || 0);
      console.log("Sample tenant properties structure:", data && data.length > 0 ? data[0].properties : "No tenants");
      return data || [];
    },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log(`Loaded ${data?.length || 0} tenants from cache or fresh fetch`);
      }
    }
  );

  const mapTenantData = (tenant: any): Tenant => ({
    ...tenant,
    documents: tenant.tenant_documents || [],
    paymentHistory: tenant.tenant_payments || [],
    maintenanceRequests: tenant.maintenance_requests || [],
    communications: tenant.tenant_communications || [],
  });

  const filterTenants = (tenant: Tenant) => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (getPropertyName(tenant).toLowerCase().includes(searchQuery.toLowerCase()));

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
        description: "You need to be logged in to add a tenant",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("tenants").insert({
        ...data,
        user_id: user.id,
      });

      if (error) {
        throw error;
      }
      
      // Invalidate cache for tenants to refresh data
      refetch();
      
      toast({
        title: "Success",
        description: "Tenant added successfully",
      });
    } catch (error: any) {
      console.error("Error adding tenant:", error);
      toast({
        title: "Error adding tenant",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateTenant = async (data: any) => {
    if (!selectedTenantData) return;
    
    try {
      const { error } = await supabase
        .from("tenants")
        .update({
          ...data,
        })
        .eq("id", selectedTenantData.id);
        
      if (error) {
        throw error;
      }
      
      // Invalidate cache to refresh data
      refetch();
      
      toast({
        title: "Success",
        description: "Tenant updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating tenant:", error);
      toast({
        title: "Error updating tenant",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteTenant = async () => {
    if (!selectedTenantData) return;
    
    try {
      const { error } = await supabase
        .from("tenants")
        .delete()
        .eq("id", selectedTenantData.id);
        
      if (error) {
        throw error;
      }
      
      // Invalidate cache to refresh data
      refetch();
      
      setSelectedTenant(null);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Tenant deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting tenant:", error);
      toast({
        title: "Error deleting tenant",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
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
  };
};
