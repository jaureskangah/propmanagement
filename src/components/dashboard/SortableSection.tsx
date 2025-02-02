import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface SortableSectionProps {
  id: string;
  children: React.ReactNode;
}

export function SortableSection({ id, children }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'relative',
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? 'opacity-50' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="group">
        {children}
      </div>
    </div>
  );
}