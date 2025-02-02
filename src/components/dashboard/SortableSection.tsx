import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { CSSProperties } from "react";

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

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 0,
    touchAction: 'none',
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
        className="absolute -left-8 top-1/2 -translate-y-1/2 p-2 cursor-grab active:cursor-grabbing hover:bg-accent rounded-lg group"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="group">
        {children}
      </div>
    </div>
  );
}