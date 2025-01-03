import { Communication } from "@/types/tenant";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CommunicationItem } from "./items/CommunicationItem";

interface CommunicationsListProps {
  filteredCommunications: Communication[];
  groupedCommunications: Record<string, Communication[]>;
  onCommunicationClick: (comm: Communication) => void;
  onToggleStatus: (comm: Communication) => void;
}

export const CommunicationsList = ({
  filteredCommunications,
  groupedCommunications,
  onCommunicationClick,
  onToggleStatus,
}: CommunicationsListProps) => {
  if (filteredCommunications.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed rounded-lg">
        <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          No communications found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedCommunications).map(([type, comms]) => {
        const filteredComms = comms.filter(comm => 
          filteredCommunications.includes(comm)
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
            <div className="space-y-2 relative before:absolute before:left-5 before:top-0 before:bottom-0 before:w-px before:bg-border">
              {filteredComms.map((comm, index) => (
                <CommunicationItem
                  key={comm.id}
                  communication={comm}
                  onClick={() => onCommunicationClick(comm)}
                  onToggleStatus={() => onToggleStatus(comm)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};