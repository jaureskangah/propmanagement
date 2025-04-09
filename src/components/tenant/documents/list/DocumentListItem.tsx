
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Trash2 } from "lucide-react";
import { TenantDocument } from "@/types/tenant";
import { formatDate } from "@/lib/utils";
import { useLocale } from "@/components/providers/LocaleProvider";
import { downloadDocument, openDocumentInNewTab } from "../utils/documentUtils";
import { useToast } from "@/hooks/use-toast";

interface DocumentListItemProps {
  document: TenantDocument;
  onDocumentUpdate: () => void;
  onDelete: (documentId: string, filename: string) => void;
}

export const DocumentListItem = ({ 
  document, 
  onDocumentUpdate,
  onDelete 
}: DocumentListItemProps) => {
  const { t } = useLocale();
  const { toast } = useToast();

  // Assurons-nous que l'URL du document est disponible
  const ensureFileUrl = (doc: TenantDocument): string => {
    if (doc.file_url) return doc.file_url;
    
    // Génération d'une URL directe si elle n'existe pas
    return `https://jhjhzwbvmkurwfohjxlu.supabase.co/storage/v1/object/public/tenant_documents/${doc.tenant_id || ''}/${doc.name}`;
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    console.log("Download button clicked in DocumentListItem");
    console.log("Document:", document);
    
    const fileUrl = ensureFileUrl(document);
    console.log("Document URL (ensured):", fileUrl);
    
    const result = await downloadDocument(fileUrl, document.name || 'document', t);
    toast(result);
  };

  const handleOpenInNewTab = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    console.log("Open in new tab button clicked in DocumentListItem");
    console.log("Document:", document);
    
    const fileUrl = ensureFileUrl(document);
    console.log("Document URL (ensured):", fileUrl);
    
    const result = openDocumentInNewTab(fileUrl, t);
    toast(result);
  };

  return (
    <div
      key={document.id}
      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-700">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium">{document.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatDate(document.created_at)}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownload}
          title={t('downloadDocument')}
          className="hover:text-blue-600 hover:bg-blue-50"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleOpenInNewTab}
          title={t('openInBrowser')}
          className="hover:text-blue-600 hover:bg-blue-50"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(document.id, document.name)}
          className="hover:text-red-600 hover:bg-red-50"
          title={t('delete')}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Import the FileText icon from lucide-react at the top of the file
import { FileText } from "lucide-react";
