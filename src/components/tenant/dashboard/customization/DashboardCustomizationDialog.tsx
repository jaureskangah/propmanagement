
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
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useDashboardPreferences } from "@/components/dashboard/hooks/useDashboardPreferences";
import { Separator } from "@/components/ui/separator";
import { VisibleSectionsControl } from "./VisibleSectionsControl";
import { SortableSectionsList } from "./SortableSectionsList";

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
  const [isOpen, setIsOpen] = useState(false);
  const [tempOrder, setTempOrder] = useState<string[]>(currentOrder);
  const [tempHidden, setTempHidden] = useState<string[]>(hiddenSections);
  const { updatePreferences } = useDashboardPreferences();
  
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

  // Reset temporary state when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setTempOrder(currentOrder);
      setTempHidden(hiddenSections);
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-1" />
          {t('customizeDashboard')}
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
            <VisibleSectionsControl 
              tempHidden={tempHidden} 
              handleToggleVisibility={handleToggleVisibility} 
            />
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-medium">{t('rearrangeSections')}</h3>
            <p className="text-sm text-muted-foreground">{t('dragToRearrange')}</p>
            
            <SortableSectionsList 
              tempOrder={tempOrder}
              onDragEnd={handleDragEnd}
            />
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
