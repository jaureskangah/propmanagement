
import { forwardRef, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/components/providers/LocaleProvider";

interface DocumentTextareaProps {
  content: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onValueChange?: (content: string) => void; // Added for programmatic updates
}

export const DocumentTextarea = forwardRef<HTMLTextAreaElement, DocumentTextareaProps>(
  ({ content, onChange, onValueChange }, ref) => {
    const { t } = useLocale();
    const changeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    useEffect(() => {
      console.log("DocumentTextarea: Rendered with content length:", content.length);
    }, [content]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e);
      
      // If we have an additional callback for value changes with debounce
      if (onValueChange) {
        if (changeTimeoutRef.current) {
          clearTimeout(changeTimeoutRef.current);
        }
        
        changeTimeoutRef.current = setTimeout(() => {
          onValueChange(e.target.value);
        }, 300);
      }
    };

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (changeTimeoutRef.current) {
          clearTimeout(changeTimeoutRef.current);
        }
      };
    }, []);

    return (
      <Textarea
        ref={ref}
        value={content}
        onChange={handleChange}
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
