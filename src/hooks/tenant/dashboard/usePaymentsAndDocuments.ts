
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { TenantPayment, TenantDocument } from "@/types/tenant";
import { useAuth } from "@/components/AuthProvider";

export const usePaymentsAndDocuments = () => {
  const [payments, setPayments] = useState<TenantPayment[]>([]);
  const [documents, setDocuments] = useState<TenantDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Utiliser des refs pour éviter les appels multiples
  const isRequestInProgress = useRef(false);
  const lastFetchTime = useRef(0);

  const fetchPayments = useCallback(async (tenantId: string) => {
    try {
      console.log("Fetching payments for tenant:", tenantId);
      const { data, error } = await supabase
        .from('tenant_payments')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      
      console.log("Payments fetched:", data);
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    }
  }, []);

  const fetchDocuments = useCallback(async (tenantId: string) => {
    try {
      console.log("Fetching documents for tenant:", tenantId);
      const { data, error } = await supabase
        .from('tenant_documents')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log("Documents fetched:", data);
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocuments([]);
    }
  }, []);

  const fetchPaymentsAndDocuments = useCallback(async () => {
    if (!user || isRequestInProgress.current) return;

    // Éviter les appels trop fréquents
    const now = Date.now();
    if (now - lastFetchTime.current < 1000) {
      console.log("PaymentsAndDocuments - Skipping fetch: too frequent");
      return;
    }
    lastFetchTime.current = now;
    
    isRequestInProgress.current = true;
    setIsLoading(true);
    
    try {
      console.log("Fetching tenant data for user:", user.id);
      
      // First get the tenant ID
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('id')
        .eq('tenant_profile_id', user.id)
        .maybeSingle();

      if (tenantError) {
        console.error('Error fetching tenant data:', tenantError);
        setPayments([]);
        setDocuments([]);
        return;
      }

      const tenantId = tenantData?.id;
      if (!tenantId) {
        console.log('No tenant found for user:', user.id);
        setPayments([]);
        setDocuments([]);
        return;
      }
      
      console.log("Found tenant ID:", tenantId);
      
      // Fetch payments and documents with small delays
      await fetchPayments(tenantId);
      await new Promise(resolve => setTimeout(resolve, 100));
      await fetchDocuments(tenantId);
      
    } catch (error) {
      console.error('Error in fetchPaymentsAndDocuments:', error);
      setPayments([]);
      setDocuments([]);
    } finally {
      setIsLoading(false);
      isRequestInProgress.current = false;
    }
  }, [user, fetchPayments, fetchDocuments]);

  useEffect(() => {
    if (user) {
      // Debounce l'appel initial
      const debounceTimeout = setTimeout(() => {
        fetchPaymentsAndDocuments();
      }, 400); // Délai plus long pour éviter les conflits
      
      return () => clearTimeout(debounceTimeout);
    }
  }, [user?.id]); // Dépendance uniquement sur user.id

  return {
    payments,
    documents,
    isLoading,
    fetchPaymentsAndDocuments
  };
};
