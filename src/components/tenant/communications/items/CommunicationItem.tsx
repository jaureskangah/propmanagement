import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Bell, MessageSquare, Paperclip, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Communication } from "@/types/tenant";

interface CommunicationItemProps {
  communication: Communication;
  onClick: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
  icon?: React.ReactNode;
  categoryColor?: string;
}

export const CommunicationItem = ({
  communication,
  onClick,
  onToggleStatus,
  onDelete,
  icon,
  categoryColor = "bg-blue-100 text-blue-800"
}: CommunicationItemProps) => {
  const hasAttachments = communication.attachments && communication.attachments.length > 0;
  
  return (
    <div
      className="flex items-start gap-4 pl-10 relative animate-fade-in cursor-pointer hover:bg-accent/50 rounded-lg p-2 transition-colors"
      onClick={onClick}
    >
      <div className="absolute left-0 top-2 w-10 h-10 flex items-center justify-center bg-background rounded-full border z-10">
        {icon || <MessageSquare className="h-5 w-5 text-purple-500" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="space-x-2">
            <h4 className="font-medium inline">{communication.subject}</h4>
            <Badge 
              variant="secondary" 
              className={`${categoryColor} inline-flex items-center`}
            >
              {communication.category}
            </Badge>
            {hasAttachments && (
              <Badge variant="outline" className="inline-flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                {communication.attachments?.length}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus();
              }}
            >
              <Badge variant={communication.status === "read" ? "secondary" : "default"}>
                {communication.status}
              </Badge>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {formatDate(communication.created_at)}
          <Badge variant="outline" className="ml-2">
            {communication.is_from_tenant ? "From tenant" : "From owner"}
          </Badge>
        </div>
      </div>
    </div>
  );
};