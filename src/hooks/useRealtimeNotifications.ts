import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function useRealtimeNotifications() {
  const { toast } = useToast();

  const handleNotification = useCallback((payload: any) => {
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

  const handleCommunication = useCallback((payload: any) => {
    console.log("Communication payload:", payload);
    
    if (payload.eventType === 'INSERT') {
      // Vérifier si le message vient d'un locataire
      if (payload.new.is_from_tenant) {
        toast({
          title: "Nouveau message d'un locataire",
          description: `Sujet: ${payload.new.subject}`,
          variant: "default",
          duration: 5000,
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
          table: 'maintenance_requests'
        },
        handleNotification
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenant_communications'
        },
        handleCommunication
      )
      .subscribe();

    console.log("Realtime notifications channel subscribed");

    return () => {
      console.log("Cleaning up realtime notifications subscription");
      supabase.removeChannel(channel);
    };
  }, [handleNotification, handleCommunication]);
}