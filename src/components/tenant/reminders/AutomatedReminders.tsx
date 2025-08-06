import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, Mail, MessageSquare, Settings, Clock } from 'lucide-react';
import { FeatureGate } from '@/components/subscription/FeatureGate';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useToast } from '@/hooks/use-toast';

interface ReminderSettings {
  id: string;
  type: 'rent_payment' | 'lease_expiry' | 'maintenance_due';
  title: string;
  description: string;
  enabled: boolean;
  daysBeforeDue: number;
  methods: ('email' | 'app')[];
}

export const AutomatedReminders = () => {
  const { t } = useLocale();
  const { toast } = useToast();
  
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings[]>([
    {
      id: 'rent_payment',
      type: 'rent_payment',
      title: 'Rappels de paiement de loyer',
      description: 'Rappels automatiques avant l\'échéance du loyer',
      enabled: false,
      daysBeforeDue: 3,
      methods: ['email', 'app']
    },
    {
      id: 'lease_expiry',
      type: 'lease_expiry',
      title: 'Expiration du bail',
      description: 'Rappels avant l\'expiration des baux',
      enabled: false,
      daysBeforeDue: 30,
      methods: ['email']
    },
    {
      id: 'maintenance_due',
      type: 'maintenance_due',
      title: 'Maintenance préventive',
      description: 'Rappels pour les tâches de maintenance programmées',
      enabled: false,
      daysBeforeDue: 7,
      methods: ['email', 'app']
    }
  ]);

  const toggleReminder = (id: string) => {
    setReminderSettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
    
    toast({
      title: "Rappel mis à jour",
      description: "Les paramètres de rappel ont été sauvegardés.",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rent_payment':
        return <Calendar className="h-4 w-4" />;
      case 'lease_expiry':
        return <Clock className="h-4 w-4" />;
      case 'maintenance_due':
        return <Settings className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'email':
        return (
          <Badge variant="outline" className="text-xs">
            <Mail className="h-3 w-3 mr-1" />
            Email
          </Badge>
        );
      case 'app':
        return (
          <Badge variant="outline" className="text-xs">
            <MessageSquare className="h-3 w-3 mr-1" />
            App
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <FeatureGate feature="automatedReminders">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Rappels Automatisés</h2>
            <p className="text-muted-foreground">
              Configurez les notifications automatiques pour vos locataires et propriétés
            </p>
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres avancés
          </Button>
        </div>

        <div className="grid gap-4">
          {reminderSettings.map((setting) => (
            <Card key={setting.id} className="transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      {getTypeIcon(setting.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{setting.title}</CardTitle>
                      <CardDescription>{setting.description}</CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={() => toggleReminder(setting.id)}
                  />
                </div>
              </CardHeader>
              
              {setting.enabled && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Délai d'envoi :</span>
                      <Badge variant="secondary">
                        {setting.daysBeforeDue} jour{setting.daysBeforeDue > 1 ? 's' : ''} avant
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Méthodes :</span>
                      <div className="flex space-x-2">
                        {setting.methods.map((method) => getMethodBadge(method))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Statistiques des rappels</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">24</div>
                <div className="text-sm text-muted-foreground">Rappels envoyés ce mois</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">18</div>
                <div className="text-sm text-muted-foreground">Paiements à temps</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">6</div>
                <div className="text-sm text-muted-foreground">Rappels en attente</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FeatureGate>
  );
};