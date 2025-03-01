
import { useState } from "react";
import { Settings, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useDashboardPreferences } from "@/components/dashboard/hooks/useDashboardPreferences";
import { Separator } from "@/components/ui/separator";

interface DashboardCustomizationProps {
  onOrderChange: (order: string[]) => void;
  onVisibilityChange: (hidden: string[]) => void;
  currentOrder: string[];
  hiddenSections: string[];
}

export const DashboardCustomization = ({ 
  onOrderChange, 
  onVisibilityChange,
  currentOrder,
  hiddenSections
}: DashboardCustomizationProps) => {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [tempOrder, setTempOrder] = useState<string[]>(currentOrder);
  const [tempHidden, setTempHidden] = useState<string[]>(hiddenSections);
  const { updatePreferences } = useDashboardPreferences();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setTempOrder((items) => {
        const oldIndex = items.indexOf(active.id.toString());
        const newIndex = items.indexOf(over.id.toString());
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  
  const handleToggleVisibility = (id: string) => {
    setTempHidden(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const handleSave = () => {
    onOrderChange(tempOrder);
    onVisibilityChange(tempHidden);
    
    updatePreferences.mutate({
      widget_order: tempOrder,
      hidden_sections: tempHidden
    });
    
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute right-4 top-4">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('customizeDashboard')}</DialogTitle>
          <DialogDescription>
            {t('customizeDashboardDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-4">
            <h3 className="font-medium">{t('visibleSections')}</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="payments">{t('payments')}</Label>
                <Switch 
                  id="payments" 
                  checked={!tempHidden.includes('payments')}
                  onCheckedChange={() => handleToggleVisibility('payments')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">{t('notifications')}</Label>
                <Switch 
                  id="notifications" 
                  checked={!tempHidden.includes('notifications')}
                  onCheckedChange={() => handleToggleVisibility('notifications')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="lease">{t('leaseStatus')}</Label>
                <Switch 
                  id="lease" 
                  checked={!tempHidden.includes('lease')}
                  onCheckedChange={() => handleToggleVisibility('lease')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance">{t('maintenance')}</Label>
                <Switch 
                  id="maintenance" 
                  checked={!tempHidden.includes('maintenance')}
                  onCheckedChange={() => handleToggleVisibility('maintenance')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="communications">{t('communications')}</Label>
                <Switch 
                  id="communications" 
                  checked={!tempHidden.includes('communications')}
                  onCheckedChange={() => handleToggleVisibility('communications')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="documents">{t('documents')}</Label>
                <Switch 
                  id="documents" 
                  checked={!tempHidden.includes('documents')}
                  onCheckedChange={() => handleToggleVisibility('documents')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="chart">{t('paymentHistory')}</Label>
                <Switch 
                  id="chart" 
                  checked={!tempHidden.includes('chart')}
                  onCheckedChange={() => handleToggleVisibility('chart')}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-medium">{t('rearrangeSections')}</h3>
            <p className="text-sm text-muted-foreground">{t('dragToRearrange')}</p>
            
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={tempOrder}
                strategy={rectSortingStrategy}
              >
                <div className="space-y-2">
                  {tempOrder.map((id) => (
                    <div 
                      key={id}
                      className="flex items-center gap-2 p-2 rounded border cursor-move bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <span className="text-sm font-medium">{t(id)}</span>
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4 mr-1" />
            {t('cancel')}
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            {t('saveChanges')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
