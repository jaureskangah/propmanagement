
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

      // Vérifier si tous les types de rappels existent
      const expectedTypes = ['rent_payment', 'lease_expiry', 'maintenance_due'];
      const existingTypes = data ? data.map(setting => setting.reminder_type) : [];
      const missingTypes = expectedTypes.filter(type => !existingTypes.includes(type));

      console.log('🔍 Types existants:', existingTypes);
      console.log('🔍 Types manquants:', missingTypes);

      if (!data || data.length === 0) {
        console.log('🔍 Aucun paramètre trouvé, création de tous les paramètres par défaut');
        await createDefaultSettings();
      } else if (missingTypes.length > 0) {
        console.log('🔍 Certains types manquent, création des types manquants:', missingTypes);
        await createMissingSettings(missingTypes);
        // Recharger les données après avoir créé les types manquants
        return loadReminderSettings();
      } else {
        console.log('🔍 Tous les types de rappels existent, formatage des données');
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

    console.log('🔍 Création des paramètres par défaut pour:', user.id);

    // D'abord, supprimer tous les paramètres existants pour cet utilisateur
    const { error: deleteError } = await supabase
      .from('reminder_settings')
      .delete()
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Erreur lors de la suppression:', deleteError);
    }

    // Définir tous les types de rappels par défaut
    const reminderTypes = [
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

    console.log('🔍 Insertion de tous les rappels en une seule fois...');

    try {
      // Insérer tous les rappels en une seule fois
      const { data, error } = await supabase
        .from('reminder_settings')
        .insert(reminderTypes)
        .select();

      if (error) {
        console.error('Erreur lors de l\'insertion en masse:', error);
        
        // Si l'insertion en masse échoue, essayer individuellement
        console.log('🔍 Tentative d\'insertion individuelle...');
        const insertedSettings = [];
        
        for (const setting of reminderTypes) {
          const { data: singleData, error: singleError } = await supabase
            .from('reminder_settings')
            .insert(setting)
            .select()
            .single();
            
          if (singleError) {
            console.error(`❌ Erreur pour ${setting.reminder_type}:`, singleError);
          } else if (singleData) {
            console.log(`✅ Rappel créé: ${setting.reminder_type}`);
            insertedSettings.push(singleData);
          }
        }
        
        // Utiliser les données insérées individuellement
        if (insertedSettings.length > 0) {
          const formattedSettings: ReminderSettings[] = insertedSettings.map(setting => ({
            id: setting.reminder_type,
            type: setting.reminder_type as 'rent_payment' | 'lease_expiry' | 'maintenance_due',
            title: getTranslatedTitle(setting.reminder_type),
            description: getTranslatedDescription(setting.reminder_type),
            enabled: setting.enabled,
            daysBeforeDue: setting.days_before_due,
            methods: setting.notification_methods as ('email' | 'app')[]
          }));
          
          setReminderSettings(formattedSettings);
          console.log('✅ Paramètres par défaut créés avec succès (individuellement):', formattedSettings.length);
        }
        return;
      }

      // Si l'insertion en masse a réussi
      console.log('✅ Insertion en masse réussie:', data.length);
      
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
      console.log('✅ Paramètres par défaut créés avec succès:', formattedSettings.length);

    } catch (error) {
      console.error('❌ Erreur lors de la création des paramètres par défaut:', error);
    }
  };

  // Créer les types de rappels manquants
  const createMissingSettings = async (missingTypes: string[]) => {
    if (!user?.id) return;

    console.log('🔍 Création des types manquants:', missingTypes);

    const getDefaultSettingsForType = (type: string) => {
      const baseSettings = {
        user_id: user.id,
        reminder_type: type,
        enabled: false,
      };

      switch (type) {
        case 'rent_payment':
          return {
            ...baseSettings,
            days_before_due: 3,
            notification_methods: ['email', 'app']
          };
        case 'lease_expiry':
          return {
            ...baseSettings,
            days_before_due: 30,
            notification_methods: ['email']
          };
        case 'maintenance_due':
          return {
            ...baseSettings,
            days_before_due: 7,
            notification_methods: ['email', 'app']
          };
        default:
          return {
            ...baseSettings,
            days_before_due: 7,
            notification_methods: ['email']
          };
      }
    };

    try {
      for (const type of missingTypes) {
        const setting = getDefaultSettingsForType(type);
        const { data, error } = await supabase
          .from('reminder_settings')
          .insert(setting)
          .select()
          .single();
          
        if (error) {
          console.error(`❌ Erreur pour ${type}:`, error);
        } else if (data) {
          console.log(`✅ Rappel manquant créé: ${type}`);
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors de la création des types manquants:', error);
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
