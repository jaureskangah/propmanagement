
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Payment, TenantDocument } from "@/types/tenant";

export const usePaymentsAndDocuments = (tenantId: string | null) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [documents, setDocuments] = useState<TenantDocument[]>([]);
  
  useEffect(() => {
    if (tenantId) {
      fetchPayments(tenantId);
      fetchDocuments(tenantId);
    }
  }, [tenantId]);

  const fetchPayments = async (tenantId: string) => {
    try {
      const { data, error } = await supabase
        .from('tenant_payments')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('payment_date', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const fetchDocuments = async (tenantId: string) => {
    try {
      const { data, error } = await supabase
        .from('tenant_documents')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  return {
    payments,
    documents,
    fetchPayments,
    fetchDocuments
  };
};
