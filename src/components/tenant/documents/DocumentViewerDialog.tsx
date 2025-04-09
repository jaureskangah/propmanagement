
import React from "react";
import { 
  Dialog, 
  DialogContent
} from "@/components/ui/dialog";
import { TenantDocument } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DocumentViewerHeader } from "./viewer/DocumentViewerHeader";
import { DocumentViewerContent } from "./viewer/DocumentViewerContent";
import { DocumentViewerFooter } from "./viewer/DocumentViewerFooter";

interface DocumentViewerDialogProps {
  document: TenantDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DocumentViewerDialog = ({
  document,
  open,
  onOpenChange
}: DocumentViewerDialogProps) => {
  const { t } = useLocale();

  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[80vh] max-h-[800px] flex flex-col p-0 gap-0">
        <DocumentViewerHeader 
          document={document} 
          onClose={() => onOpenChange(false)} 
          t={t} 
        />
        
        <DocumentViewerContent document={document} t={t} />
        
        <DocumentViewerFooter document={document} t={t} />
      </DialogContent>
    </Dialog>
  );
};
