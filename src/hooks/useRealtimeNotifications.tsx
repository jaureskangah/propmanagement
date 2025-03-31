
import { useState, useEffect } from 'react';
import { useUnreadMessages } from './notifications/useUnreadMessages';
import { useMaintenanceNotifications } from './notifications/useMaintenanceNotifications';
import { useRealtimeSubscription } from './notifications/useRealtimeSubscription';

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
  
  // Set up realtime subscription
  useRealtimeSubscription({
    handleUrgentTasks,
    handleMaintenanceRequest,
    handleTenantCommunication
  });
  
  // Initial data loading
  useEffect(() => {
    fetchUnreadMessages();
    fetchPendingMaintenance();
  }, []);
  
  // Update total notification count
  useEffect(() => {
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
    markAllMessagesAsRead
  };
}
