
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Mail, Calendar, Clock, AlertCircle, CheckCircle, Send } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

interface Tenant {
  id: string;
  name: string;
  email: string;
  rent_amount: number;
  disable_reminders: boolean;
}

export const RentRemindersManagement = () => {
  const [reminders, setReminders] = useState<RentReminder[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Récupérer les rappels des 3 derniers mois
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const { data: remindersData, error: remindersError } = await supabase
        .from('rent_payment_reminders')
        .select(`
          *,
          tenants!inner(name, email, rent_amount)
        `)
        .gte('reminder_date', threeMonthsAgo.toISOString().split('T')[0])
        .order('created_at', { ascending: false });

      if (remindersError) throw remindersError;

      // Récupérer tous les locataires
      const { data: tenantsData, error: tenantsError } = await supabase
        .from('tenants')
        .select('id, name, email, rent_amount, disable_reminders')
        .order('name');

      if (tenantsError) throw tenantsError;

      setReminders(remindersData || []);
      setTenants(tenantsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données des rappels",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleReminders = async (tenantId: string, disabled: boolean) => {
    try {
      const { error } = await supabase
        .from('tenants')
        .update({ disable_reminders: disabled })
        .eq('id', tenantId);

      if (error) throw error;

      setTenants(prev => prev.map(tenant => 
        tenant.id === tenantId 
          ? { ...tenant, disable_reminders: disabled }
          : tenant
      ));

      toast({
        title: "Paramètres mis à jour",
        description: disabled 
          ? "Les rappels ont été désactivés pour ce locataire"
          : "Les rappels ont été activés pour ce locataire",
      });
    } catch (error) {
      console.error('Error updating tenant:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres",
        variant: "destructive",
      });
    }
  };

  const sendManualReminder = async (tenantId: string) => {
    setSendingReminder(tenantId);
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
        fetchData(); // Rafraîchir les données
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
    } finally {
      setSendingReminder(null);
    }
  };

  const sendAllReminders = async () => {
    setSendingReminder('all');
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
        fetchData(); // Rafraîchir les données
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
    } finally {
      setSendingReminder(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Rappels de loyer</h2>
          <p className="text-gray-600">Gestion des rappels de paiement automatiques</p>
        </div>
        <Button 
          onClick={sendAllReminders}
          disabled={sendingReminder === 'all'}
          className="flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          {sendingReminder === 'all' ? 'Envoi en cours...' : 'Envoyer tous les rappels'}
        </Button>
      </div>

      {/* Configuration des locataires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Configuration des rappels par locataire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tenants.map((tenant) => (
              <div key={tenant.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{tenant.name}</h4>
                  <p className="text-sm text-gray-600">{tenant.email}</p>
                  <p className="text-sm text-gray-500">Loyer: {tenant.rent_amount}€</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!tenant.disable_reminders}
                      onCheckedChange={(checked) => toggleReminders(tenant.id, !checked)}
                    />
                    <span className="text-sm">
                      {tenant.disable_reminders ? 'Désactivé' : 'Activé'}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sendManualReminder(tenant.id)}
                    disabled={sendingReminder === tenant.id}
                    className="flex items-center gap-1"
                  >
                    <Mail className="h-3 w-3" />
                    {sendingReminder === tenant.id ? 'Envoi...' : 'Envoyer'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historique des rappels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Historique des rappels
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reminders.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Aucun rappel envoyé pour le moment
            </p>
          ) : (
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{reminder.tenants.name}</h4>
                    <p className="text-sm text-gray-600">{reminder.tenants.email}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(reminder.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </span>
                      <span>
                        Mois cible: {format(new Date(reminder.target_month), 'MMMM yyyy', { locale: fr })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={reminder.status === 'sent' ? 'default' : 'destructive'}>
                      {reminder.status === 'sent' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 mr-1" />
                      )}
                      {reminder.status === 'sent' ? 'Envoyé' : 'Échec'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
