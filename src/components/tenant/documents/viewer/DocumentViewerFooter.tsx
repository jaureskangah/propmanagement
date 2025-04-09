
import React from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { TenantDocument } from "@/types/tenant";

interface DocumentViewerFooterProps {
  document: TenantDocument;
  t: (key: string) => string;
}

export const DocumentViewerFooter = ({ document, t }: DocumentViewerFooterProps) => {
  const handleCopyLink = () => {
    if (document.file_url) {
      navigator.clipboard.writeText(document.file_url);
      alert(t("success") || "Lien copié");
    }
  };

  return (
    <DialogFooter className="p-3 border-t bg-slate-50">
      <div className="flex w-full justify-between">
        <p className="text-sm text-muted-foreground">{document.document_type || 'other'}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          onClick={handleCopyLink}
        >
          <Share2 className="h-4 w-4" />
          {t("shareDocument") || "Partager"}
        </Button>
      </div>
    </DialogFooter>
  );
};
