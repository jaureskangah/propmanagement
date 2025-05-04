
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useNavigate } from 'react-router-dom';
import { ToastAction } from '@/components/ui/toast';

export function useMaintenanceNotifications() {
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);
  const { t } = useLocale();
  const navigate = useNavigate();

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

  // Handler for maintenance request events
  const handleMaintenanceRequest = useCallback((payload: any) => {
    // Refresh maintenance request data
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
      // Status updates
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
      
      // Tenant notification
      if (payload.new.tenant_notified && !payload.old.tenant_notified) {
        toast({
          title: t('tenantNotified'),
          description: `Tenant was notified about "${payload.new.issue}" (${payload.new.status})`,
        });
      }
      
      // Priority changes
      if (payload.old.priority !== payload.new.priority) {
        toast({
          title: t('priorityChanged'),
          description: `Priority for "${payload.new.issue}" changed from ${payload.old.priority} to ${payload.new.priority}`,
        });
      }
      
      // Feedback received
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

  return {
    maintenanceRequests,
    fetchPendingMaintenance,
    handleUrgentTasks,
    handleMaintenanceRequest
  };
}
