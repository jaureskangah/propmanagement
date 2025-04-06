
import React, { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DocumentHistoryEntry } from "@/types/documentHistory";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, Copy, Link, Mail, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentHistoryEntry;
}

export const ShareDialog = ({ isOpen, onClose, document }: ShareDialogProps) => {
  const { t } = useLocale();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"email" | "link">("email");
  const [recipients, setRecipients] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  
  const handleSendEmail = async () => {
    // Validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emails = recipients.split(",").map(email => email.trim());
    const validEmails = emails.filter(email => emailRegex.test(email));
    
    if (validEmails.length === 0) {
      toast({
        title: t('errorTitle'),
        description: t('enterValidEmail'),
        variant: "destructive"
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      // Simulate API call for sending email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: t('successTitle'),
        description: t('documentShared')
      });
      
      setRecipients("");
      setMessage("");
      onClose();
    } catch (error) {
      console.error("Error sending document:", error);
      toast({
        title: t('errorTitle'),
        description: t('shareError'),
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const handleGenerateLink = async () => {
    setIsGeneratingLink(true);
    
    try {
      // Simulate API call for generating link
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const randomId = Math.random().toString(36).substring(2, 15);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now
      
      setGeneratedLink(`https://app.domain.com/shared-documents/${randomId}`);
    } catch (error) {
      console.error("Error generating link:", error);
      toast({
        title: t('errorTitle'),
        description: t('shareError'),
        variant: "destructive"
      });
    } finally {
      setIsGeneratingLink(false);
    }
  };
  
  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(generatedLink);
      setIsCopied(true);
      toast({
        title: t('successTitle'),
        description: t('linkCopied')
      });
      
      // Reset the copied state after 3 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: t('errorTitle'),
        description: t('copyFailed'),
        variant: "destructive"
      });
    }
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{t('shareDocument')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('shareDocumentDescription')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {!document.fileUrl && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
            <span>{t('noFileToShare')}</span>
          </div>
        )}
        
        <Tabs defaultValue="email" value={activeTab} onValueChange={(value) => setActiveTab(value as "email" | "link")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" disabled={!document.fileUrl}>
              <Mail className="mr-2 h-4 w-4" />
              {t('shareByEmail')}
            </TabsTrigger>
            <TabsTrigger value="link" disabled={!document.fileUrl}>
              <Link className="mr-2 h-4 w-4" />
              {t('shareByLink')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="recipients">{t('recipients')}</Label>
              <Input 
                id="recipients" 
                placeholder={t('separateEmails')}
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                disabled={isSending}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">{t('message')}</Label>
              <Textarea 
                id="message" 
                placeholder={t('optionalMessage')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSending}
                rows={3}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="link" className="space-y-4 mt-4">
            {!generatedLink ? (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  {t('generateLinkDescription')}
                </p>
                <Button 
                  onClick={handleGenerateLink} 
                  disabled={isGeneratingLink}
                  className="w-full"
                >
                  {isGeneratingLink ? t('generatingLink') : t('generateLink')}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="share-link">{t('shareableLink')}</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="share-link" 
                    value={generatedLink} 
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    onClick={handleCopyLink}
                    variant="outline"
                  >
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('linkValidFor7Days')}
                </p>
                
                <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-md p-3 text-sm mt-4 flex items-start gap-2">
                  <span className="font-semibold">{t('noteTitle')}:</span>
                  <span>{t('usingDirectLink')}</span>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSending || isGeneratingLink}>
            {t('cancel')}
          </Button>
          
          {activeTab === "email" && (
            <Button 
              onClick={handleSendEmail} 
              disabled={!recipients.trim() || isSending}
            >
              {isSending ? t('sending') : t('send')}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
