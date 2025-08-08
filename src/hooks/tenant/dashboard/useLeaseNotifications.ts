
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { parseDateSafe } from '@/lib/date';
import { startOfDay, differenceInCalendarDays } from 'date-fns';

export interface LeaseNotification {
  id: string;
  tenant_id: string;
  notification_type: 'lease_expiring' | 'lease_expired';
  days_until_expiry: number;
  sent_at: string;
  read: boolean;
}

export const useLeaseNotifications = (tenantId?: string) => {
  const [notifications, setNotifications] = useState<LeaseNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    if (!tenantId) {
      setIsLoading(false);
      return;
    }

    try {
      // For now, we'll simulate lease notifications based on lease status
      // In a real implementation, these would come from a notifications table
      const { data: tenant, error } = await supabase
        .from('tenants')
        .select('lease_end, name')
        .eq('id', tenantId)
        .single();

      if (error) throw error;

      if (tenant?.lease_end) {
        const end = startOfDay(parseDateSafe(tenant.lease_end));
        const today = startOfDay(new Date());
        const daysLeft = differenceInCalendarDays(end, today);

        const mockNotifications: LeaseNotification[] = [];

        // Create notification if lease is expiring soon
        if (daysLeft <= 30 && daysLeft > 0) {
          mockNotifications.push({
            id: `lease-expiring-${tenantId}`,
            tenant_id: tenantId,
            notification_type: 'lease_expiring',
            days_until_expiry: daysLeft,
            sent_at: new Date().toISOString(),
            read: false
          });
        }

        // Create notification if lease has expired
        if (daysLeft < 0) {
          mockNotifications.push({
            id: `lease-expired-${tenantId}`,
            tenant_id: tenantId,
            notification_type: 'lease_expired',
            days_until_expiry: Math.abs(daysLeft),
            sent_at: new Date().toISOString(),
            read: false
          });
        }

        setNotifications(mockNotifications);
      }
    } catch (error) {
      console.error('Error fetching lease notifications:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les notifications de bail.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  useEffect(() => {
    fetchNotifications();
  }, [tenantId]);

  return {
    notifications,
    isLoading,
    fetchNotifications,
    markAsRead,
    unreadCount: notifications.filter(n => !n.read).length
  };
};
