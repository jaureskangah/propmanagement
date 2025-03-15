
import { MoveVertical } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableSectionsListProps {
  tempOrder: string[];
}

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

const SortableItem = ({ id, children }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isHidden = id === 'payments' || id === 'communications';

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`cursor-move ${isHidden ? 'opacity-50' : ''}`}
    >
      {children}
    </div>
  );
};

export const SortableSectionsList = ({ tempOrder }: SortableSectionsListProps) => {
  const { t } = useLocale();
  
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
    <SortableContext 
      items={tempOrder}
      strategy={rectSortingStrategy}
    >
      <div className="space-y-2">
        {tempOrder.map((id) => {
          const isHidden = id === 'payments' || id === 'communications';
          
          return (
            <SortableItem key={id} id={id}>
              <div className={`flex items-center gap-2 p-3 rounded border ${isHidden ? 'bg-gray-100 text-gray-400' : 'bg-muted/60 hover:bg-muted'} transition-colors`}>
                <MoveVertical className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-sm font-medium">
                  {widgetNames[id] || id}
                  {isHidden && (
                    <span className="ml-1 text-xs text-gray-400">({t('hidden')})</span>
                  )}
                </span>
              </div>
            </SortableItem>
          );
        })}
      </div>
    </SortableContext>
  );
};
