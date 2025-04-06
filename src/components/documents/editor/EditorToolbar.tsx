
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Sparkles, Share2, FileCheck, Loader2, Save, PenSquare } from "lucide-react";

interface EditorToolbarProps {
  onOpenAIDialog: () => void;
  onOpenShareDialog: () => void;
  onOpenSaveTemplateDialog: () => void;
  onToggleAdvancedEditing: () => void;
  onGeneratePreview: () => void;
  isGenerating: boolean;
  hasContent: boolean;
  isAdvancedEditingEnabled: boolean;
}

export function EditorToolbar({
  onOpenAIDialog,
  onOpenShareDialog,
  onOpenSaveTemplateDialog,
  onToggleAdvancedEditing,
  onGeneratePreview,
  isGenerating,
  hasContent,
  isAdvancedEditingEnabled
}: EditorToolbarProps) {
  const { t } = useLocale();

  return (
    <div className="flex flex-wrap gap-2 justify-between">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={onOpenAIDialog}
          className="gap-2 bg-purple-100 border-purple-300 hover:bg-purple-200 hover:text-purple-800 text-purple-700"
        >
          <Sparkles className="h-4 w-4 text-purple-600" />
          {t('aiAssistant') || "Assistant IA"}
        </Button>
        
        <Button
          variant={isAdvancedEditingEnabled ? "default" : "outline"}
          onClick={onToggleAdvancedEditing}
          className={`gap-2 ${
            isAdvancedEditingEnabled 
              ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
              : "bg-indigo-100 border-indigo-300 hover:bg-indigo-200 hover:text-indigo-800 text-indigo-700"
          }`}
        >
          <PenSquare className={`h-4 w-4 ${isAdvancedEditingEnabled ? "text-white" : "text-indigo-600"}`} />
          {t('advancedEditing')}
        </Button>
        
        <Button
          variant="outline"
          onClick={onOpenShareDialog}
          className="gap-2 bg-blue-100 border-blue-300 hover:bg-blue-200 hover:text-blue-800 text-blue-700"
        >
          <Share2 className="h-4 w-4 text-blue-600" />
          {t('shareDocument')}
        </Button>
        
        <Button
          variant="outline"
          onClick={onOpenSaveTemplateDialog}
          className="gap-2 bg-amber-100 border-amber-300 hover:bg-amber-200 hover:text-amber-800 text-amber-700"
          disabled={!hasContent}
        >
          <Save className="h-4 w-4 text-amber-600" />
          {t('saveAsTemplate') || "Enregistrer comme modèle"}
        </Button>
      </div>
      
      <Button
        onClick={onGeneratePreview}
        disabled={!hasContent || isGenerating}
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
  );
}
