
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  MessageCircle, 
  AlertTriangle, 
  MessageSquare, 
  Paperclip, 
  Trash2, 
  Clock, 
  Eye,
  EyeOff
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Communication } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface CommunicationItemProps {
  communication: Communication;
  onClick: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

export const CommunicationItem = ({
  communication,
  onClick,
  onToggleStatus,
  onDelete,
}: CommunicationItemProps) => {
  const hasAttachments = communication.attachments && communication.attachments.length > 0;
  const { t } = useLocale();
  
  const getCategoryIcon = () => {
    switch (communication.category?.toLowerCase()) {
      case 'urgent':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'maintenance':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'payment':
        return <Mail className="h-5 w-5 text-green-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
    }
  };

  const getCategoryStyle = () => {
    switch (communication.category?.toLowerCase()) {
      case 'urgent':
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300";
      case 'maintenance':
        return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300";
      case 'payment':
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300";
    }
  };

  return (
    <div
      className={cn(
        "group relative p-4 transition-all duration-200 ease-in-out",
        "hover:bg-accent/5 rounded-lg border border-transparent",
        "hover:border-accent/20 cursor-pointer",
        communication.status === "unread" && "bg-blue-50/50 dark:bg-blue-950/20"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Avatar className={cn(
            "h-10 w-10 bg-gradient-to-br",
            getCategoryStyle()
          )}>
            {getCategoryIcon()}
          </Avatar>
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm line-clamp-1 text-foreground">
              {communication.subject}
            </h4>
            <div className="flex items-center gap-2">
              {communication.status === "unread" && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  {t('unread')}
                </Badge>
              )}
              <Badge variant="outline" className={cn("text-xs", getCategoryStyle())}>
                {communication.category}
              </Badge>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {communication.content}
          </p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <time>{formatDate(communication.created_at)}</time>
              {hasAttachments && (
                <Badge variant="outline" className="gap-1 h-5 flex items-center text-xs">
                  <Paperclip className="h-3 w-3" />
                  {communication.attachments?.length}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStatus();
                }}
                title={communication.status === "read" ? "Marquer comme non lu" : "Marquer comme lu"}
              >
                {communication.status === "read" ? 
                  <EyeOff className="h-4 w-4" /> : 
                  <Eye className="h-4 w-4" />
                }
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
