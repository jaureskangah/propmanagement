
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { MaintenanceRequest } from "@/types/tenant";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

export const useMaintenanceData = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnreadUpdates, setHasUnreadUpdates] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Utiliser des refs pour éviter les re-créations de fonctions
  const isRequestInProgress = useRef(false);
  const retryCount = useRef(0);
  const maxRetries = 3;
  const lastFetchTime = useRef(0);

  // Fonction stable avec useCallback pour éviter les re-créations
  const fetchMaintenanceRequests = useCallback(async () => {
    if (!user || isRequestInProgress.current) {
      console.log("MaintenanceData - Skipping fetch: no user or request in progress");
      return;
    }

    // Éviter les appels trop fréquents (moins de 1 seconde d'intervalle)
    const now = Date.now();
    if (now - lastFetchTime.current < 1000) {
      console.log("MaintenanceData - Skipping fetch: too frequent");
      return;
    }
    lastFetchTime.current = now;
    
    isRequestInProgress.current = true;
    setIsLoading(true);
    
    try {
      console.log("MaintenanceData - Fetching maintenance requests for user:", user.id);
      
      // Fetch tenant data to get the tenant_id
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('id')
        .eq('tenant_profile_id', user.id)
        .maybeSingle();

      if (tenantError) {
        console.error('MaintenanceData - Error fetching tenant data:', tenantError);
        throw tenantError;
      }

      const tenantId = tenantData?.id;
      if (!tenantId) {
        console.log('MaintenanceData - No tenant found for user:', user.id);
        setMaintenanceRequests([]);
        return;
      }
      
      console.log("MaintenanceData - Found tenant ID:", tenantId);
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // Réduire le timeout
      
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) {
        console.error("MaintenanceData - Error fetching maintenance requests:", error);
        throw error;
      }
      
      console.log("MaintenanceData - Maintenance requests fetched:", data?.length || 0, "requests");
      
      // Normalize status values for consistency
      const normalizedData = data?.map(req => ({
        ...req,
        status: req.status === 'pending' ? 'Pending' : req.status
      })) || [];
      
      // Check for unread/unnotified updates
      const hasUnnotified = normalizedData.some(req => req.tenant_notified === false);
      setHasUnreadUpdates(hasUnnotified || false);
      
      setMaintenanceRequests(normalizedData);
      retryCount.current = 0; // Reset retry count on success
      
    } catch (error: any) {
      console.error('MaintenanceData - Error fetching maintenance requests:', error);
      
      // Handle specific network errors with retry logic
      if (error.name === 'AbortError') {
        console.log('MaintenanceData - Request timed out');
      } else if (error.message?.includes('Failed to fetch') || error.code === 'INSUFFICIENT_RESOURCES') {
        // Implement exponential backoff for network errors
        if (retryCount.current < maxRetries) {
          retryCount.current++;
          const delay = Math.pow(2, retryCount.current) * 2000; // 4s, 8s, 16s
          console.log(`MaintenanceData - Retrying in ${delay}ms (attempt ${retryCount.current}/${maxRetries})`);
          
          setTimeout(() => {
            if (user && !isRequestInProgress.current) { // Vérifier que pas déjà en cours
              fetchMaintenanceRequests();
            }
          }, delay);
          return; // Don't set error state yet, we're retrying
        }
      }
      
      // Only show error toast after all retries exhausted
      if (retryCount.current >= maxRetries) {
        setMaintenanceRequests([]);
        toast({
          title: "Erreur",
          description: "Impossible de charger les demandes de maintenance. Veuillez rafraîchir la page.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
      isRequestInProgress.current = false;
    }
  }, [user, toast]); // Dépendances minimales et stables

  // Effect simplifié sans dépendance sur fetchMaintenanceRequests
  useEffect(() => {
    if (!user) return;
    
    // Debounce l'appel initial
    const debounceTimeout = setTimeout(() => {
      fetchMaintenanceRequests();
    }, 300); // Augmenter le debounce
    
    return () => clearTimeout(debounceTimeout);
  }, [user?.id]); // Dépendance uniquement sur user.id

  // Realtime subscription simplifiée
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('tenant-maintenance-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_requests',
        },
        (payload) => {
          console.log('MaintenanceData - Realtime update:', payload.eventType);
          
          // Debounce realtime updates plus agressivement
          setTimeout(() => {
            if (!isRequestInProgress.current) {
              fetchMaintenanceRequests();
            }
          }, 1000);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('MaintenanceData - Realtime subscription active');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('MaintenanceData - Realtime subscription error');
        }
      });
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]); // Dépendance uniquement sur user.id

  return {
    maintenanceRequests,
    isLoading,
    hasUnreadUpdates,
    fetchMaintenanceRequests
  };
};
