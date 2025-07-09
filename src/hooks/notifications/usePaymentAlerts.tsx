import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useNavigate } from 'react-router-dom';
import { ToastAction } from '@/components/ui/toast';

export function usePaymentAlerts() {
  const [paymentAlerts, setPaymentAlerts] = useState<any[]>([]);
  const { t } = useLocale();
  const navigate = useNavigate();

  // Fetch overdue payments
  const fetchOverduePayments = async () => {
    try {
      const { data, error } = await supabase
        .from('tenant_payments')
        .select(`
          *,
          tenants (
            id,
            name,
            email,
            notification_preferences,
            property_id,
            properties (name)
          )
        `)
        .in('status', ['pending', 'overdue', 'late'])
        .order('payment_date', { ascending: true });

      if (error) throw error;
      
      if (data) {
        // Filter for truly overdue payments
        const today = new Date();
        const overduePayments = data.filter(payment => {
          const dueDate = new Date(payment.payment_date);
          return dueDate < today;
        });
        
        console.log("Found overdue payments:", overduePayments);
        setPaymentAlerts(overduePayments);
        
        // Show toast notifications for new overdue payments
        overduePayments.forEach(payment => {
          if (payment.tenants?.notification_preferences?.push !== false) {
            toast({
              title: t('paymentOverdue'),
              description: `${payment.tenants.name} - $${payment.amount}`,
              variant: "destructive",
              action: (
                <ToastAction 
                  altText={t('view')}
                  onClick={() => navigate(`/tenants?selected=${payment.tenants.id}&tab=payments`)}
                >
                  {t('view')}
                </ToastAction>
              ),
            });
          }
        });
      }
    } catch (error) {
      console.error("Error fetching overdue payments:", error);
    }
  };

  // Handler for payment events
  const handlePaymentEvents = useCallback((payload: any) => {
    console.log("Payment event received:", payload);
    
    // Refresh payment alerts
    fetchOverduePayments();
    
    if (payload.eventType === 'INSERT') {
      const payment = payload.new;
      
      // Check if payment is immediately overdue
      const dueDate = new Date(payment.payment_date);
      const today = new Date();
      
      if (dueDate < today && payment.status === 'pending') {
        toast({
          title: t('newOverduePayment'),
          description: `Payment of $${payment.amount} is overdue`,
          variant: "destructive",
          action: (
            <ToastAction 
              altText={t('view')}
              onClick={() => navigate('/finances')}
            >
              {t('view')}
            </ToastAction>
          ),
        });
      }
    } else if (payload.eventType === 'UPDATE') {
      const oldPayment = payload.old;
      const newPayment = payload.new;
      
      // Payment status changes
      if (oldPayment.status !== newPayment.status) {
        if (newPayment.status === 'paid') {
          toast({
            title: t('paymentReceived'),
            description: `Payment of $${newPayment.amount} has been received`,
            action: (
              <ToastAction 
                altText={t('view')}
                onClick={() => navigate('/finances')}
              >
                {t('view')}
              </ToastAction>
            ),
          });
        } else if (newPayment.status === 'overdue' || newPayment.status === 'late') {
          toast({
            title: t('paymentOverdue'),
            description: `Payment of $${newPayment.amount} is now overdue`,
            variant: "destructive",
            action: (
              <ToastAction 
                altText={t('view')}
                onClick={() => navigate('/finances')}
              >
                {t('view')}
              </ToastAction>
            ),
          });
        }
      }
    }
  }, [toast, t, navigate]);

  // Check for payment deadlines daily
  const checkPaymentDeadlines = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tenant_payments')
        .select(`
          *,
          tenants (
            id,
            name,
            email,
            notification_preferences
          )
        `)
        .eq('status', 'pending');

      if (error) throw error;

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      data?.forEach(payment => {
        const dueDate = new Date(payment.payment_date);
        
        // Payment due tomorrow
        if (dueDate.toDateString() === tomorrow.toDateString()) {
          toast({
            title: t('paymentDueTomorrow'),
            description: `${payment.tenants.name} - $${payment.amount}`,
            action: (
              <ToastAction 
                altText={t('sendReminder')}
                onClick={() => navigate(`/tenants?selected=${payment.tenants.id}&tab=communications`)}
              >
                {t('sendReminder')}
              </ToastAction>
            ),
          });
        }
      });
    } catch (error) {
      console.error("Error checking payment deadlines:", error);
    }
  }, [toast, t, navigate]);

  return {
    paymentAlerts,
    fetchOverduePayments,
    handlePaymentEvents,
    checkPaymentDeadlines
  };
}