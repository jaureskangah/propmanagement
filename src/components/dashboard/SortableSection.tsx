import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group cursor-move"
      {...attributes}
      {...listeners}
    >
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex flex-col gap-1">
          <div className="w-1 h-1 rounded-full bg-muted-foreground" />
          <div className="w-1 h-1 rounded-full bg-muted-foreground" />
          <div className="w-1 h-1 rounded-full bg-muted-foreground" />
        </div>
      </div>
      {children}
    </div>
  );
}