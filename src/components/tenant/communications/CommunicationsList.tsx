import { Communication } from "@/types/tenant";
import { MessageSquare, Mail, AlertTriangle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CommunicationItem } from "./items/CommunicationItem";

interface CommunicationsListProps {
  filteredCommunications: Communication[];
  groupedCommunications: Record<string, Communication[]>;
  onCommunicationClick: (comm: Communication) => void;
  onToggleStatus: (comm: Communication) => void;
  onDeleteCommunication: (comm: Communication) => void;
}

const getCategoryIcon = (category: string | undefined) => {
  if (!category) return <MessageSquare className="h-4 w-4 text-blue-500" />;
  
  switch (category.toLowerCase()) {
    case 'urgent':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'maintenance':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'payment':
      return <Mail className="h-4 w-4 text-green-500" />;
    default:
      return <MessageSquare className="h-4 w-4 text-blue-500" />;
  }
};

const getCategoryColor = (category: string | undefined) => {
  if (!category) return 'bg-blue-100 text-blue-800';
  
  switch (category.toLowerCase()) {
    case 'urgent':
      return 'bg-red-100 text-red-800';
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-800';
    case 'payment':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

export const CommunicationsList = ({
  filteredCommunications,
  groupedCommunications,
  onCommunicationClick,
  onToggleStatus,
  onDeleteCommunication,
}: CommunicationsListProps) => {
  if (!filteredCommunications?.length) {
    return (
      <div className="text-center py-8 border-2 border-dashed rounded-lg">
        <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          Aucune communication trouvée
        </p>
      </div>
    );
  }

  const renderThreadedCommunications = (communications: Communication[]) => {
    // Group by parent_id
    const threads = communications.reduce((acc, comm) => {
      if (!comm) return acc;
      
      if (!comm.parent_id) {
        if (!acc[comm.id]) {
          acc[comm.id] = [comm];
        }
      } else {
        if (!acc[comm.parent_id]) {
          acc[comm.parent_id] = [];
        }
        acc[comm.parent_id].push(comm);
      }
      return acc;
    }, {} as Record<string, Communication[]>);

    return Object.entries(threads).map(([parentId, thread]) => (
      <div key={parentId} className="space-y-2">
        {thread.map((comm, index) => (
          <div
            key={comm.id}
            className={`${index > 0 ? 'ml-8 border-l-2 pl-4' : ''}`}
          >
            <CommunicationItem
              communication={comm}
              onClick={() => onCommunicationClick(comm)}
              onToggleStatus={() => onToggleStatus(comm)}
              onDelete={() => onDeleteCommunication(comm)}
              icon={getCategoryIcon(comm.category)}
              categoryColor={getCategoryColor(comm.category)}
            />
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedCommunications).map(([type, comms]) => {
        if (!type || !comms) return null;
        
        const filteredComms = comms.filter(comm => 
          comm && filteredCommunications.includes(comm)
        );

        if (filteredComms.length === 0) return null;

        return (
          <div key={type} className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              {type}
              <Badge variant="secondary" className="ml-2">
                {filteredComms.length}
              </Badge>
            </h3>
            <div className="space-y-2">
              {renderThreadedCommunications(filteredComms)}
            </div>
          </div>
        );
      })}
    </div>
  );
};