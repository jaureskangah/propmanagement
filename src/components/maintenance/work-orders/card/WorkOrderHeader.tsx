
import { Badge } from "@/components/ui/badge";
import { Bookmark, AlertTriangle } from "lucide-react";

interface WorkOrderHeaderProps {
  title: string;
  priority?: string;
}

export const WorkOrderHeader = ({ title, priority }: WorkOrderHeaderProps) => {
  const getPriorityBadge = () => {
    if (!priority) return null;
    
    let color = "bg-gray-100 text-gray-800";
    let icon = null;
    
    switch (priority.toLowerCase()) {
      case "high":
      case "haute":
        color = "bg-red-100 text-red-800";
        icon = <AlertTriangle className="h-3 w-3 mr-1" />;
        break;
      case "medium":
      case "moyenne":
        color = "bg-orange-100 text-orange-800";
        break;
      case "low":
      case "basse":
        color = "bg-green-100 text-green-800";
        break;
    }
    
    return (
      <Badge className={`${color} ml-2 flex items-center`}>
        {icon}
        {priority}
      </Badge>
    );
  };
  
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start">
        <Bookmark className="h-5 w-5 text-blue-600 mr-2 mt-1" />
        <div>
          <h3 className="font-semibold text-lg text-gray-800 leading-tight">
            {title}
          </h3>
        </div>
      </div>
      {getPriorityBadge()}
    </div>
  );
};
