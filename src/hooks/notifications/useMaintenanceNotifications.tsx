
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useNavigate } from 'react-router-dom';
import { ToastAction } from '@/components/ui/toast';
import { useNotification } from '@/hooks/useNotification';

export function useMaintenanceNotifications() {
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);
  const { t } = useLocale();
  const navigate = useNavigate();
  const notification = useNotification();

  // Fetch pending maintenance requests
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

  // Handler for urgent maintenance tasks
  const handleUrgentTasks = useCallback((payload: any) => {
    if (payload.new.priority === 'Urgent' || payload.new.priority === 'High') {
      notification.error(`${t('urgentMaintenanceRequest')}: ${payload.new.title}`, {
        actionLabel: t('view'),
        onAction: () => navigate('/maintenance')
      });
    }
  }, [notification, t, navigate]);

  // Handler for maintenance request events
  const handleMaintenanceRequest = useCallback((payload: any) => {
    // Refresh maintenance request data
    fetchPendingMaintenance();
    
    if (payload.eventType === 'INSERT') {
      notification.info(payload.new.issue, {
        actionLabel: t('view'),
        onAction: () => navigate('/maintenance')
      });
    } else if (payload.eventType === 'UPDATE') {
      // Status updates
      if (payload.old.status !== payload.new.status) {
        const statusMessage = `Status changed from "${payload.old.status}" to "${payload.new.status}"`;
        
        notification.info(`${payload.new.issue}: ${statusMessage}`, {
          actionLabel: t('view'),
          onAction: () => navigate(`/maintenance?request=${payload.new.id}`)
        });
      }
      
      // Tenant notification
      if (payload.new.tenant_notified && !payload.old.tenant_notified) {
        notification.success(`${t('tenantNotified')} "${payload.new.issue}" (${payload.new.status})`);
      }
      
      // Priority changes
      if (payload.old.priority !== payload.new.priority) {
        notification.warning(
          `${t('priorityChanged')} "${payload.new.issue}" ${t('from')} ${payload.old.priority} ${t('to')} ${payload.new.priority}`
        );
      }
      
      // Feedback received
      if (
        (payload.new.tenant_feedback && !payload.old.tenant_feedback) || 
        (payload.new.tenant_rating && !payload.old.tenant_rating)
      ) {
        notification.info(`${t('feedbackReceivedFor')}: "${payload.new.issue}"`, {
          actionLabel: t('view'),
          onAction: () => navigate('/maintenance')
        });
      }
    }
  }, [notification, t, navigate, fetchPendingMaintenance]);

  return {
    maintenanceRequests,
    fetchPendingMaintenance,
    handleUrgentTasks,
    handleMaintenanceRequest
  };
}
