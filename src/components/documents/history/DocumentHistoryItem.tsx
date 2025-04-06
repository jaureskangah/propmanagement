
import React from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DocumentHistoryEntry } from "@/types/documentHistory";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Download, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface DocumentHistoryItemProps {
  document: DocumentHistoryEntry;
  onView: (document: DocumentHistoryEntry) => void;
  onDelete: (documentId: string) => void;
  locale: string;
}

export const DocumentHistoryItem = ({ 
  document, 
  onView, 
  onDelete,
  locale 
}: DocumentHistoryItemProps) => {
  const { t } = useLocale();
  const { toast } = useToast();
  const dateLocale = locale === 'fr' ? fr : enUS;
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: dateLocale
      });
    } catch (e) {
      return dateString;
    }
  };
  
  const handleDirectDownload = () => {
    if (document.fileUrl) {
      const link = window.document.createElement("a");
      link.href = document.fileUrl;
      link.download = `${document.name}.pdf`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      toast({
        title: t('downloadStarted'),
        description: t('downloadStartedDescription')
      });
    } else {
      toast({
        title: t('downloadError') || "Erreur de téléchargement",
        description: t('noFileAvailable') || "Aucun fichier disponible pour ce document",
        variant: "destructive"
      });
    }
  };
  
  return (
    <TableRow key={document.id}>
      <TableCell className="font-medium">{document.name}</TableCell>
      <TableCell>{t(document.category)}</TableCell>
      <TableCell>{formatDate(document.createdAt)}</TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onView(document)}
            title={t('view')}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleDirectDownload}
            title={t('download')}
            disabled={!document.fileUrl}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-destructive"
            onClick={() => onDelete(document.id)}
            title={t('delete')}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
