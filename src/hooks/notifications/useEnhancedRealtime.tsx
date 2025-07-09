import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { usePaymentAlerts } from './usePaymentAlerts';
import { useBidirectionalCommunication } from './useBidirectionalCommunication';
import { useMaintenanceNotifications } from './useMaintenanceNotifications';
import { useUnreadMessages } from './useUnreadMessages';

export function useEnhancedRealtime() {
  const { handlePaymentEvents, checkPaymentDeadlines } = usePaymentAlerts();
  const { handleCommunicationEvents } = useBidirectionalCommunication();
  const { handleUrgentTasks, handleMaintenanceRequest } = useMaintenanceNotifications();
  const { handleTenantCommunication } = useUnreadMessages();

  useEffect(() => {
    console.log("Setting up enhanced realtime subscriptions...");

    // Create comprehensive realtime channel
    const channel = supabase
      .channel('enhanced-realtime')
      // Maintenance requests
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_requests'
        },
        (payload) => {
          console.log("Maintenance request change:", payload);
          handleUrgentTasks(payload);
          handleMaintenanceRequest(payload);
        }
      )
      // Tenant payments
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenant_payments'
        },
        (payload) => {
          console.log("Payment change:", payload);
          handlePaymentEvents(payload);
        }
      )
      // Tenant communications
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenant_communications'
        },
        (payload) => {
          console.log("Communication change:", payload);
          handleCommunicationEvents(payload);
          handleTenantCommunication(payload);
        }
      )
      .subscribe((status) => {
        console.log("Enhanced realtime subscription status:", status);
      });

    // Set up daily payment deadline check
    const checkDeadlines = () => {
      const now = new Date();
      // Check at 9 AM every day
      if (now.getHours() === 9 && now.getMinutes() === 0) {
        checkPaymentDeadlines();
      }
    };

    // Check every minute if it's 9 AM
    const deadlineInterval = setInterval(checkDeadlines, 60000);

    return () => {
      console.log("Cleaning up enhanced realtime subscriptions");
      supabase.removeChannel(channel);
      clearInterval(deadlineInterval);
    };
  }, [
    handlePaymentEvents,
    handleCommunicationEvents,
    handleUrgentTasks,
    handleMaintenanceRequest,
    handleTenantCommunication,
    checkPaymentDeadlines
  ]);

  return {
    // Expose functions for manual triggers if needed
    checkPaymentDeadlines
  };
}