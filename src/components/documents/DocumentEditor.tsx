
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, FileDown, FileCheck, Sparkles } from "lucide-react";
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
  const [aiInstructions, setAIInstructions] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

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

  return (
    <div className="space-y-4">
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        className="min-h-[500px] font-mono text-sm"
        placeholder={t('startTypingDocument')}
      />
      
      <div className="flex justify-between space-x-2">
        <Button
          variant="outline"
          onClick={() => setIsAIDialogOpen(true)}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {t('aiAssistant')}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleGeneratePreview}
          disabled={!content || isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('generating')}
            </>
          ) : (
            <>
              <FileCheck className="mr-2 h-4 w-4" />
              {t('generatePreview')}
            </>
          )}
        </Button>
      </div>

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
            <Button onClick={handleAIGenerate} disabled={isGeneratingAI}>
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
    </div>
  );
}
