
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableMetricProps {
  id: string;
  children: React.ReactNode;
}

export const SortableMetric = ({ id, children }: SortableMetricProps) => {
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
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="hover:cursor-grab active:cursor-grabbing rounded-lg transition-all duration-200"
    >
      {children}
    </div>
  );
};
