
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

interface TenantData {
  tenant_id: string;
  tenant_name: string;
  tenant_email: string;
  property_name: string;
  is_tenant: boolean;
}

export const useTenantData = () => {
  const { user } = useAuth();
  const [tenantData, setTenantData] = useState<TenantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTenantData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching tenant data for user:", user.id);
        
        // Utiliser la fonction RPC pour récupérer les données du tenant
        const { data, error: rpcError } = await supabase.rpc('get_user_tenant_data', {
          p_user_id: user.id
        });

        if (rpcError) {
          console.error("Error fetching tenant data:", rpcError);
          setError(rpcError.message);
          setTenantData(null);
          return;
        }

        if (data && data.length > 0) {
          console.log("Tenant data found:", data[0]);
          setTenantData(data[0]);
        } else {
          console.log("No tenant data found for user");
          setTenantData(null);
        }
      } catch (err) {
        console.error("Exception fetching tenant data:", err);
        setError('Erreur lors de la récupération des données du locataire');
        setTenantData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [user?.id]);

  return { tenantData, loading, error, isTenant: !!tenantData };
};
