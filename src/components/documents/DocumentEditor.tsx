
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  FileDown, 
  FileCheck, 
  Sparkles, 
  Save, 
  Share2, 
  Send
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useToast } from "@/hooks/use-toast";
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
import { supabase } from "@/lib/supabase";

interface DocumentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onGeneratePreview: (content: string) => void;
  isGenerating: boolean;
  templateName?: string;
}

export function DocumentEditor({
  content,
  onContentChange,
  onGeneratePreview,
  isGenerating,
  templateName = ""
}: DocumentEditorProps) {
  const { t } = useLocale();
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [aiInstructions, setAIInstructions] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value);
  };

  const handleGeneratePreview = () => {
    onGeneratePreview(content);
  };

  const handleAIGenerate = async () => {
    if (!content && !templateName) {
      toast({
        title: t('error'),
        description: t('selectTemplateFirst'),
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingAI(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-document-content', {
        body: {
          templateType: templateName,
          documentTitle: templateName,
          existingContent: content,
          instructions: aiInstructions
        }
      });

      if (error) throw error;
      
      if (data && data.content) {
        onContentChange(data.content);
        toast({
          title: t('aiSuccess'),
          description: t('aiGenerated')
        });
      }
    } catch (error) {
      console.error('Error generating content with AI:', error);
      toast({
        title: t('aiError'),
        description: t('aiErrorDescription'),
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAI(false);
      setIsAIDialogOpen(false);
      setAIInstructions("");
    }
  };

  const handleShareDocument = async () => {
    if (!recipientEmail || !content) {
      toast({
        title: t('error'),
        description: t('emailAndContentRequired'),
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    
    try {
      const { error } = await supabase.functions.invoke('share-document', {
        body: {
          recipientEmail,
          documentContent: content,
          documentTitle: templateName || t('customDocument'),
        }
      });

      if (error) throw error;
      
      toast({
        title: t('shareSuccess'),
        description: t('documentShared')
      });
      setIsShareDialogOpen(false);
      setRecipientEmail("");
    } catch (error) {
      console.error('Error sharing document:', error);
      toast({
        title: t('shareError'),
        description: t('shareErrorDescription'),
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        className="min-h-[500px] font-mono text-sm"
        placeholder={t('startTypingDocument')}
      />
      
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => setIsAIDialogOpen(true)}
            className="gap-2 bg-purple-50 border-purple-200 hover:bg-purple-100 hover:text-purple-700"
          >
            <Sparkles className="h-4 w-4 text-purple-500" />
            {t('aiAssistant')}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setIsShareDialogOpen(true)}
            className="gap-2 bg-blue-50 border-blue-200 hover:bg-blue-100 hover:text-blue-700"
          >
            <Share2 className="h-4 w-4 text-blue-500" />
            {t('shareDocument')}
          </Button>
        </div>
        
        <Button
          onClick={handleGeneratePreview}
          disabled={!content || isGenerating}
          className="gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('generating')}
            </>
          ) : (
            <>
              <FileCheck className="h-4 w-4" />
              {t('generatePreview')}
            </>
          )}
        </Button>
      </div>

      {/* AI Assistant Dialog */}
      <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('aiAssistant')}</DialogTitle>
            <DialogDescription>{t('aiAssistantDescription')}</DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="instructions">{t('aiInstructions')}</Label>
            <Input 
              id="instructions"
              className="mt-2"
              value={aiInstructions}
              onChange={(e) => setAIInstructions(e.target.value)}
              placeholder={t('aiInstructionsPlaceholder')}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAIDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleAIGenerate} disabled={isGeneratingAI} className="bg-purple-600 hover:bg-purple-700">
              {isGeneratingAI ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('aiGenerating')}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t('aiGenerate')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Document Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('shareDocument')}</DialogTitle>
            <DialogDescription>{t('shareDocumentDescription')}</DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="email">{t('recipientEmail')}</Label>
            <Input 
              id="email"
              type="email"
              className="mt-2"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleShareDocument} disabled={isSending} className="bg-blue-600 hover:bg-blue-700">
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('sending')}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {t('send')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
