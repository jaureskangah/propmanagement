
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/components/providers/LocaleProvider";

interface VisibleSectionsControlProps {
  tempHidden: string[];
  handleToggleVisibility: (id: string) => void;
}

export const VisibleSectionsControl = ({ 
  tempHidden, 
  handleToggleVisibility 
}: VisibleSectionsControlProps) => {
  const { t } = useLocale();
  
  const sections = [
    { id: 'payments', label: t('payments') },
    { id: 'notifications', label: t('notifications') },
    { id: 'lease', label: t('leaseStatus') },
    { id: 'maintenance', label: t('maintenance') },
    { id: 'communications', label: t('communications') },
    { id: 'documents', label: t('documents') },
    { id: 'chart', label: t('paymentHistory') },
  ];

  return (
    <div className="space-y-2">
      {sections.map(section => (
        <div key={section.id} className="flex items-center justify-between">
          <Label htmlFor={section.id}>{section.label}</Label>
          <Switch 
            id={section.id} 
            checked={!tempHidden.includes(section.id)}
            onCheckedChange={() => handleToggleVisibility(section.id)}
          />
        </div>
      ))}
    </div>
  );
};
