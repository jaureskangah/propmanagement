
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SortableSectionsList } from "./SortableSectionsList";
import { DragEndEvent, closestCenter, DndContext } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

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
  const [tempOrder, setTempOrder] = useState<string[]>([...currentOrder]);
  
  // Reset local state when props change
  useEffect(() => {
    setLocalHidden([...hiddenSections]);
    setTempOrder([...currentOrder]);
  }, [hiddenSections, currentOrder]);
  
  const handleCheckboxChange = (widgetId: string) => {
    if (localHidden.includes(widgetId)) {
      setLocalHidden(localHidden.filter(id => id !== widgetId));
    } else {
      setLocalHidden([...localHidden, widgetId]);
    }
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setTempOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  
  const handleSave = () => {
    onVisibilityChange(localHidden);
    onOrderChange(tempOrder);
    setOpen(false);
  };
  
  const widgetNames: Record<string, string> = {
    'property': t('property') || 'Property',
    'lease': t('leaseStatus') || 'Lease',
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
          {t('customizeDashboard')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('dashboardCustomization')}</DialogTitle>
          <DialogDescription>
            {t('customizeDashboardDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="visibility" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="visibility">{t('visibleSections')}</TabsTrigger>
            <TabsTrigger value="arrange">{t('rearrangeSections')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visibility" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tempOrder.map(widgetId => (
                <div key={widgetId} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`widget-${widgetId}`} 
                    checked={!localHidden.includes(widgetId)}
                    onCheckedChange={() => handleCheckboxChange(widgetId)}
                    disabled={widgetId === 'payments' || widgetId === 'communications'}
                  />
                  <Label 
                    htmlFor={`widget-${widgetId}`} 
                    className={`text-sm cursor-pointer ${(widgetId === 'payments' || widgetId === 'communications') ? 'text-gray-400' : ''}`}
                  >
                    {widgetNames[widgetId] || widgetId}
                    {(widgetId === 'payments' || widgetId === 'communications') && (
                      <span className="ml-1 text-xs text-gray-400">({t('hidden')})</span>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="arrange">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{t('dragToRearrange')}</p>
              <DndContext 
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableSectionsList tempOrder={tempOrder} />
              </DndContext>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave} className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white">
            {t('saveChanges')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
