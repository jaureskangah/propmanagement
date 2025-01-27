import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageCircle, Bell, MessageSquare } from "lucide-react";
import { Communication } from "@/types/tenant";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface CommunicationDetailsDialogProps {
  communication: Communication | null;
  onClose: () => void;
}

export const CommunicationDetailsDialog = ({
  communication,
  onClose,
}: CommunicationDetailsDialogProps) => {
  const { session } = useAuthSession();

  useEffect(() => {
    const updateMessageStatus = async () => {
      if (communication && session?.user) {
        try {
          console.log("Updating message status for:", {
            communicationId: communication.id,
            currentStatus: communication.status,
            isFromTenant: communication.is_from_tenant,
            userId: session?.user?.id
          });

          const { error } = await supabase
            .from('tenant_communications')
            .update({ status: 'read' })
            .eq('id', communication.id);

          if (error) {
            console.error('Error updating message status:', error);
          }
        } catch (error) {
          console.error('Error in updateMessageStatus:', error);
        }
      }
    };

    updateMessageStatus();
  }, [communication, session?.user]);

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

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return null;
    
    switch (status.toLowerCase()) {
      case 'read':
        return <Badge variant="secondary">Read</Badge>;
      case 'unread':
        return <Badge variant="default">Unread</Badge>;
      case 'sent':
        return <Badge variant="default">Sent</Badge>;
      default:
        return null;
    }
  };

  console.log("Communication details:", communication);

  return (
    <Dialog open={!!communication} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {communication && (
              <>
                {getTypeIcon(communication.type || '')}
                {communication.subject}
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {communication && (
            <>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{format(new Date(communication.created_at), "PPp", { locale: enUS })}</span>
                {getStatusBadge(communication.status)}
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">
                  {communication.content || "No content available"}
                </p>
              </div>
              {communication.attachments && communication.attachments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Attachments</h4>
                  <div className="flex gap-2">
                    {communication.attachments.map((attachment, index) => (
                      <Badge key={index} variant="secondary">
                        {attachment}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-2">
                <Badge variant="outline">
                  {communication.is_from_tenant ? "From tenant" : "From owner"}
                </Badge>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};