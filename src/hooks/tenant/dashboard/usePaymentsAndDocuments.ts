
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { TenantPayment, TenantDocument } from "@/types/tenant";
import { useAuth } from "@/components/AuthProvider";

export const usePaymentsAndDocuments = () => {
  const [payments, setPayments] = useState<TenantPayment[]>([]);
  const [documents, setDocuments] = useState<TenantDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchPayments = async (tenantId: string) => {
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
  };

  const fetchDocuments = async (tenantId: string) => {
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
  };

  const fetchPaymentsAndDocuments = async () => {
    if (!user) return;
    
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
        setIsLoading(false);
        return;
      }

      const tenantId = tenantData?.id;
      if (!tenantId) {
        console.log('No tenant found for user:', user.id);
        setPayments([]);
        setDocuments([]);
        setIsLoading(false);
        return;
      }
      
      console.log("Found tenant ID:", tenantId);
      await Promise.all([fetchPayments(tenantId), fetchDocuments(tenantId)]);
    } catch (error) {
      console.error('Error in fetchPaymentsAndDocuments:', error);
      setPayments([]);
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPaymentsAndDocuments();
    }
  }, [user]);

  return {
    payments,
    documents,
    isLoading,
    fetchPaymentsAndDocuments
  };
};
