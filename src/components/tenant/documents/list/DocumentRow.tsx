
import React from "react";
import { TenantDocument } from "@/types/tenant";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Trash, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentIcon } from "./DocumentIcon";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useIsMobile } from "@/hooks/use-mobile";

interface DocumentRowProps {
  document: TenantDocument;
  onViewDocument: (document: TenantDocument) => void;
  onDeleteDocument: (documentId: string, filename: string) => void;
  isMobile?: boolean;
}

export const DocumentRow = ({
  document,
  onViewDocument,
  onDeleteDocument,
  isMobile = false
}: DocumentRowProps) => {
  const { t } = useLocale();
  const isMobileDevice = useIsMobile();
  const actualIsMobile = isMobile || isMobileDevice;
  
  // Format the document name to truncate if too long
  const displayName = 
    document.name.length > (actualIsMobile ? 20 : 40) 
      ? document.name.substring(0, actualIsMobile ? 20 : 40) + "..." 
      : document.name;
  
  // Determine type text
  const typeText = document.document_type === "lease" 
    ? t("lease") 
    : document.document_type === "receipt" 
      ? t("receipt") 
      : t("other");
  
  const handleView = () => onViewDocument(document);
  
  const handleDelete = () => onDeleteDocument(document.id, document.file_url);
  
  const handleDownload = () => {
    window.open(document.file_url, '_blank');
  };

  return (
    <>
      <td className="px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center gap-2">
          <DocumentIcon document={document} />
          <div>
            <p className="font-medium text-xs sm:text-sm">{displayName}</p>
            <div className="mt-1 flex gap-1 flex-wrap">
              <Badge variant="outline" className="text-xs px-1 py-0">
                {typeText}
              </Badge>
              {document.category === "important" && (
                <Badge variant="secondary" className="text-xs px-1 py-0 bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                  {t("important")}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-4 py-3 hidden md:table-cell text-sm text-muted-foreground">
        {document.created_at ? formatDate(document.created_at) : "-"}
      </td>
      
      <td className="px-1 sm:px-4 py-2 sm:py-3 text-right">
        {actualIsMobile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleView}>
                <Eye className="h-4 w-4 mr-2" />
                {t("view")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                {t("download")}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash className="h-4 w-4 mr-2" />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" onClick={handleView} title={t("view")} className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDownload} title={t("download")} className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} title={t("delete")} className="h-8 w-8 text-red-600 hover:text-red-700">
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )}
      </td>
    </>
  );
};
