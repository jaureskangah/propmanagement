import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function useRealtimeNotifications() {
  const { toast } = useToast();

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
        (payload) => {
          console.log('Real-time maintenance notification:', payload);
          
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
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenant_communications'
        },
        (payload) => {
          console.log('Real-time communication:', payload);
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "Nouvelle communication",
              description: payload.new.subject,
            });
          } else if (payload.eventType === 'UPDATE') {
            if (payload.new.tenant_notified && !payload.old.tenant_notified) {
              toast({
                title: "Mise à jour de communication",
                description: `La communication "${payload.new.subject}" a été mise à jour`,
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);
}