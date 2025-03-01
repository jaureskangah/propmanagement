
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useState, useEffect } from "react";

interface DashboardCustomizationDialogProps {
  onOrderChange: (order: string[]) => void;
  onVisibilityChange: (hidden: string[]) => void;
  currentOrder: string[];
  hiddenSections: string[];
}

export const DashboardCustomizationDialog = ({
  onOrderChange,
  onVisibilityChange,
  currentOrder,
  hiddenSections
}: DashboardCustomizationDialogProps) => {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [localHidden, setLocalHidden] = useState<string[]>([...hiddenSections]);
  
  // Reset local state when props change
  useEffect(() => {
    setLocalHidden([...hiddenSections]);
  }, [hiddenSections]);
  
  const handleCheckboxChange = (widgetId: string) => {
    if (localHidden.includes(widgetId)) {
      setLocalHidden(localHidden.filter(id => id !== widgetId));
    } else {
      setLocalHidden([...localHidden, widgetId]);
    }
  };
  
  const handleSave = () => {
    onVisibilityChange(localHidden);
    setOpen(false);
  };
  
  const widgetNames: Record<string, string> = {
    'lease': t('lease') || 'Lease',
    'notifications': t('notifications') || 'Notifications',
    'payments': t('payments') || 'Payments',
    'maintenance': t('maintenance') || 'Maintenance',
    'communications': t('communications') || 'Communications',
    'documents': t('documents') || 'Documents',
    'chart': t('paymentHistory') || 'Payment History'
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 hover:bg-blue-50 hover:text-blue-700 transition-all"
        >
          <Settings className="h-4 w-4" />
          {t('customize')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('dashboardCustomization')}</DialogTitle>
          <DialogDescription>
            {t('customizeDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">{t('visibleSections')}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentOrder.map(widgetId => (
                <div key={widgetId} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`widget-${widgetId}`} 
                    checked={!localHidden.includes(widgetId)}
                    onCheckedChange={() => handleCheckboxChange(widgetId)}
                  />
                  <Label htmlFor={`widget-${widgetId}`} className="text-sm cursor-pointer">
                    {widgetNames[widgetId] || widgetId}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSave}>
              {t('save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
