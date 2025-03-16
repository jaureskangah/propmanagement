
import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/components/providers/LocaleProvider';

export function useRealtimeNotifications() {
  const { toast } = useToast();
  const { t } = useLocale();

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
      // Notification pour mise à jour de l'état
      if (payload.new.tenant_notified && !payload.old.tenant_notified) {
        toast({
          title: "Maintenance Update",
          description: `Request "${payload.new.title}" has been updated`,
        });
      }
      
      // Nouvelle notification pour l'ajout d'un avis
      if (
        (payload.new.tenant_feedback && !payload.old.tenant_feedback) || 
        (payload.new.tenant_rating && !payload.old.tenant_rating)
      ) {
        toast({
          title: t('tenantFeedbackReceived'),
          description: `${t('feedbackReceivedFor')}: "${payload.new.issue}"`,
        });
      }
    }
  }, [toast, t]);

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
