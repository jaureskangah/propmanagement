
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Communication } from "@/types/tenant";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useLocale } from "@/components/providers/LocaleProvider";
import { AlertTriangle, Clock, MessageSquare, PaperclipIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CommunicationDetailsDialogProps {
  communication: Communication | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export const CommunicationDetailsDialog = ({
  communication,
  isOpen,
  onClose,
  onUpdate
}: CommunicationDetailsDialogProps) => {
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { locale, t } = useLocale();

  const dateLocale = locale === 'fr' ? fr : enUS;

  const getCategoryIcon = (category: string | undefined) => {
    if (!category) return <MessageSquare className="h-5 w-5 text-blue-500" />;
    
    switch (category.toLowerCase()) {
      case 'urgent':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'maintenance':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
    }
  };

  const getCategoryColor = (category: string | undefined) => {
    if (!category) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    
    switch (category.toLowerCase()) {
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

  const handleSubmitReply = async () => {
    if (!communication?.tenant_id) {
      toast({
        title: t('error'),
        description: t('cantReply'),
        variant: "destructive",
      });
      return;
    }

    if (!replyContent.trim()) {
      toast({
        title: t('error'),
        description: t('messageCantBeEmpty'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("tenant_communications").insert({
        tenant_id: communication.tenant_id,
        type: "message",
        subject: `Re: ${communication.subject}`,
        content: replyContent,
        parent_id: communication.id,
        category: communication.category || "general",
        is_from_tenant: true,
        status: "unread"
      });

      if (error) throw error;

      toast({
        title: t('success'),
        description: t('replySuccess'),
      });

      setReplyContent("");
      onClose();
      onUpdate?.();
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        title: t('error'),
        description: t('sendReplyError'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!communication) {
    return null;
  }

  const hasAttachments = communication.attachments && communication.attachments.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {getCategoryIcon(communication.category)}
            <DialogTitle className="text-lg">{communication.subject}</DialogTitle>
            <Badge 
              variant="secondary" 
              className={`${getCategoryColor(communication.category)} text-xs`}
            >
              {communication.category}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {format(new Date(communication.created_at), "PPp", { locale: dateLocale })}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm p-4 bg-muted/30 rounded-md whitespace-pre-wrap">
            {communication.content || t('noContent')}
          </div>

          {hasAttachments && (
            <div className="border rounded-md p-3">
              <div className="text-sm font-medium mb-2 flex items-center gap-2">
                <PaperclipIcon className="h-4 w-4" />
                {t('attachments')} ({communication.attachments?.length})
              </div>
              <div className="space-y-1">
                {communication.attachments?.map((attachment, index) => (
                  <div key={index} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    <a href={attachment} target="_blank" rel="noopener noreferrer">
                      {attachment.split('/').pop()}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">{t('reply')}</h4>
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={t('replyPlaceholder')}
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={onClose}>
                {t('cancel')}
              </Button>
              <Button 
                onClick={handleSubmitReply} 
                disabled={isSubmitting || !replyContent.trim()}
              >
                {isSubmitting ? t('sending') : t('send')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
