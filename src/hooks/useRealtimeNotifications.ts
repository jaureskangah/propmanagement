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
          console.log('Real-time notification:', payload);
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "Nouvelle demande de maintenance",
              description: payload.new.title,
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: "Mise à jour de maintenance",
              description: `La demande "${payload.new.title}" a été mise à jour`,
            });
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
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenant_payments'
        },
        (payload) => {
          console.log('Real-time payment:', payload);
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "Nouveau paiement",
              description: `Nouveau paiement de ${payload.new.amount}€ reçu`,
            });
          } else if (payload.eventType === 'UPDATE' && payload.new.status === 'completed') {
            toast({
              title: "Paiement confirmé",
              description: `Paiement de ${payload.new.amount}€ confirmé`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);
}