import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Bell, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Communication } from "@/types/tenant";

interface CommunicationItemProps {
  communication: Communication;
  onClick: () => void;
  onToggleStatus: () => void;
}

export const CommunicationItem = ({
  communication,
  onClick,
  onToggleStatus,
}: CommunicationItemProps) => {
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
        return <Badge variant="secondary">Read</Badge>;
      case 'unread':
        return <Badge variant="default">Unread</Badge>;
      default:
        return null;
    }
  };

  return (
    <div
      className="flex items-start gap-4 pl-10 relative animate-fade-in cursor-pointer hover:bg-accent/50 rounded-lg p-2 transition-colors"
      onClick={onClick}
    >
      <div className="absolute left-0 top-2 w-10 h-10 flex items-center justify-center bg-background rounded-full border z-10">
        {getTypeIcon(communication.type)}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium">{communication.subject}</h4>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus();
              }}
            >
              {getStatusBadge(communication.status)}
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {formatDate(communication.created_at)}
        </div>
      </div>
    </div>
  );
};