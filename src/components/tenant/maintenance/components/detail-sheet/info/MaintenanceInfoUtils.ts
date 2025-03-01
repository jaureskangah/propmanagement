
export const getStatusIcon = (status: string) => {
  switch(status) {
    case "Resolved": return "CheckCircle2";
    case "In Progress": return "Clock";
    case "Pending": return "AlertCircle";
    default: return null;
  }
};

export const getPriorityClass = (priority: string) => {
  switch(priority) {
    case "Urgent": return "bg-red-500 hover:bg-red-600";
    case "High": return "bg-orange-500 hover:bg-orange-600";
    case "Medium": return "bg-yellow-500 hover:bg-yellow-600";
    case "Low": return "bg-green-500 hover:bg-green-600";
    default: return "bg-gray-500 hover:bg-gray-600";
  }
};

export const getStatusClass = (status: string) => {
  switch(status) {
    case "Resolved": return "bg-green-500 hover:bg-green-600";
    case "In Progress": return "bg-blue-500 hover:bg-blue-600";
    case "Pending": return "bg-yellow-500 hover:bg-yellow-600";
    default: return "bg-gray-500 hover:bg-gray-600";
  }
};
