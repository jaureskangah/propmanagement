
import { useRef } from "react";

export function useEditorState(initialContent: string, onContentChange: (content: string) => void) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value);
  };

  return {
    textareaRef,
    handleChange,
  };
}
