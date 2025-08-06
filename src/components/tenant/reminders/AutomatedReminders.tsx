
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, Mail, MessageSquare, Settings, Clock, Loader2 } from 'lucide-react';
import { FeatureGate } from '@/components/subscription/FeatureGate';
import { useLocale } from '@/components/providers/LocaleProvider';
import { automatedRemindersTranslations } from '@/translations/features/automatedReminders';
import { useReminderSettings } from '@/hooks/reminders/useReminderSettings';

export const AutomatedReminders = () => {
  const { language } = useLocale();
  const t = automatedRemindersTranslations[language as keyof typeof automatedRemindersTranslations] || automatedRemindersTranslations.en;
  
  const { reminderSettings, loading, updateReminderSetting } = useReminderSettings();

  const toggleReminder = async (id: string) => {
    const setting = reminderSettings.find(s => s.id === id);
    if (!setting) return;

    await updateReminderSetting(id, { enabled: !setting.enabled });
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
            {t.email}
          </Badge>
        );
      case 'app':
        return (
          <Badge variant="outline" className="text-xs">
            <MessageSquare className="h-3 w-3 mr-1" />
            {t.app}
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <FeatureGate feature="automatedReminders">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">{t.loadingReminders}</p>
          </div>
        </div>
      </FeatureGate>
    );
  }

  return (
    <FeatureGate feature="automatedReminders">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{t.title}</h2>
            <p className="text-muted-foreground">
              {t.subtitle}
            </p>
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            {t.advancedSettings}
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
                      <span className="text-muted-foreground">{t.sendDelay}</span>
                      <Badge variant="secondary">
                        {setting.daysBeforeDue} {setting.daysBeforeDue > 1 ? t.daysBeforePlural : t.daysBefore}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t.methods}</span>
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
              <span>{t.reminderStats}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">24</div>
                <div className="text-sm text-muted-foreground">{t.sentThisMonth}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">18</div>
                <div className="text-sm text-muted-foreground">{t.onTimePayments}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">6</div>
                <div className="text-sm text-muted-foreground">{t.pendingReminders}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FeatureGate>
  );
};
