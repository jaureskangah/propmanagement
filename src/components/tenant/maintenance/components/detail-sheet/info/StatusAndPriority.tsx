
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface StatusAndPriorityProps {
  status: string;
  priority: string;
}

export const StatusAndPriority = ({ status, priority }: StatusAndPriorityProps) => {
  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Resolved": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "In Progress": return <Clock className="h-5 w-5 text-blue-500" />;
      case "Pending": return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default: return null;
    }
  };

  const getPriorityClass = (priority: string) => {
    switch(priority) {
      case "Urgent": return "bg-red-500 hover:bg-red-600";
      case "High": return "bg-orange-500 hover:bg-orange-600";
      case "Medium": return "bg-yellow-500 hover:bg-yellow-600";
      case "Low": return "bg-green-500 hover:bg-green-600";
      default: return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case "Resolved": return "bg-green-500 hover:bg-green-600";
      case "In Progress": return "bg-blue-500 hover:bg-blue-600";
      case "Pending": return "bg-yellow-500 hover:bg-yellow-600";
      default: return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Badge className={`${getStatusClass(status)} text-white`}>
        <span className="flex items-center gap-1">
          {getStatusIcon(status)} {status}
        </span>
      </Badge>
      <Badge className={`${getPriorityClass(priority)} text-white`}>
        {priority}
      </Badge>
    </div>
  );
};
