
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, FileDown, FileCheck } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/components/providers/LocaleProvider";

interface DocumentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onGeneratePreview: (content: string) => void;
  isGenerating: boolean;
}

export function DocumentEditor({
  content,
  onContentChange,
  onGeneratePreview,
  isGenerating
}: DocumentEditorProps) {
  const { t } = useLocale();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value);
  };

  const handleGeneratePreview = () => {
    onGeneratePreview(content);
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
      
      <div className="flex justify-end space-x-2">
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
    </div>
  );
}
