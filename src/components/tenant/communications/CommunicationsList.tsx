
import { Communication } from "@/types/tenant";
import { MessageSquare, Mail, AlertTriangle, Clock, MessageCircle, AlertOctagon, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CommunicationItem } from "./items/CommunicationItem";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CommunicationsListProps {
  filteredCommunications: Communication[];
  groupedCommunications: Record<string, Communication[]>;
  onCommunicationClick: (comm: Communication) => void;
  onToggleStatus: (comm: Communication) => void;
  onDeleteCommunication: (comm: Communication) => void;
  searchTerm?: string;
}

export const CommunicationsList = ({
  filteredCommunications,
  groupedCommunications,
  onCommunicationClick,
  onToggleStatus,
  onDeleteCommunication,
  searchTerm = '',
}: CommunicationsListProps) => {
  const { t } = useLocale();
  const [showAll, setShowAll] = useState(false);
  
  if (!filteredCommunications?.length) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20 dark:border-gray-700 flex flex-col items-center justify-center">
        <MessageCircle className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">
          {t('noCommunications')}
        </p>
      </div>
    );
  }

  const renderThreadedCommunications = (communications: Communication[], limit?: number) => {
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

    // Limit the number of threads to display if limit is provided
    const threadsEntries = Object.entries(threads);
    const displayThreads = limit && !showAll ? threadsEntries.slice(0, limit) : threadsEntries;

    return displayThreads.map(([parentId, thread]) => (
      <div key={parentId} className="space-y-1 mb-4 bg-background rounded-lg shadow-sm">
        {thread.map((comm, index) => (
          <div
            key={comm.id}
            className={`${index > 0 ? 'ml-6 border-l-2 pl-3 border-gray-200 dark:border-gray-700' : ''}`}
          >
            <CommunicationItem
              communication={comm}
              onClick={() => onCommunicationClick(comm)}
              onToggleStatus={() => onToggleStatus(comm)}
              onDelete={() => onDeleteCommunication(comm)}
              searchTerm={searchTerm}
            />
          </div>
        ))}
      </div>
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'email':
        return <Mail className="h-5 w-5 mr-2 text-blue-500" />;
      case 'notification':
        return <AlertOctagon className="h-5 w-5 mr-2 text-red-500" />;
      default:
        return <MessageSquare className="h-5 w-5 mr-2 text-green-500" />;
    }
  };

  // Calculate total threads count
  const totalThreadsCount = Object.values(groupedCommunications).reduce((total, comms) => {
    if (!comms) return total;
    
    // Count only parent threads (no parent_id)
    const parentThreads = comms.filter(comm => 
      comm && filteredCommunications.includes(comm) && !comm.parent_id
    );
    
    return total + parentThreads.length;
  }, 0);

  return (
    <div className="space-y-6">
      {Object.entries(groupedCommunications).map(([type, comms]) => {
        if (!type || !comms) return null;
        
        const filteredComms = comms.filter(comm => 
          comm && filteredCommunications.includes(comm)
        );

        if (filteredComms.length === 0) return null;

        const typeDisplayName = type.charAt(0).toUpperCase() + type.slice(1);

        return (
          <div key={type} className="space-y-3">
            <h3 className="font-medium flex items-center gap-1 text-foreground dark:text-gray-200 pt-2 pb-1 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                {getTypeIcon(type)}
                {typeDisplayName}
              </div>
              <Badge variant="secondary" className="ml-2 text-xs">
                {filteredComms.length}
              </Badge>
            </h3>
            <div className="space-y-3">
              {renderThreadedCommunications(filteredComms, 5)}
            </div>
          </div>
        );
      })}

      {totalThreadsCount > 5 && (
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1"
          >
            {showAll ? (
              <>
                {t('showLess')} <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                {t('showMore')} <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
