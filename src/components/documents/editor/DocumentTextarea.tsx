
import { forwardRef } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Textarea } from "@/components/ui/textarea";

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
        className="h-[400px] font-mono resize-none"
        placeholder={t('documentGenerator.startTypingDocument') || "Commencez à taper votre document ici..."}
      />
    );
  }
);

DocumentTextarea.displayName = "DocumentTextarea";
