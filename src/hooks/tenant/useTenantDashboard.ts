
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Communication, MaintenanceRequest, Payment, TenantDocument } from "@/types/tenant";
import { differenceInDays } from "date-fns";

interface TenantDashboardData {
  tenant: {
    id: string;
    name: string;
    email: string;
    unit_number: string;
    lease_start: string;
    lease_end: string;
    rent_amount: number;
  } | null;
  communications: Communication[];
  maintenanceRequests: MaintenanceRequest[];
  payments: Payment[];
  documents: TenantDocument[];
  leaseStatus: {
    daysLeft: number;
    status: 'active' | 'expiring' | 'expired';
  };
  isLoading: boolean;
}

export const useTenantDashboard = () => {
  const [dashboardData, setDashboardData] = useState<TenantDashboardData>({
    tenant: null,
    communications: [],
    maintenanceRequests: [],
    payments: [],
    documents: [],
    leaseStatus: {
      daysLeft: 0,
      status: 'active',
    },
    isLoading: true,
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTenantData();
    } else {
      setDashboardData(prev => ({ ...prev, isLoading: false }));
    }
  }, [user]);

  const fetchTenantData = async () => {
    try {
      const { data: tenant, error } = await supabase
        .from('tenants')
        .select(`
          id, 
          name, 
          email, 
          unit_number, 
          lease_start, 
          lease_end, 
          rent_amount,
          properties (name)
        `)
        .eq('tenant_profile_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (tenant) {
        // Fetch all related data
        await Promise.all([
          fetchCommunications(tenant.id),
          fetchMaintenanceRequests(tenant.id),
          fetchPayments(tenant.id),
          fetchDocuments(tenant.id)
        ]);

        // Calculate lease status
        const leaseStatus = calculateLeaseStatus(tenant.lease_end);

        setDashboardData(prev => ({ 
          ...prev, 
          tenant, 
          leaseStatus,
          isLoading: false 
        }));
      } else {
        setDashboardData(prev => ({ ...prev, isLoading: false }));
        toast({
          title: "Profil non lié",
          description: "Veuillez contacter votre gestionnaire pour lier votre compte.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching tenant data:', error);
      setDashboardData(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du locataire",
        variant: "destructive",
      });
    }
  };

  const fetchCommunications = async (tenantId: string) => {
    try {
      const { data, error } = await supabase
        .from('tenant_communications')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      setDashboardData(prev => ({ ...prev, communications: data || [] }));
    } catch (error) {
      console.error('Error fetching communications:', error);
    }
  };

  const fetchMaintenanceRequests = async (tenantId: string) => {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      setDashboardData(prev => ({ ...prev, maintenanceRequests: data || [] }));
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
    }
  };

  const fetchPayments = async (tenantId: string) => {
    try {
      const { data, error } = await supabase
        .from('tenant_payments')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('payment_date', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      setDashboardData(prev => ({ ...prev, payments: data || [] }));
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
      
      setDashboardData(prev => ({ ...prev, documents: data || [] }));
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const calculateLeaseStatus = (leaseEnd: string) => {
    const today = new Date();
    const endDate = new Date(leaseEnd);
    const daysLeft = differenceInDays(endDate, today);
    
    let status: 'active' | 'expiring' | 'expired';
    if (daysLeft < 0) {
      status = 'expired';
    } else if (daysLeft < 30) {
      status = 'expiring';
    } else {
      status = 'active';
    }

    return { daysLeft: Math.abs(daysLeft), status };
  };

  const refreshDashboard = () => {
    if (dashboardData.tenant) {
      Promise.all([
        fetchCommunications(dashboardData.tenant.id),
        fetchMaintenanceRequests(dashboardData.tenant.id),
        fetchPayments(dashboardData.tenant.id),
        fetchDocuments(dashboardData.tenant.id)
      ]);
    }
  };

  return {
    ...dashboardData,
    refreshDashboard
  };
};
