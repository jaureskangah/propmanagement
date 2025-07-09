import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useNavigate } from 'react-router-dom';
import { ToastAction } from '@/components/ui/toast';

export function useBidirectionalCommunication() {
  const [pendingCommunications, setPendingCommunications] = useState<any[]>([]);
  const { t } = useLocale();
  const navigate = useNavigate();

  // Fetch pending communications
  const fetchPendingCommunications = async () => {
    try {
      const { data, error } = await supabase
        .from('tenant_communications')
        .select(`
          *,
          tenants (
            id,
            name,
            unit_number,
            property_id,
            properties (name)
          )
        `)
        .eq('status', 'unread')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        console.log("Found pending communications:", data);
        setPendingCommunications(data);
      }
    } catch (error) {
      console.error("Error fetching pending communications:", error);
    }
  };

  // Handler for communication events
  const handleCommunicationEvents = useCallback((payload: any) => {
    console.log("Communication event received:", payload);
    
    // Refresh communications
    fetchPendingCommunications();
    
    if (payload.eventType === 'INSERT') {
      const communication = payload.new;
      
      // New message from tenant
      if (communication.is_from_tenant) {
        toast({
          title: t('newMessageFromTenant'),
          description: communication.subject,
          action: (
            <ToastAction 
              altText={t('view')}
              onClick={() => {
                if (communication.tenant_id) {
                  navigate(`/tenants?selected=${communication.tenant_id}&tab=communications`);
                }
              }}
            >
              {t('view')}
            </ToastAction>
          ),
        });
      }
      // New message to tenant
      else {
        toast({
          title: t('messageSentToTenant'),
          description: communication.subject,
          action: (
            <ToastAction 
              altText={t('view')}
              onClick={() => {
                if (communication.tenant_id) {
                  navigate(`/tenants?selected=${communication.tenant_id}&tab=communications`);
                }
              }}
            >
              {t('view')}
            </ToastAction>
          ),
        });
      }
    } else if (payload.eventType === 'UPDATE') {
      const oldComm = payload.old;
      const newComm = payload.new;
      
      // Status changes
      if (oldComm.status !== newComm.status) {
        if (newComm.status === 'read' && newComm.is_from_tenant) {
          toast({
            title: t('messageRead'),
            description: `Tenant message "${newComm.subject}" has been read`,
          });
        }
      }
      
      // Priority escalation
      if (newComm.category === 'urgent' && oldComm.category !== 'urgent') {
        toast({
          title: t('urgentMessage'),
          description: `Message escalated to urgent: "${newComm.subject}"`,
          variant: "destructive",
          action: (
            <ToastAction 
              altText={t('view')}
              onClick={() => {
                if (newComm.tenant_id) {
                  navigate(`/tenants?selected=${newComm.tenant_id}&tab=communications`);
                }
              }}
            >
              {t('view')}
            </ToastAction>
          ),
        });
      }
    }
  }, [toast, t, navigate]);

  // Send reply to communication
  const sendReply = useCallback(async (parentId: string, content: string, tenantId: string) => {
    try {
      const { data, error } = await supabase
        .from('tenant_communications')
        .insert({
          parent_id: parentId,
          tenant_id: tenantId,
          subject: 'Re: Response',
          content: content,
          type: 'message',
          category: 'general',
          status: 'unread',
          is_from_tenant: false
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: t('replySent'),
        description: t('replyHasBeenSent'),
      });

      return data;
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        title: t('error'),
        description: t('failedToSendReply'),
        variant: "destructive",
      });
      return null;
    }
  }, [toast, t]);

  // Mark conversation as resolved
  const markAsResolved = useCallback(async (communicationId: string) => {
    try {
      const { error } = await supabase
        .from('tenant_communications')
        .update({
          status: 'read',
          resolved_at: new Date().toISOString()
        })
        .eq('id', communicationId);

      if (error) throw error;

      toast({
        title: t('conversationResolved'),
        description: t('conversationMarkedAsResolved'),
      });

      // Refresh communications
      fetchPendingCommunications();
    } catch (error) {
      console.error("Error marking as resolved:", error);
      toast({
        title: t('error'),
        description: t('failedToMarkAsResolved'),
        variant: "destructive",
      });
    }
  }, [toast, t]);

  return {
    pendingCommunications,
    fetchPendingCommunications,
    handleCommunicationEvents,
    sendReply,
    markAsResolved
  };
}