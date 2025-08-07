import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

interface ReminderStatistics {
  sentThisMonth: number;
  onTimePayments: number;
  pendingReminders: number;
}

export const useReminderStatistics = () => {
  const [statistics, setStatistics] = useState<ReminderStatistics>({
    sentThisMonth: 0,
    onTimePayments: 0,
    pendingReminders: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadStatistics = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Obtenir le premier et dernier jour du mois actuel
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      // 1. Rappels envoyés ce mois-ci
      const { count: sentCount } = await supabase
        .from('reminder_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'sent')
        .gte('sent_at', startOfMonth.toISOString())
        .lte('sent_at', endOfMonth.toISOString());

      // 2. Paiements à temps (paiements reçus avant ou à l'échéance ce mois-ci)
      const { data: onTimePaymentsData } = await supabase
        .from('tenant_payments')
        .select(`
          *,
          tenants!inner(user_id)
        `)
        .eq('tenants.user_id', user.id)
        .eq('status', 'paid')
        .gte('payment_date', startOfMonth.toISOString().split('T')[0])
        .lte('payment_date', endOfMonth.toISOString().split('T')[0]);

      // Pour simplifier, on compte tous les paiements marqués comme "paid" ce mois-ci
      const onTimePayments = onTimePaymentsData?.length || 0;

      // 3. Rappels en attente (maintenance requests pending + lease renewals dus bientôt)
      const { count: pendingMaintenanceCount } = await supabase
        .from('maintenance_requests')
        .select('*, tenants!inner(user_id)', { count: 'exact', head: true })
        .eq('tenants.user_id', user.id)
        .eq('status', 'Pending');

      // Compter les baux qui expirent dans les 90 prochains jours
      const in90Days = new Date();
      in90Days.setDate(in90Days.getDate() + 90);
      
      const { count: expiringSoonCount } = await supabase
        .from('tenants')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .lte('lease_end', in90Days.toISOString().split('T')[0])
        .gte('lease_end', now.toISOString().split('T')[0]);

      const pendingReminders = (pendingMaintenanceCount || 0) + (expiringSoonCount || 0);

      setStatistics({
        sentThisMonth: sentCount || 0,
        onTimePayments,
        pendingReminders
      });

    } catch (error) {
      console.error('Erreur lors du chargement des statistiques de rappels:', error);
      // Garder les valeurs par défaut en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, [user?.id]);

  return {
    statistics,
    loading,
    refetch: loadStatistics
  };
};