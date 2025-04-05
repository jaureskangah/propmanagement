
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface EditContentProps {
  editedContent: string;
  onEditContent: (content: string) => void;
}

export function EditContent({ editedContent, onEditContent }: EditContentProps) {
  return (
    <Textarea
      value={editedContent}
      onChange={(e) => onEditContent(e.target.value)}
      className="h-full"
      style={{ backgroundColor: "#ffffff" }}
    />
  );
}
