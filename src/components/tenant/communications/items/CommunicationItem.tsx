
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, AlertTriangle, MessageSquare, Paperclip, Trash2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Communication } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";

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
  
  // Fonctions pour déterminer l'icône et la couleur en fonction de la catégorie
  const getCategoryIcon = () => {
    if (!communication.category) return <MessageSquare className="h-5 w-5 text-blue-500" />;
    
    switch (communication.category.toLowerCase()) {
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

  const getCategoryColor = () => {
    if (!communication.category) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    
    switch (communication.category.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'payment':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  // Style conditionnel pour les communications non lues
  const unreadStyle = communication.status === "unread" 
    ? "bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 dark:border-blue-400" 
    : "";
  
  return (
    <div
      className={`flex items-start gap-4 pl-10 relative animate-fade-in cursor-pointer hover:bg-accent/50 rounded-lg p-2 transition-colors ${unreadStyle}`}
      onClick={onClick}
    >
      <div className="absolute left-0 top-2 w-10 h-10 flex items-center justify-center bg-background rounded-full border z-10">
        {getCategoryIcon()}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="space-x-2">
            <h4 className="font-medium inline text-foreground dark:text-gray-100">{communication.subject}</h4>
            <Badge 
              variant="secondary" 
              className={`${getCategoryColor()} inline-flex items-center text-xs`}
            >
              {communication.category}
            </Badge>
            {hasAttachments && (
              <Badge variant="outline" className="inline-flex items-center gap-1 text-xs">
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
              title={communication.status === "read" ? t('markAsUnread') : t('markAsRead')}
            >
              <Badge variant={communication.status === "read" ? "secondary" : "default"} className="text-xs">
                {communication.status}
              </Badge>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              onClick={(e) => {
                console.log("Delete button clicked in CommunicationItem");
                e.stopPropagation();
                onDelete();
              }}
              title={t('deleteMessage')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground dark:text-gray-400">
          {formatDate(communication.created_at)}
        </div>
      </div>
    </div>
  );
};
