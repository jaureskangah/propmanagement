
import { formatDate } from "@/lib/utils";
import { TenantDocument } from "@/types/tenant";
import { DocumentIcon } from "./DocumentIcon";
import { DocumentActions } from "./DocumentActions";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/LocaleProvider";

interface DocumentRowProps {
  document: TenantDocument;
  onViewDocument: (document: TenantDocument) => void;
  onDeleteDocument: (documentId: string, filename: string) => void;
  isMobile?: boolean;
}

export function DocumentRow({
  document,
  onViewDocument,
  onDeleteDocument,
  isMobile = false
}: DocumentRowProps) {
  const { t } = useLocale();
  
  return (
    <tr className="hover:bg-muted/50">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <DocumentIcon documentType={document.document_type} />
          <div>
            <div className="font-medium">{document.name}</div>
            <div className="text-sm text-muted-foreground">
              {formatDate(document.created_at)}
              {document.source === 'landlord' && (
                <Badge variant="outline" className="ml-2 text-xs py-0 text-blue-600 border-blue-200 bg-blue-50">
                  {t('fromLandlord')}
                </Badge>
              )}
              {document.sender_name && (
                <span className="ml-2 text-xs text-muted-foreground">
                  {t('from')}: {document.sender_name}
                </span>
              )}
            </div>
          </div>
        </div>
      </td>
      
      {!isMobile && (
        <>
          <td className="py-3 px-4 text-muted-foreground">
            {document.category || document.document_type || "Other"}
          </td>
        </>
      )}
      
      <td className="py-3 px-4 text-right">
        <DocumentActions 
          document={document} 
          onViewDocument={onViewDocument}
          onDeleteDocument={onDeleteDocument}
        />
      </td>
    </tr>
  );
}
