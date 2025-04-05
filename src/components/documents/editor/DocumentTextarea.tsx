
import { forwardRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/components/providers/LocaleProvider";

interface DocumentTextareaProps {
  content: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const DocumentTextarea = forwardRef<HTMLTextAreaElement, DocumentTextareaProps>(
  ({ content, onChange }, ref) => {
    const { t } = useLocale();
    
    useEffect(() => {
      console.log("DocumentTextarea: Rendered with content length:", content.length);
    }, [content]);

    return (
      <Textarea
        ref={ref}
        value={content}
        onChange={onChange}
        className="min-h-[500px] font-mono text-sm bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-50 border-gray-300 dark:border-gray-600"
        placeholder={t('startTypingDocument')}
        style={{ 
          backgroundColor: "#ffffff", 
          color: "#000000"
        }}
      />
    );
  }
);

DocumentTextarea.displayName = "DocumentTextarea";
