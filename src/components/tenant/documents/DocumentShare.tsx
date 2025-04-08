
import { useState } from "react";
import { Send, X, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { TenantDocument } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useAuth } from "@/components/AuthProvider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

interface DocumentShareProps {
  document: TenantDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DocumentShare = ({ document, open, onOpenChange }: DocumentShareProps) => {
  const { t } = useLocale();
  const { toast } = useToast();
  const { user } = useAuth();
  const [recipients, setRecipients] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleShare = async () => {
    if (!document || !user) return;
    
    const emails = recipients.split(",").map(email => email.trim()).filter(email => email);
    
    if (emails.length === 0) {
      toast({
        title: t("documentGenerator.errorTitle"),
        description: t("documentGenerator.enterValidEmail"),
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const { error } = await supabase.functions.invoke('share-document', {
        body: {
          documentId: document.id,
          documentName: document.name,
          documentUrl: document.file_url,
          documentType: document.document_type || 'other',
          recipients: emails,
          message: message.trim(),
          senderEmail: user.email
        }
      });

      if (error) throw error;
      
      setSentSuccess(true);
      toast({
        title: t("documentGenerator.successTitle"),
        description: t("documentGenerator.documentShared"),
        variant: "default",
      });
      
      // Reset form after short delay
      setTimeout(() => {
        setSentSuccess(false);
        setRecipients("");
        setMessage("");
        onOpenChange(false);
      }, 2000);
      
    } catch (error) {
      console.error("Error sharing document:", error);
      toast({
        title: t("documentGenerator.errorTitle"),
        description: t("documentGenerator.shareError"),
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setRecipients("");
    setMessage("");
    setSentSuccess(false);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t("documentGenerator.shareDocument")}</SheetTitle>
          <SheetDescription>
            {document?.name ? `${t("documentGenerator.shareDocumentDescription")} "${document.name}"` : t("documentGenerator.shareDocumentDescription")}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipients">{t("documentGenerator.recipients")}</Label>
            <Input
              id="recipients"
              placeholder="email@example.com, another@example.com"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              disabled={isSending || sentSuccess}
            />
            <p className="text-xs text-muted-foreground">
              {t("documentGenerator.separateEmails")}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">{t("documentGenerator.message")}</Label>
            <Textarea
              id="message"
              placeholder={t("documentGenerator.optionalMessage")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              disabled={isSending || sentSuccess}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClose}
              disabled={isSending}
            >
              <X className="h-4 w-4 mr-2" />
              {t("documentGenerator.cancel")}
            </Button>
            <Button 
              onClick={handleShare}
              size="sm"
              disabled={isSending || sentSuccess || !recipients.trim()}
              className={sentSuccess ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {sentSuccess ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {t("documentGenerator.sent")}
                </>
              ) : isSending ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  {t("documentGenerator.sending")}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {t("documentGenerator.shareDocument")}
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
