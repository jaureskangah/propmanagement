
import { useEffect, useState, useCallback } from 'react';
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

  const fetchUnreadMessages = useCallback(async () => {
    try {
      console.log("Fetching unread messages...");
      const { data, error } = await supabase
        .from('tenant_communications')
        .select(`
          *,
          tenants:tenant_id (
            id,
            name,
            unit_number,
            properties:property_id (
              id,
              name
            )
          )
        `)
        .eq('status', 'unread')
        .eq('is_from_tenant', true);
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log("Found unread messages:", data);
        setUnreadMessages(data);
        
        // Show dialog if there are unread messages and we're on the dashboard
        if (window.location.pathname === '/dashboard' && data.length > 0) {
          setTimeout(() => {
            setShowUnreadDialog(true);
          }, 1000);
        }
      } else {
        console.log("No unread messages found");
        setUnreadMessages([]);
      }
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchUnreadMessages();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('tenant-communications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenant_communications'
        },
        (payload) => {
          console.log("Realtime update for tenant_communications:", payload);
          handleTenantCommunication(payload);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchUnreadMessages]);

  const handleTenantCommunication = useCallback((payload: any) => {
    console.log("Processing tenant communication payload:", payload);
    
    // Only show notifications for new messages and those from tenants (is_from_tenant=true)
    if (payload.eventType === 'INSERT' && payload.new.is_from_tenant === true) {
      // Update the unread messages list by fetching again
      fetchUnreadMessages();
      
      toast({
        title: t('newMessage'),
        description: payload.new.subject || t('youHaveNewMessage'),
        action: (
          <ToastAction 
            altText={t('view', { fallback: "View" })}
            onClick={() => {
              // Navigate to the specific tenant's communications
              navigate(`/tenants?selected=${payload.new.tenant_id}&tab=communications`);
            }}
          >
            {t('view')}
          </ToastAction>
        ),
      });
      
      // Show dialog if we're on the dashboard
      if (window.location.pathname === '/dashboard') {
        setTimeout(() => {
          setShowUnreadDialog(true);
        }, 1000);
      }
    } else if (payload.eventType === 'UPDATE' && payload.new.status !== 'unread') {
      // If a message was marked as read, refresh the unread messages
      fetchUnreadMessages();
    }
  }, [toast, t, navigate, fetchUnreadMessages]);

  return {
    unreadMessages,
    fetchUnreadMessages,
    showUnreadDialog, 
    setShowUnreadDialog
  };
}
