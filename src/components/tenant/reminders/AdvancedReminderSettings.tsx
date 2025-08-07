import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save, Calendar, Clock, Wrench } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { automatedRemindersTranslations } from '@/translations/features/automatedReminders';

interface ReminderSettings {
  id: string;
  type: 'rent_payment' | 'lease_expiry' | 'maintenance_due';
  title: string;
  description: string;
  enabled: boolean;
  daysBeforeDue: number;
  methods: ('email' | 'app')[];
}

interface AdvancedReminderSettingsProps {
  reminderSettings: ReminderSettings[];
  onUpdateSettings: (id: string, daysBeforeDue: number) => Promise<void>;
}

export const AdvancedReminderSettings: React.FC<AdvancedReminderSettingsProps> = ({
  reminderSettings,
  onUpdateSettings
}) => {
  const { language } = useLocale();
  const t = automatedRemindersTranslations[language as keyof typeof automatedRemindersTranslations] || automatedRemindersTranslations.en;
  
  const [open, setOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      // Initialiser les paramètres temporaires avec les valeurs actuelles
      const temp: Record<string, number> = {};
      reminderSettings.forEach(setting => {
        temp[setting.id] = setting.daysBeforeDue;
      });
      setTempSettings(temp);
    }
  };

  const handleSettingChange = (id: string, value: number) => {
    setTempSettings(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Sauvegarder chaque paramètre modifié
      for (const [id, daysBeforeDue] of Object.entries(tempSettings)) {
        const currentSetting = reminderSettings.find(s => s.id === id);
        if (currentSetting && currentSetting.daysBeforeDue !== daysBeforeDue) {
          await onUpdateSettings(id, daysBeforeDue);
        }
      }
      setOpen(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setSaving(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rent_payment':
        return <Calendar className="h-4 w-4 text-primary" />;
      case 'lease_expiry':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'maintenance_due':
        return <Wrench className="h-4 w-4 text-blue-600" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          {t.advancedSettings}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>{t.advancedSettings}</span>
          </DialogTitle>
          <DialogDescription>
            {t.advancedSettingsDescription}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {reminderSettings.map((setting) => (
            <div key={setting.id} className="space-y-2">
              <div className="flex items-center space-x-2">
                {getTypeIcon(setting.type)}
                <Label htmlFor={`days-${setting.id}`} className="text-sm font-medium">
                  {setting.title}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  id={`days-${setting.id}`}
                  type="number"
                  min="1"
                  max="365"
                  value={tempSettings[setting.id] || setting.daysBeforeDue}
                  onChange={(e) => handleSettingChange(setting.id, parseInt(e.target.value) || 1)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">
                  {t.daysBeforeDue}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={saving}
          >
            {t.cancel}
          </Button>
          <Button 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <Settings className="h-4 w-4 mr-2 animate-spin" />
                {t.saving}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {t.save}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};