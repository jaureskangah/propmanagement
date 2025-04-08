
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ShareDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  templateName?: string;
}

export function ShareDocumentDialog({
  isOpen,
  onClose,
  content,
  templateName = ""
}: ShareDocumentDialogProps) {
  const { t } = useLocale();
  const { toast } = useToast();
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleShareDocument = async () => {
    if (!recipientEmail || !content) {
      toast({
        title: t('documentGenerator.errorTitle'),
        description: t('documentGenerator.enterValidEmail'),
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    
    try {
      console.log("Sharing document...");
      console.log("Content length:", content.length);
      console.log("Recipient:", recipientEmail);
      
      // Call edge function to send email with attachment
      const { data, error } = await supabase.functions.invoke('share-document', {
        body: {
          recipientEmail,
          documentContent: content,
          documentTitle: templateName || t('documentGenerator.customDocument'),
        }
      });

      if (error) {
        console.error("Error response from function:", error);
        throw error;
      }
      
      console.log("Share document function response:", data);
      
      toast({
        title: t('documentGenerator.successTitle'),
        description: t('documentGenerator.documentShared'),
      });
      onClose();
      setRecipientEmail("");
    } catch (error) {
      console.error('Error sharing document:', error);
      toast({
        title: t('documentGenerator.errorTitle'),
        description: t('documentGenerator.shareError'),
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dark:bg-gray-800 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-100">{t('documentGenerator.shareDocument')}</DialogTitle>
          <DialogDescription className="dark:text-gray-300">{t('documentGenerator.shareDocumentDescription')}</DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Label htmlFor="email" className="dark:text-gray-200">{t('documentGenerator.recipients')}</Label>
          <Input 
            id="email"
            type="email"
            className="mt-2 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="email@exemple.com"
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}
                 className="dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600">
            {t('documentGenerator.cancel')}
          </Button>
          <Button onClick={handleShareDocument} disabled={isSending} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('documentGenerator.sending')}
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {t('documentGenerator.send')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
