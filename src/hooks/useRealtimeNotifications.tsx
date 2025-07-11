
import { useState, useEffect } from 'react';
import { useUnreadMessages } from './notifications/useUnreadMessages';
import { useMaintenanceNotifications } from './notifications/useMaintenanceNotifications';
import { useRealtimeSubscription } from './notifications/useRealtimeSubscription';
import { useEnhancedRealtime } from './notifications/useEnhancedRealtime';

export function useRealtimeNotifications() {
  const [totalNotificationCount, setTotalNotificationCount] = useState(0);
  
  // Use the individual hooks
  const {
    unreadMessages,
    showUnreadDialog,
    setShowUnreadDialog,
    fetchUnreadMessages,
    markAllMessagesAsRead,
    handleTenantCommunication
  } = useUnreadMessages();
  
  const {
    maintenanceRequests,
    fetchPendingMaintenance,
    handleUrgentTasks,
    handleMaintenanceRequest
  } = useMaintenanceNotifications();
  
  // Set up enhanced realtime subscriptions
  const { checkPaymentDeadlines } = useEnhancedRealtime();
  
  // Fallback realtime subscription for older functionality
  useRealtimeSubscription({
    handleUrgentTasks,
    handleMaintenanceRequest,
    handleTenantCommunication
  });
  
  // Initial data loading
  useEffect(() => {
    fetchUnreadMessages();
    fetchPendingMaintenance();
    
    // Set an interval to refresh notification data every 2 minutes
    const refreshInterval = setInterval(() => {
      fetchUnreadMessages();
      fetchPendingMaintenance();
    }, 2 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  // Update total notification count
  useEffect(() => {
    console.log("Updating notification count:", { 
      unreadMessages: unreadMessages.length, 
      maintenanceRequests: maintenanceRequests.length 
    });
    
    setTotalNotificationCount(unreadMessages.length + maintenanceRequests.length);
  }, [unreadMessages, maintenanceRequests]);
  
  return {
    unreadMessages,
    maintenanceRequests,
    totalNotificationCount,
    showUnreadDialog,
    setShowUnreadDialog,
    refreshUnreadMessages: fetchUnreadMessages,
    refreshMaintenanceRequests: fetchPendingMaintenance,
    markAllMessagesAsRead,
    checkPaymentDeadlines
  };
}
