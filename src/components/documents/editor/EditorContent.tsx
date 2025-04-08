
import { ReactNode } from "react";
import { DocumentTextarea } from "./DocumentTextarea";
import { FormatToolbar } from "./FormatToolbar";

interface EditorContentProps {
  content: string;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onInsertFormat: (format: string) => void;
  onInsertImage: (url: string) => void;
  onInsertTable: (rows: number, cols: number) => void;
  onInsertSignature: () => void;
  onInsertDynamicField: (field: string) => void;
  isAdvancedEditingEnabled: boolean;
  rightSlot?: ReactNode;
}

export function EditorContent({
  content,
  textareaRef,
  onChange,
  onInsertFormat,
  onInsertImage,
  onInsertTable,
  onInsertSignature,
  onInsertDynamicField,
  isAdvancedEditingEnabled,
  rightSlot
}: EditorContentProps) {
  return (
    <>
      {isAdvancedEditingEnabled && (
        <FormatToolbar
          onInsertFormat={onInsertFormat}
          onInsertImage={onInsertImage}
          onInsertTable={onInsertTable}
          onInsertSignature={onInsertSignature}
          onInsertDynamicField={onInsertDynamicField}
        />
      )}
      
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <DocumentTextarea
            ref={textareaRef}
            content={content}
            onChange={onChange}
          />
        </div>
        {isAdvancedEditingEnabled && rightSlot && (
          <div className="mt-3">
            {rightSlot}
          </div>
        )}
      </div>
    </>
  );
}
