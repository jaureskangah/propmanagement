
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BaseDialog } from "./BaseDialog";

interface AIAssistantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (content: string) => void;
  content: string;
  templateName?: string;
}

export function AIAssistantDialog({
  isOpen,
  onClose,
  onGenerate,
  content,
  templateName = ""
}: AIAssistantDialogProps) {
  const { t } = useLocale();
  const { toast } = useToast();
  const [aiInstructions, setAIInstructions] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleAIGenerate = async () => {
    if (!content && !templateName) {
      toast({
        title: t('errorTitle') || "Erreur",
        description: t('selectTemplateFirst') || "Veuillez d'abord sélectionner un modèle",
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
        onGenerate(data.content);
        toast({
          title: t('successTitle') || "Succès",
          description: t('aiGenerated') || "Contenu généré avec succès"
        });
      }
    } catch (error) {
      console.error('Error generating content with AI:', error);
      toast({
        title: t('errorTitle') || "Erreur",
        description: t('aiErrorDescription') || "Impossible de générer le contenu avec l'IA",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAI(false);
      onClose();
      setAIInstructions("");
    }
  };

  const dialogFooter = (
    <Button onClick={handleAIGenerate} disabled={isGeneratingAI} className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
      {isGeneratingAI ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t('aiGenerating') || "Génération en cours..."}
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          {t('aiGenerate') || "Générer"}
        </>
      )}
    </Button>
  );

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={onClose}
      title={t('aiAssistant') || "Assistant IA"}
      description={t('aiAssistantDescription') || "Utiliser l'IA pour générer ou modifier du contenu"}
      footer={dialogFooter}
      className="dark:bg-gray-800 dark:text-gray-100"
    >
      <Label htmlFor="instructions" className="dark:text-gray-200">{t('aiInstructions') || "Instructions pour l'IA"}</Label>
      <Input 
        id="instructions"
        className="mt-2 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        value={aiInstructions}
        onChange={(e) => setAIInstructions(e.target.value)}
        placeholder={t('aiInstructionsPlaceholder') || "Décrivez ce que vous souhaitez générer..."}
      />
    </BaseDialog>
  );
}
