
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
  CheckCircle, 
  EyeOff,
  Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Communication } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Avatar } from "@/components/ui/avatar";

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
    if (!communication.category) return <MessageSquare className="h-6 w-6 text-blue-500" />;
    
    switch (communication.category.toLowerCase()) {
      case 'urgent':
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case 'maintenance':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'payment':
        return <Mail className="h-6 w-6 text-green-500" />;
      default:
        return <MessageSquare className="h-6 w-6 text-blue-500" />;
    }
  };

  const getCategoryBadge = () => {
    if (!communication.category) return "default";
    
    switch (communication.category.toLowerCase()) {
      case 'urgent':
        return "destructive";
      case 'maintenance':
        return "warning";
      case 'payment':
        return "success";
      default:
        return "default";
    }
  };

  // Style conditionnel pour les communications non lues
  const unreadStyle = communication.status === "unread" 
    ? "bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 dark:border-blue-400" 
    : "hover:bg-accent/50";
  
  const truncateContent = (content?: string) => {
    if (!content) return "";
    return content.length > 60 ? content.substring(0, 60) + '...' : content;
  };

  return (
    <div
      className={`flex items-start gap-4 relative animate-fade-in cursor-pointer rounded-lg p-3 transition-colors mb-2 ${unreadStyle}`}
      onClick={onClick}
    >
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
        {getCategoryIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-foreground dark:text-gray-100 truncate max-w-[250px]">
              {communication.subject}
            </h4>
            <Badge 
              variant={getCategoryBadge()}
              className="inline-flex items-center text-xs"
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
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus();
              }}
              title={communication.status === "read" ? t('markAsUnread') : t('markAsRead')}
            >
              {communication.status === "read" ? 
                <EyeOff className="h-4 w-4 text-muted-foreground" /> : 
                <Eye className="h-4 w-4 text-blue-500" />
              }
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title={t('deleteMessage')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground dark:text-gray-400 mb-1">
          {formatDate(communication.created_at)}
          {communication.is_from_tenant && 
            <Badge variant="outline" className="ml-2 text-xs">
              {t('sentByYou')}
            </Badge>
          }
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-1">
          {truncateContent(communication.content) || t('noContent')}
        </p>
      </div>
    </div>
  );
};
