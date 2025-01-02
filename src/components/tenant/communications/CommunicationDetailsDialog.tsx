import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Communication } from "@/types/tenant";
import { Mail, MessageCircle, Bell, MessageSquare } from "lucide-react";

interface CommunicationDetailsDialogProps {
  communication: Communication | null;
  onClose: () => void;
}

export const CommunicationDetailsDialog = ({
  communication,
  onClose,
}: CommunicationDetailsDialogProps) => {
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

  return (
    <Dialog open={!!communication} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {communication && (
              <>
                {getTypeIcon(communication.type)}
                {communication.subject}
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {communication && (
            <>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{formatDate(communication.created_at)}</span>
                {getStatusBadge(communication.status)}
              </div>
              <p className="text-sm">{communication.content || "Aucun contenu"}</p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};