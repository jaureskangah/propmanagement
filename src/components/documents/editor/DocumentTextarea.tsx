
import { forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/components/providers/LocaleProvider";

interface DocumentTextareaProps {
  content: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const DocumentTextarea = forwardRef<HTMLTextAreaElement, DocumentTextareaProps>(
  ({ content, onChange }, ref) => {
    const { t } = useLocale();

    return (
      <Textarea
        ref={ref}
        value={content}
        onChange={onChange}
        className="min-h-[500px] font-mono text-sm bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        placeholder={t('startTypingDocument')}
      />
    );
  }
);

DocumentTextarea.displayName = "DocumentTextarea";
