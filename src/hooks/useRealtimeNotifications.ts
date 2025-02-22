
import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function useRealtimeNotifications() {
  const { toast } = useToast();

  const handleUrgentTasks = useCallback((payload: any) => {
    if (payload.new.priority === 'high' || payload.new.priority === 'urgent') {
      toast({
        title: "Urgent Task",
        description: `New urgent task: ${payload.new.title}`,
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleMaintenanceRequest = useCallback((payload: any) => {
    if (payload.eventType === 'INSERT') {
      toast({
        title: "New Maintenance Request",
        description: payload.new.title,
      });
    } else if (payload.eventType === 'UPDATE') {
      if (payload.new.tenant_notified && !payload.old.tenant_notified) {
        toast({
          title: "Maintenance Update",
          description: `Request "${payload.new.title}" has been updated`,
        });
      }
    }
  }, [toast]);

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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [handleUrgentTasks, handleMaintenanceRequest]);
}
