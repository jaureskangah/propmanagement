import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Communication } from "@/types/tenant";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuthSession } from "@/hooks/useAuthSession";

interface CommunicationDetailsDialogProps {
  communication: Communication | null;
  onClose: () => void;
}

export const CommunicationDetailsDialog = ({
  communication,
  onClose,
}: CommunicationDetailsDialogProps) => {
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { session } = useAuthSession();

  if (!communication) return null;

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) {
      toast({
        title: "Erreur",
        description: "Le message ne peut pas être vide",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('tenant_communications')
        .insert({
          tenant_id: communication.tenant_id,
          type: 'message',
          subject: `Re: ${communication.subject}`,
          content: replyContent,
          category: communication.category,
          parent_id: communication.id,
          is_from_tenant: session?.user?.id === communication.tenant_id
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre réponse a été envoyée",
      });

      setReplyContent("");
      onClose();
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la réponse",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={!!communication} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{communication.subject}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {formatDate(communication.created_at)}
          </div>
          <div className="text-sm whitespace-pre-wrap">{communication.content}</div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Répondre</h4>
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Écrivez votre réponse ici..."
              rows={4}
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button 
                onClick={handleSubmitReply} 
                disabled={isSubmitting || !replyContent.trim()}
              >
                {isSubmitting ? "Envoi..." : "Envoyer"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};