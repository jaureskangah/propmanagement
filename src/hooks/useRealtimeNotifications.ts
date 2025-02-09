
import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function useRealtimeNotifications() {
  const { toast } = useToast();

  const handleUrgentTasks = useCallback((payload: any) => {
    if (payload.new.priority === 'high' || payload.new.priority === 'urgent') {
      toast({
        title: "Tâche urgente",
        description: `Nouvelle tâche urgente : ${payload.new.title}`,
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleMaintenanceRequest = useCallback((payload: any) => {
    if (payload.eventType === 'INSERT') {
      toast({
        title: "Nouvelle demande de maintenance",
        description: payload.new.title,
      });
    } else if (payload.eventType === 'UPDATE') {
      if (payload.new.tenant_notified && !payload.old.tenant_notified) {
        toast({
          title: "Mise à jour de maintenance",
          description: `La demande "${payload.new.title}" a été mise à jour`,
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

    console.log("Realtime notifications channel subscribed");

    return () => {
      console.log("Cleaning up realtime notifications subscription");
      supabase.removeChannel(channel);
    };
  }, [handleUrgentTasks, handleMaintenanceRequest]);
}
