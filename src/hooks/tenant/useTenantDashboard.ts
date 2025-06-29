
import { useState, useEffect } from 'react';
import { useTenantData } from '@/hooks/tenant/dashboard/useTenantData';
import { useCommunicationsData } from '@/hooks/tenant/dashboard/useCommunicationsData';
import { useMaintenanceData } from '@/hooks/tenant/dashboard/useMaintenanceData';
import { usePaymentsAndDocuments } from '@/hooks/tenant/dashboard/usePaymentsAndDocuments';
import { useLeaseStatus } from '@/hooks/tenant/dashboard/useLeaseStatus';
import { useToast } from '@/hooks/use-toast';

export const useTenantDashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { tenant, isLoading: isLoadingTenant, fetchTenantData } = useTenantData();
  const { communications, isLoading: isLoadingComms, fetchCommunications } = useCommunicationsData();
  const { maintenanceRequests, isLoading: isLoadingMaintenance, fetchMaintenanceRequests } = useMaintenanceData();
  const { payments, documents, isLoading: isLoadingPayments, fetchPaymentsAndDocuments } = usePaymentsAndDocuments();
  const leaseStatus = useLeaseStatus(tenant?.lease_end);
  const { toast } = useToast();

  console.log("=== USTENANTDASHBOARD HOOK DEBUG ===");
  console.log("tenant:", tenant);
  console.log("isLoadingTenant:", isLoadingTenant);
  console.log("isRefreshing:", isRefreshing);

  // CORRECTION CRITIQUE: isLoading ne dépend QUE des données essentielles (tenant)
  // Les autres données se chargent en arrière-plan sans bloquer l'affichage
  const isLoading = isLoadingTenant || isRefreshing;
  
  console.log("CORRECTED - Final loading state:", isLoading);
  console.log("Can show dashboard:", !isLoading && !!tenant);

  // Charger les données secondaires en arrière-plan une fois le tenant disponible
  useEffect(() => {
    if (tenant?.id && !isRefreshing) {
      console.log("=== LOADING SECONDARY DATA IN BACKGROUND ===");
      console.log("Tenant ID available:", tenant.id);
      
      // Charger les données secondaires sans affecter l'état de chargement principal
      const loadSecondaryData = async () => {
        try {
          console.log("Loading communications, maintenance, and payments in background...");
          
          // Lancer toutes les requêtes en parallèle
          const promises = [
            fetchCommunications().catch(err => {
              console.error('Background communications fetch failed:', err);
              return null;
            }),
            fetchMaintenanceRequests().catch(err => {
              console.error('Background maintenance fetch failed:', err);
              return null;
            }),
            fetchPaymentsAndDocuments().catch(err => {
              console.error('Background payments/documents fetch failed:', err);
              return null;
            })
          ];
          
          await Promise.allSettled(promises);
          console.log("All secondary data loading completed (some may have failed)");
        } catch (error) {
          console.error('Error in secondary data loading:', error);
          // Ne pas afficher d'erreur toast pour les données secondaires
        }
      };
      
      loadSecondaryData();
    }
  }, [tenant?.id, isRefreshing, fetchCommunications, fetchMaintenanceRequests, fetchPaymentsAndDocuments]);

  // Fonction de rafraîchissement globale
  const refreshDashboard = async () => {
    console.log("=== REFRESHING DASHBOARD ===");
    setIsRefreshing(true);
    
    try {
      // D'abord recharger les données du tenant
      await fetchTenantData();
      
      // Puis recharger les données secondaires
      await Promise.allSettled([
        fetchCommunications(),
        fetchMaintenanceRequests(),
        fetchPaymentsAndDocuments()
      ]);
      
      console.log("Dashboard refresh completed successfully");
      toast({
        title: "Dashboard actualisé",
        description: "Toutes les données ont été mises à jour avec succès.",
      });
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      toast({
        title: "Erreur de rafraîchissement",
        description: "Impossible de rafraîchir le dashboard. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    tenant,
    communications: communications || [],
    maintenanceRequests: maintenanceRequests || [],
    payments: payments || [],
    documents: documents || [],
    leaseStatus,
    isLoading, // Maintenant basé uniquement sur les données essentielles
    refreshDashboard
  };
};
