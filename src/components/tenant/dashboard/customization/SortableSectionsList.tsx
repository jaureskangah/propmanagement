
import { MoveVertical } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
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
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "../SortableItem";

interface SortableSectionsListProps {
  tempOrder: string[];
  onDragEnd: (event: DragEndEvent) => void;
}

export const SortableSectionsList = ({ tempOrder, onDragEnd }: SortableSectionsListProps) => {
  const { t } = useLocale();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext 
        items={tempOrder}
        strategy={rectSortingStrategy}
      >
        <div className="space-y-2">
          {tempOrder.map((id) => (
            <SortableItem key={id} id={id}>
              <div className="flex items-center gap-2 p-3 rounded border bg-muted/60 hover:bg-muted transition-colors">
                <MoveVertical className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-sm font-medium">{t(id)}</span>
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
