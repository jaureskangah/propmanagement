
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Sparkles, Share2, FileCheck, Loader2 } from "lucide-react";

interface EditorToolbarProps {
  onOpenAIDialog: () => void;
  onOpenShareDialog: () => void;
  onGeneratePreview: () => void;
  isGenerating: boolean;
  hasContent: boolean;
}

export function EditorToolbar({
  onOpenAIDialog,
  onOpenShareDialog,
  onGeneratePreview,
  isGenerating,
  hasContent
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
          {t('aiAssistant')}
        </Button>
        
        <Button
          variant="outline"
          onClick={onOpenShareDialog}
          className="gap-2 bg-blue-100 border-blue-300 hover:bg-blue-200 hover:text-blue-800 text-blue-700"
        >
          <Share2 className="h-4 w-4 text-blue-600" />
          {t('shareDocument')}
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
