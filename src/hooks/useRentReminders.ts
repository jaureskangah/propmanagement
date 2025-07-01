
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface RentReminder {
  id: string;
  tenant_id: string;
  reminder_date: string;
  target_month: string;
  status: string;
  email_sent: boolean;
  created_at: string;
  tenants: {
    name: string;
    email: string;
    rent_amount: number;
  };
}

export const useRentReminders = () => {
  const [reminders, setReminders] = useState<RentReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReminders = async () => {
    try {
      setLoading(true);
      
      // Récupérer les rappels des 6 derniers mois
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data, error } = await supabase
        .from('rent_payment_reminders')
        .select(`
          *,
          tenants!inner(name, email, rent_amount)
        `)
        .gte('reminder_date', sixMonthsAgo.toISOString().split('T')[0])
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des rappels",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendManualReminder = async (tenantId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('rent-payment-reminders', {
        body: { 
          manualTrigger: true,
          tenantId: tenantId
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Rappel envoyé",
          description: "Le rappel de paiement a été envoyé avec succès",
        });
        fetchReminders(); // Rafraîchir les données
        return true;
      } else {
        throw new Error(data?.error || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le rappel",
        variant: "destructive",
      });
      return false;
    }
  };

  const sendAllReminders = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('rent-payment-reminders', {
        body: { manualTrigger: true }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Rappels envoyés",
          description: `${data.processed} rappels ont été traités`,
        });
        fetchReminders(); // Rafraîchir les données
        return { success: true, processed: data.processed };
      } else {
        throw new Error(data?.error || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Error sending reminders:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer les rappels",
        variant: "destructive",
      });
      return { success: false, processed: 0 };
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return {
    reminders,
    loading,
    fetchReminders,
    sendManualReminder,
    sendAllReminders,
  };
};
