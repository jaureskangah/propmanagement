
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type HandlersType = {
  handleUrgentTasks: (payload: any) => void;
  handleMaintenanceRequest: (payload: any) => void;
  handleTenantCommunication: (payload: any) => void;
};

export function useRealtimeSubscription(handlers: HandlersType) {
  const { handleUrgentTasks, handleMaintenanceRequest, handleTenantCommunication } = handlers;

  // Set up realtime subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_tasks'
        },
        handleUrgentTasks
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_requests'
        },
        handleMaintenanceRequest
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenant_communications'
        },
        handleTenantCommunication
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [handleUrgentTasks, handleMaintenanceRequest, handleTenantCommunication]);
}
