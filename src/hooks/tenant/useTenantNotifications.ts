import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export const useTenantNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isTenant } = useAuth();
  const { toast } = useToast();
  const [tenantId, setTenantId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id || !isTenant) return;

    const fetchTenantId = async () => {
      try {
        const { data } = await supabase
          .from('tenants')
          .select('id')
          .eq('tenant_profile_id', user.id)
          .maybeSingle();
        
        if (data) {
          setTenantId(data.id);
        }
      } catch (error) {
        console.error('Error fetching tenant ID:', error);
      }
    };

    fetchTenantId();
  }, [user?.id, isTenant]);

  useEffect(() => {
    if (!tenantId || !user?.id || !isTenant) return;

    console.log('Setting up notifications for tenant:', tenantId);

    const communicationsChannel = supabase
      .channel('tenant-communications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tenant_communications',
          filter: `tenant_id=eq.${tenantId}`
        },
        (payload) => {
          const newData = payload.new;
          if (!newData.is_from_tenant) {
            setUnreadCount(prev => prev + 1);
            toast({
              title: "Nouveau message",
              description: newData.subject || 'Vous avez un nouveau message',
            });
          }
        }
      )
      .subscribe();

    const maintenanceChannel = supabase
      .channel('tenant-maintenance')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'maintenance_requests',
          filter: `tenant_id=eq.${tenantId}`
        },
        (payload) => {
          const newData = payload.new;
          const oldData = payload.old;
          
          if (oldData.status !== newData.status) {
            let title = 'Maintenance mise a jour';
            
            switch (newData.status) {
              case 'In Progress':
                title = 'Maintenance en cours';
                break;
              case 'Completed':
                title = 'Maintenance terminee';
                break;
            }

            toast({
              title,
              description: `Votre demande a ete mise a jour`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(communicationsChannel);
      supabase.removeChannel(maintenanceChannel);
    };
  }, [tenantId, user?.id, isTenant, toast]);

  const clearNotifications = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return {
    unreadCount,
    clearNotifications
  };
};