
import { TenantDocument } from "@/types/tenant";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { QuickPreview } from "./QuickPreview";

interface DocumentActionsProps {
  document: TenantDocument;
  onViewDocument: (document: TenantDocument) => void;
  onDeleteDocument: (documentId: string, filename: string) => void;
}

export const DocumentActions = ({ 
  document: documentItem,
  onViewDocument,
  onDeleteDocument 
}: DocumentActionsProps) => {
  const { t } = useLocale();


  return (
    <div className="flex gap-1 justify-end">
      <QuickPreview 
        document={documentItem} 
        onFullView={() => onViewDocument(documentItem)} 
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onViewDocument(documentItem);
        }}
        title={t("openDocument")}
        className="h-8 w-8"
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteDocument(documentItem.id, documentItem.name);
        }}
        title={t("confirmDeleteDocument")}
        className="h-8 w-8 hover:text-red-500"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
