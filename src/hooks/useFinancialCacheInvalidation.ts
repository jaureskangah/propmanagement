
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Hook centralisé pour l'invalidation des caches financiers
 * Garantit la cohérence des clés de cache et une invalidation complète
 */
export const useFinancialCacheInvalidation = () => {
  const queryClient = useQueryClient();

  const invalidateFinancialData = useCallback(async (propertyId?: string) => {
    console.log("Invalidating financial cache for propertyId:", propertyId);
    
    const currentYear = new Date().getFullYear();
    
    // Invalider toutes les queries financières principales
    const invalidationPromises = [
      // Métriques financières
      queryClient.invalidateQueries({ queryKey: ["financial_metrics"] }),
      
      // Données spécifiques à une propriété si fournie
      ...(propertyId ? [
        queryClient.invalidateQueries({ queryKey: ["financial_metrics", propertyId] }),
        queryClient.invalidateQueries({ queryKey: ["financial_metrics", propertyId, currentYear] }),
        
        // Paiements des locataires
        queryClient.invalidateQueries({ queryKey: ["tenant_payments"] }),
        queryClient.invalidateQueries({ queryKey: ["tenant_payments", propertyId] }),
        queryClient.invalidateQueries({ queryKey: ["tenant_payments", propertyId, currentYear] }),
        
        // Dépenses de maintenance
        queryClient.invalidateQueries({ queryKey: ["maintenance_expenses"] }),
        queryClient.invalidateQueries({ queryKey: ["maintenance_expenses", propertyId] }),
        queryClient.invalidateQueries({ queryKey: ["maintenance_expenses", propertyId, currentYear] }),
        
        // Interventions de fournisseurs
        queryClient.invalidateQueries({ queryKey: ["vendor_interventions"] }),
        queryClient.invalidateQueries({ queryKey: ["vendor_interventions", propertyId] }),
        queryClient.invalidateQueries({ queryKey: ["vendor_interventions", propertyId, currentYear] }),
        
        // Données pour les graphiques
        queryClient.invalidateQueries({ queryKey: ["financial_chart_data", propertyId] }),
        queryClient.invalidateQueries({ queryKey: ["revenue_chart_data", propertyId] }),
        
        // Hook de données financières optimisées
        queryClient.invalidateQueries({ queryKey: ["optimized_financial_data", propertyId] }),
        
        // Données d'aperçu financier
        queryClient.invalidateQueries({ queryKey: ["financial_overview", propertyId] }),
        queryClient.invalidateQueries({ queryKey: ["financial_overview", propertyId, currentYear] }),
      ] : []),
      
      // Données générales (pour le dashboard global)
      queryClient.invalidateQueries({ queryKey: ["properties_for_revenue"] }),
      queryClient.invalidateQueries({ queryKey: ["payments_for_revenue"] }),
      queryClient.invalidateQueries({ queryKey: ["expenses_for_revenue"] }),
      
      // Données des locataires (car liées aux paiements)
      queryClient.invalidateQueries({ queryKey: ["tenants"] }),
    ];
    
    await Promise.all(invalidationPromises);
    console.log("Financial cache invalidation completed");
  }, [queryClient]);

  return { invalidateFinancialData };
};
