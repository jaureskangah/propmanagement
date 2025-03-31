
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useNavigate } from 'react-router-dom';

export function useUnreadMessages() {
  const [unreadMessages, setUnreadMessages] = useState<any[]>([]);
  const [showUnreadDialog, setShowUnreadDialog] = useState(false);
  const { t } = useLocale();
  const navigate = useNavigate();

  // Load initial unread messages
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
        setUnreadMessages(data || []);
        
        // Show dialog if we're on the dashboard and there are messages
        if (window.location.pathname === '/dashboard' && data.length > 0) {
          setTimeout(() => {
            setShowUnreadDialog(true);
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Error fetching unread messages:", error);
      // Set to empty array in case of error to avoid showing stale data
      setUnreadMessages([]);
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
      
      console.log("Marked all messages as read:", messageIds);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  // Handle tenant communication events
  const handleTenantCommunication = useCallback((payload: any) => {
    console.log("Tenant communication received:", payload);
    
    // Only show notifications for new messages and those from tenants
    if (payload.eventType === 'INSERT' && payload.new.is_from_tenant === true) {
      // Fetch unread messages again
      fetchUnreadMessages();
      
      toast({
        title: t('newMessageFromTenant'),
        description: payload.new.subject,
        action: (
          <div 
            onClick={() => {
              if (payload.new.tenant_id) {
                navigate(`/tenants?selected=${payload.new.tenant_id}&tab=communications`);
              }
            }}
            className="cursor-pointer"
          >
            {t('view')}
          </div>
        ),
      });
      
      // Show dialog if we're on the dashboard
      if (window.location.pathname === '/dashboard') {
        setTimeout(() => {
          setShowUnreadDialog(true);
        }, 1000);
      }
    } else if (payload.eventType === 'UPDATE' && payload.new.status === 'read' && payload.old.status === 'unread') {
      // When a message is marked as read, update our local state
      setUnreadMessages(prevMessages => prevMessages.filter(msg => msg.id !== payload.new.id));
    }
  }, [t, navigate]);

  return {
    unreadMessages,
    showUnreadDialog,
    setShowUnreadDialog,
    fetchUnreadMessages,
    markAllMessagesAsRead,
    handleTenantCommunication
  };
}
