
import { useEffect, useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useNavigate } from 'react-router-dom';
import { ToastAction } from '@/components/ui/toast';

export function useRealtimeNotifications() {
  const { toast } = useToast();
  const { t } = useLocale();
  const navigate = useNavigate();
  const [unreadMessages, setUnreadMessages] = useState<any[]>([]);
  const [showUnreadDialog, setShowUnreadDialog] = useState(false);

  // Fetch initial unread messages
  useEffect(() => {
    fetchUnreadMessages();
  }, []);

  const fetchUnreadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('tenant_communications')
        .select('*, tenants(id, name, unit_number)')
        .eq('status', 'unread')
        .eq('is_from_tenant', true);

      if (error) throw error;
      
      if (data && data.length > 0) {
        console.log("Found unread messages:", data);
        setUnreadMessages(data);
        
        // Show dialog if there are unread messages and we're on the dashboard
        if (window.location.pathname === '/dashboard' && data.length > 0) {
          setTimeout(() => {
            setShowUnreadDialog(true);
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  };

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

  // Handler for tenant communications
  const handleTenantCommunication = useCallback((payload: any) => {
    console.log("Tenant communication received:", payload);
    
    // Only show notifications for new messages and those from tenants (is_from_tenant=true)
    if (payload.eventType === 'INSERT' && payload.new.is_from_tenant === true) {
      // Update the unread messages list by fetching again
      fetchUnreadMessages();
      
      toast({
        title: t('newMessageFromTenant', { fallback: "New Message From Tenant" }),
        description: payload.new.subject,
        action: (
          <ToastAction 
            altText={t('view', { fallback: "View" })}
            onClick={() => {
              if (payload.new.tenant_id) {
                navigate(`/tenants?selected=${payload.new.tenant_id}&tab=communications`);
              }
            }}
          >
            {t('view', { fallback: "View" })}
          </ToastAction>
        ),
      });
      
      // Show dialog if we're on the dashboard
      if (window.location.pathname === '/dashboard') {
        setTimeout(() => {
          setShowUnreadDialog(true);
        }, 1000);
      }
    }
  }, [toast, t, navigate]);

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

  return {
    unreadMessages,
    showUnreadDialog,
    setShowUnreadDialog
  };
}
