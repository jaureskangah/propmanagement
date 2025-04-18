
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";

export const useRevenueData = () => {
  const { user } = useAuth();
  
  // Récupérer toutes les propriétés pour l'utilisateur connecté
  const { data: properties, isLoading: isLoadingProperties } = useQuery({
    queryKey: ["properties_for_revenue"],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("user_id", user.id);
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching properties:", error);
        return [];
      }
    },
    enabled: !!user,
  });

  // Récupérer les paiements (basés sur les locataires des propriétés)
  const { data: payments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ["payments_for_revenue", properties?.length],
    queryFn: async () => {
      if (!user || !properties?.length) return [];
      
      try {
        // D'abord, obtenir tous les locataires pour toutes les propriétés
        const propertyIds = properties.map(p => p.id);
        const { data: tenants, error: tenantError } = await supabase
          .from("tenants")
          .select("id")
          .in("property_id", propertyIds);
        
        if (tenantError) throw tenantError;
        if (!tenants?.length) return [];
        
        // Ensuite, obtenir tous les paiements pour ces locataires
        const tenantIds = tenants.map(t => t.id);
        const { data: paymentsData, error: paymentsError } = await supabase
          .from("tenant_payments")
          .select("*")
          .in("tenant_id", tenantIds);
        
        if (paymentsError) throw paymentsError;
        return paymentsData || [];
      } catch (error) {
        console.error("Error fetching payments:", error);
        return [];
      }
    },
    enabled: !!user && !!properties?.length,
  });

  // Récupérer les dépenses (dépenses de maintenance et interventions de fournisseurs)
  const { data: expenses, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ["expenses_for_revenue", properties?.length],
    queryFn: async () => {
      if (!user || !properties?.length) return [];
      
      try {
        const propertyIds = properties.map(p => p.id);
        
        // Récupérer les dépenses de maintenance
        const { data: maintenanceExpenses, error: maintenanceError } = await supabase
          .from("maintenance_expenses")
          .select("*")
          .in("property_id", propertyIds);
        
        if (maintenanceError) throw maintenanceError;
        
        // Récupérer les interventions de fournisseurs
        const { data: vendorInterventions, error: vendorError } = await supabase
          .from("vendor_interventions")
          .select("*")
          .in("property_id", propertyIds);
        
        if (vendorError) throw vendorError;
        
        // Combiner les deux types de dépenses
        const allExpenses = [
          ...(maintenanceExpenses || []),
          ...(vendorInterventions || [])
        ];
        
        return allExpenses;
      } catch (error) {
        console.error("Error fetching expenses:", error);
        return [];
      }
    },
    enabled: !!user && !!properties?.length,
  });

  return {
    payments,
    expenses,
    properties,
    isLoading: isLoadingPayments || isLoadingExpenses || isLoadingProperties,
  };
};
