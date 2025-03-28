
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
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);
  const [totalNotificationCount, setTotalNotificationCount] = useState(0);

  // Charger les messages non lus initiaux
  const fetchUnreadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('tenant_communications')
        .select('*, tenants(id, name, unit_number, property_id, properties(name))')
        .eq('status', 'unread')
        .eq('is_from_tenant', true);

      if (error) throw error;
      
      if (data) {
        console.log("Found unread messages:", data);
        setUnreadMessages(data);
        
        // Afficher le dialogue si nous sommes sur la page du tableau de bord
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

  // Charger les demandes de maintenance en attente
  const fetchPendingMaintenance = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*, tenants(id, name, unit_number, property_id, properties(name))')
        .eq('status', 'Pending');

      if (error) throw error;
      
      if (data) {
        console.log("Found pending maintenance requests:", data);
        setMaintenanceRequests(data);
      }
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
    }
  };

  // Mark all messages as read
  const markAllMessagesAsRead = async () => {
    try {
      if (unreadMessages.length === 0) return;
      
      // Get all unread message IDs
      const messageIds = unreadMessages.map(msg => msg.id);
      
      const { error } = await supabase
        .from('tenant_communications')
        .update({ status: 'read' })
        .in('id', messageIds);
        
      if (error) throw error;
      
      // Update local state
      setUnreadMessages([]);
      setTotalNotificationCount(prev => prev - messageIds.length);
      
      console.log("Marked all messages as read:", messageIds);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  // Exécuter le chargement initial
  useEffect(() => {
    fetchUnreadMessages();
    fetchPendingMaintenance();
  }, []);

  // Mettre à jour le compteur total de notifications
  useEffect(() => {
    setTotalNotificationCount(unreadMessages.length + maintenanceRequests.length);
  }, [unreadMessages, maintenanceRequests]);

  // Gestionnaire pour les tâches urgentes
  const handleUrgentTasks = useCallback((payload: any) => {
    if (payload.new.priority === 'Urgent' || payload.new.priority === 'High') {
      toast({
        title: t('urgent'),
        description: `${t('urgentMaintenanceRequest')}: ${payload.new.title}`,
        variant: "destructive",
        action: (
          <ToastAction 
            altText={t('view')}
            onClick={() => navigate('/maintenance')}
          >
            {t('view')}
          </ToastAction>
        ),
      });
    }
  }, [toast, t, navigate]);

  // Gestionnaire pour les demandes de maintenance
  const handleMaintenanceRequest = useCallback((payload: any) => {
    // Actualiser les données des demandes de maintenance
    fetchPendingMaintenance();
    
    if (payload.eventType === 'INSERT') {
      toast({
        title: t('newMaintenanceRequest'),
        description: payload.new.issue,
        action: (
          <ToastAction 
            altText={t('view')}
            onClick={() => navigate('/maintenance')}
          >
            {t('view')}
          </ToastAction>
        ),
      });
    } else if (payload.eventType === 'UPDATE') {
      // Enhanced notification for status updates
      if (payload.old.status !== payload.new.status) {
        const statusMessage = `Status changed from "${payload.old.status}" to "${payload.new.status}"`;
        
        toast({
          title: t('maintenanceStatusUpdate'),
          description: `${payload.new.issue}: ${statusMessage}`,
          action: (
            <ToastAction 
              altText={t('view')}
              onClick={() => navigate(`/maintenance?request=${payload.new.id}`)}
            >
              {t('view')}
            </ToastAction>
          ),
        });
      }
      
      // Notification for tenant being notified
      if (payload.new.tenant_notified && !payload.old.tenant_notified) {
        toast({
          title: t('tenantNotified'),
          description: `Tenant was notified about "${payload.new.issue}" (${payload.new.status})`,
        });
      }
      
      // Notification for priority changes
      if (payload.old.priority !== payload.new.priority) {
        toast({
          title: t('priorityChanged'),
          description: `Priority for "${payload.new.issue}" changed from ${payload.old.priority} to ${payload.new.priority}`,
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
          action: (
            <ToastAction 
              altText={t('view')}
              onClick={() => navigate('/maintenance')}
            >
              {t('view')}
            </ToastAction>
          ),
        });
      }
    }
  }, [toast, t, navigate]);

  // Gestionnaire pour les communications des locataires
  const handleTenantCommunication = useCallback((payload: any) => {
    console.log("Tenant communication received:", payload);
    
    // Afficher les notifications uniquement pour les nouveaux messages et ceux des locataires (is_from_tenant=true)
    if (payload.eventType === 'INSERT' && payload.new.is_from_tenant === true) {
      // Mettre à jour la liste des messages non lus en les récupérant à nouveau
      fetchUnreadMessages();
      
      toast({
        title: t('newMessageFromTenant'),
        description: payload.new.subject,
        action: (
          <ToastAction 
            altText={t('view')}
            onClick={() => {
              if (payload.new.tenant_id) {
                navigate(`/tenants?selected=${payload.new.tenant_id}&tab=communications`);
              }
            }}
          >
            {t('view')}
          </ToastAction>
        ),
      });
      
      // Afficher le dialogue si nous sommes sur le tableau de bord
      if (window.location.pathname === '/dashboard') {
        setTimeout(() => {
          setShowUnreadDialog(true);
        }, 1000);
      }
    } else if (payload.eventType === 'UPDATE' && payload.new.status === 'read' && payload.old.status === 'unread') {
      // When a message is marked as read, update our local state
      setUnreadMessages(prevMessages => prevMessages.filter(msg => msg.id !== payload.new.id));
    }
  }, [toast, t, navigate]);

  // Abonnement aux changements en temps réel
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
    maintenanceRequests,
    totalNotificationCount,
    showUnreadDialog,
    setShowUnreadDialog,
    refreshUnreadMessages: fetchUnreadMessages,
    refreshMaintenanceRequests: fetchPendingMaintenance,
    markAllMessagesAsRead
  };
}
