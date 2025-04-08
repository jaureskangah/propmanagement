
import { useState } from "react";

export function useEditorDialogs() {
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isSaveTemplateDialogOpen, setIsSaveTemplateDialogOpen] = useState(false);
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [isAdvancedEditingEnabled, setIsAdvancedEditingEnabled] = useState(false);
  
  return {
    isAIDialogOpen,
    setIsAIDialogOpen,
    isShareDialogOpen, 
    setIsShareDialogOpen,
    isSaveTemplateDialogOpen,
    setIsSaveTemplateDialogOpen,
    isSignatureDialogOpen,
    setIsSignatureDialogOpen,
    isAdvancedEditingEnabled,
    setIsAdvancedEditingEnabled
  };
}
