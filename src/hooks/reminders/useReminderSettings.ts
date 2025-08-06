
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';

interface ReminderSettings {
  id: string;
  type: 'rent_payment' | 'lease_expiry' | 'maintenance_due';
  title: string;
  description: string;
  enabled: boolean;
  daysBeforeDue: number;
  methods: ('email' | 'app')[];
}

export const useReminderSettings = () => {
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Charger les paramètres depuis la base de données
  const loadReminderSettings = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('reminder_settings')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Si aucun paramètre n'existe, créer les paramètres par défaut
      if (!data || data.length === 0) {
        await createDefaultSettings();
      } else {
        // Convertir les données de la DB vers le format attendu
        const formattedSettings: ReminderSettings[] = data.map(setting => ({
          id: setting.reminder_type,
          type: setting.reminder_type as 'rent_payment' | 'lease_expiry' | 'maintenance_due',
          title: getTranslatedTitle(setting.reminder_type),
          description: getTranslatedDescription(setting.reminder_type),
          enabled: setting.enabled,
          daysBeforeDue: setting.days_before_due,
          methods: setting.notification_methods as ('email' | 'app')[]
        }));
        
        setReminderSettings(formattedSettings);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres de rappels",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Créer les paramètres par défaut
  const createDefaultSettings = async () => {
    if (!user?.id) return;

    // D'abord, supprimer tous les paramètres existants pour cet utilisateur
    await supabase
      .from('reminder_settings')
      .delete()
      .eq('user_id', user.id);

    const defaultSettings = [
      {
        user_id: user.id,
        reminder_type: 'rent_payment',
        enabled: false,
        days_before_due: 3,
        notification_methods: ['email', 'app']
      },
      {
        user_id: user.id,
        reminder_type: 'lease_expiry',
        enabled: false,
        days_before_due: 30,
        notification_methods: ['email']
      },
      {
        user_id: user.id,
        reminder_type: 'maintenance_due',
        enabled: false,
        days_before_due: 7,
        notification_methods: ['email', 'app']
      }
    ];

    try {
      const { data, error } = await supabase
        .from('reminder_settings')
        .insert(defaultSettings)
        .select();

      if (error) throw error;

      // Convertir vers le format attendu
      const formattedSettings: ReminderSettings[] = data.map(setting => ({
        id: setting.reminder_type,
        type: setting.reminder_type as 'rent_payment' | 'lease_expiry' | 'maintenance_due',
        title: getTranslatedTitle(setting.reminder_type),
        description: getTranslatedDescription(setting.reminder_type),
        enabled: setting.enabled,
        daysBeforeDue: setting.days_before_due,
        methods: setting.notification_methods as ('email' | 'app')[]
      }));

      setReminderSettings(formattedSettings);
    } catch (error) {
      console.error('Erreur lors de la création des paramètres par défaut:', error);
    }
  };

  // Mettre à jour un paramètre
  const updateReminderSetting = async (id: string, updates: Partial<ReminderSettings>) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('reminder_settings')
        .update({
          enabled: updates.enabled,
          days_before_due: updates.daysBeforeDue,
          notification_methods: updates.methods
        })
        .eq('user_id', user.id)
        .eq('reminder_type', id);

      if (error) throw error;

      // Mettre à jour l'état local
      setReminderSettings(prev => 
        prev.map(setting => 
          setting.id === id 
            ? { ...setting, ...updates }
            : setting
        )
      );

      toast({
        title: "Paramètre mis à jour",
        description: "Les paramètres de rappel ont été sauvegardés.",
      });

      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
      return false;
    }
  };

  // Fonctions utilitaires pour les traductions (sera remplacé par les vraies traductions)
  const getTranslatedTitle = (type: string) => {
    switch (type) {
      case 'rent_payment':
        return 'Rappels de paiement de loyer';
      case 'lease_expiry':
        return 'Expiration du bail';
      case 'maintenance_due':
        return 'Maintenance préventive';
      default:
        return type;
    }
  };

  const getTranslatedDescription = (type: string) => {
    switch (type) {
      case 'rent_payment':
        return 'Rappels automatiques avant l\'échéance du loyer';
      case 'lease_expiry':
        return 'Rappels avant l\'expiration des baux';
      case 'maintenance_due':
        return 'Rappels pour les tâches de maintenance programmées';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadReminderSettings();
    }
  }, [user?.id]);

  return {
    reminderSettings,
    loading,
    updateReminderSetting,
    reloadSettings: loadReminderSettings
  };
};
