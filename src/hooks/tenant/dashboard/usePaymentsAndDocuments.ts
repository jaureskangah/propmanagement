
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { TenantPayment, TenantDocument } from "@/types/tenant";
import { useAuth } from "@/components/AuthProvider";

export const usePaymentsAndDocuments = () => {
  const [payments, setPayments] = useState<TenantPayment[]>([]);
  const [documents, setDocuments] = useState<TenantDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchPayments = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tenant_payments')
        .select('*')
        .eq('tenant_id', user.id)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocuments = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tenant_documents')
        .select('*')
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPaymentsAndDocuments = async () => {
    setIsLoading(true);
    await Promise.all([fetchPayments(), fetchDocuments()]);
    setIsLoading(false);
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
