
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { supabase } from "@/lib/supabase";
import { DocumentHistoryEntry } from "@/types/documentHistory";
import { useAuth } from "@/components/AuthProvider";
import { CheckCircle, Copy, Link, Mail, Loader2 } from "lucide-react";

interface ShareDialogProps {
  document: DocumentHistoryEntry;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareDialog = ({ document, isOpen, onClose }: ShareDialogProps) => {
  const { t } = useLocale();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("email");
  
  // Email sharing state
  const [recipients, setRecipients] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);
  
  // Link sharing state
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [shareableLink, setShareableLink] = useState<string>("");
  const [isGeneratingLink, setIsGeneratingLink] = useState<boolean>(false);

  // Handle email form submission
  const handleSendEmail = async () => {
    if (!user || !document) return;
    
    const emails = recipients.split(",").map(email => email.trim()).filter(email => email);
    
    if (emails.length === 0) {
      toast({
        title: t("error"),
        description: t("enterValidEmail"),
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
          documentUrl: document.fileUrl,
          documentType: document.documentType,
          recipients: emails,
          message: message.trim(),
          senderEmail: user.email
        }
      });

      if (error) throw error;
      
      setSendSuccess(true);
      toast({
        title: t("success"),
        description: t("documentShared"),
      });
      
      // Reset after success
      setTimeout(() => {
        setSendSuccess(false);
        setRecipients("");
        setMessage("");
      }, 3000);
      
    } catch (error) {
      console.error("Error sharing document:", error);
      toast({
        title: t("error"),
        description: t("shareError"),
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Generate shareable link
  const handleGenerateLink = async () => {
    if (!document.fileUrl) {
      toast({
        title: t("error"),
        description: t("noFileToShare"),
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingLink(true);
    
    try {
      // Generate a shareable link that works for 7 days
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.fileUrl.split('/').pop()!, 60 * 60 * 24 * 7);
      
      if (error) throw error;
      
      setShareableLink(data.signedUrl);
    } catch (error) {
      console.error("Error generating link:", error);
      // Fallback to the direct URL if signed URL fails
      setShareableLink(document.fileUrl);
      
      toast({
        title: t("note"),
        description: t("usingDirectLink"),
      });
    } finally {
      setIsGeneratingLink(false);
    }
  };

  // Copy link to clipboard
  const handleCopyLink = () => {
    if (!shareableLink) return;
    
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        setCopySuccess(true);
        toast({
          title: t("success"),
          description: t("linkCopied"),
        });
        
        setTimeout(() => setCopySuccess(false), 3000);
      })
      .catch(() => {
        toast({
          title: t("error"),
          description: t("copyFailed"),
          variant: "destructive",
        });
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("shareDocument")}</DialogTitle>
          <DialogDescription>
            {t("shareDocumentDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" />
              {t("shareByEmail")}
            </TabsTrigger>
            <TabsTrigger value="link">
              <Link className="h-4 w-4 mr-2" />
              {t("shareByLink")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipients">{t("recipients")}</Label>
              <Input
                id="recipients"
                placeholder="email@example.com, another@example.com"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                disabled={isSending || sendSuccess}
              />
              <p className="text-xs text-muted-foreground">
                {t("separateEmails")}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">{t("message")}</Label>
              <Textarea
                id="message"
                placeholder={t("optionalMessage")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSending || sendSuccess}
                rows={3}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="link" className="mt-4 space-y-4">
            {!shareableLink ? (
              <div className="text-center py-4">
                <p className="mb-4 text-muted-foreground">
                  {t("generateLinkDescription")}
                </p>
                <Button 
                  onClick={handleGenerateLink} 
                  disabled={isGeneratingLink}
                >
                  {isGeneratingLink ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t("generating")}
                    </>
                  ) : (
                    <>
                      <Link className="h-4 w-4 mr-2" />
                      {t("generateLink")}
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="link">{t("shareableLink")}</Label>
                <div className="flex">
                  <Input
                    id="link"
                    value={shareableLink}
                    readOnly
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="outline" 
                    className="ml-2"
                    onClick={handleCopyLink}
                  >
                    {copySuccess ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("linkValidFor7Days")}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <Separator />
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          
          {activeTab === "email" && (
            <Button 
              onClick={handleSendEmail} 
              disabled={isSending || sendSuccess || !recipients.trim()}
              className={sendSuccess ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {sendSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t("sent")}
                </>
              ) : isSending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("sending")}
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  {t("send")}
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
