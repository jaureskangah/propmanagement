
import React from "react";
import { TenantDocument } from "@/types/tenant";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Trash, Download, ExternalLink } from "lucide-react";
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
import { TableCell } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { openDocumentInNewTab } from "../utils/documentUtils";

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
  const { toast } = useToast();
  
  // Format the document name to truncate if too long
  const displayName = 
    document.name.length > 30 
      ? document.name.substring(0, 30) + "..." 
      : document.name;
  
  const typeText = document.document_type === "lease" 
    ? t("lease") 
    : document.document_type === "receipt" 
      ? t("receipt") 
      : t("other");
  
  const handleView = () => onViewDocument(document);
  
  const handleDelete = () => onDeleteDocument(document.id, document.name);
  
  const handleOpenInNewTab = () => {
    console.log("Open in new tab button clicked. Document URL:", document.file_url);
    if (!document.file_url) {
      console.error("Document URL is undefined in DocumentRow handleOpenInNewTab");
      toast({
        title: t("error") || "Error",
        description: t("fileNotFound") || "File not found",
        variant: "destructive",
      });
      return;
    }
    
    const result = openDocumentInNewTab(document.file_url, t);
    if (result) {
      toast(result);
    }
  };

  return (
    <>
      <TableCell>
        <div className="flex items-center gap-2">
          <DocumentIcon document={document} />
          <div>
            <p className="font-medium text-sm">{displayName}</p>
            <div className="mt-1 flex gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {typeText}
              </Badge>
              {document.category === "important" && (
                <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                  {t("important")}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </TableCell>
      
      <TableCell className="hidden md:table-cell text-sm text-muted-foreground text-right">
        {document.created_at ? formatDate(document.created_at) : "-"}
      </TableCell>
      
      <TableCell className="text-right">
        {isMobile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleView}>
                <Eye className="h-4 w-4 mr-2" />
                {t("view")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenInNewTab}>
                <ExternalLink className="h-4 w-4 mr-2" />
                {t("openInBrowser")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash className="h-4 w-4 mr-2" />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" onClick={handleView} title={t("view")}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleOpenInNewTab} title={t("openInBrowser")}>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} title={t("delete")} className="text-red-600 hover:text-red-700">
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )}
      </TableCell>
    </>
  );
};
