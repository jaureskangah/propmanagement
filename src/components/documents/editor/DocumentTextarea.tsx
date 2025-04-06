
import { forwardRef, useEffect, useRef, useState } from "react";
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

    // Method to insert text at cursor position (exposed for ref)
    const insertTextAtCursor = (textToInsert: string) => {
      const textareaElement = ref as React.RefObject<HTMLTextAreaElement>;
      
      if (textareaElement && textareaElement.current) {
        const start = textareaElement.current.selectionStart;
        const end = textareaElement.current.selectionEnd;
        
        const newContent = content.substring(0, start) + textToInsert + content.substring(end);
        
        // Create a synthetic event to trigger the onChange handler
        const syntheticEvent = {
          target: {
            value: newContent
          }
        } as React.ChangeEvent<HTMLTextAreaElement>;
        
        onChange(syntheticEvent);
        
        // Set cursor position after inserted text
        setTimeout(() => {
          if (textareaElement.current) {
            textareaElement.current.focus();
            textareaElement.current.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
          }
        }, 0);
        
        // If we have a value change callback, trigger it directly
        if (onValueChange) {
          if (changeTimeoutRef.current) {
            clearTimeout(changeTimeoutRef.current);
          }
          
          changeTimeoutRef.current = setTimeout(() => {
            onValueChange(newContent);
          }, 300);
        }
      }
    };
    
    // Expose the insertTextAtCursor method through ref
    useEffect(() => {
      if (typeof ref === 'object' && ref !== null) {
        (ref as any).insertTextAtCursor = insertTextAtCursor;
      }
    }, [ref, content, onChange, onValueChange]);

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
