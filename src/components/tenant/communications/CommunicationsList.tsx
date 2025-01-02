import { Communication } from "@/types/tenant";
import { MessageSquare, Search, Calendar, Mail, MessageCircle, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

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
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'email':
        return <Mail className="h-5 w-5 text-blue-500" />;
      case 'sms':
        return <MessageCircle className="h-5 w-5 text-green-500" />;
      case 'notification':
        return <Bell className="h-5 w-5 text-yellow-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'read':
        return <Badge variant="secondary">Lu</Badge>;
      case 'unread':
        return <Badge variant="default">Non lu</Badge>;
      default:
        return null;
    }
  };

  if (filteredCommunications.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed rounded-lg">
        <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          Aucune communication trouvée
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedCommunications).map(([type, comms]) => (
        <div key={type} className="space-y-2">
          <h3 className="font-medium flex items-center gap-2">
            {getTypeIcon(type)} {type}
            <Badge variant="secondary" className="ml-2">
              {comms.length}
            </Badge>
          </h3>
          <div className="space-y-2 relative before:absolute before:left-5 before:top-0 before:bottom-0 before:w-px before:bg-border">
            {comms
              .filter(comm => filteredCommunications.includes(comm))
              .map((comm, index) => (
                <div
                  key={comm.id}
                  className="flex items-start gap-4 pl-10 relative animate-fade-in cursor-pointer hover:bg-accent/50 rounded-lg p-2 transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => onCommunicationClick(comm)}
                >
                  <div className="absolute left-0 top-2 w-10 h-10 flex items-center justify-center bg-background rounded-full border z-10">
                    {getTypeIcon(comm.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{comm.subject}</h4>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleStatus(comm);
                          }}
                        >
                          {getStatusBadge(comm.status)}
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(comm.created_at)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};