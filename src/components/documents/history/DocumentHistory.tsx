
import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useDocumentHistory } from "@/hooks/useDocumentHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentHistoryEntry } from "@/types/documentHistory";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Eye, FileText, Trash2, Download, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface DocumentViewerProps {
  document: DocumentHistoryEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentViewer = ({ document, isOpen, onClose }: DocumentViewerProps) => {
  const { t } = useLocale();
  const { toast } = useToast();
  
  if (!document) return null;
  
  const handleDownload = () => {
    if (document.fileUrl) {
      const link = document.createElement("a");
      link.href = document.fileUrl;
      link.download = `${document.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: t('downloadStarted'),
        description: t('downloadStartedDescription')
      });
    }
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <AlertDialogHeader>
          <AlertDialogTitle>{document.name}</AlertDialogTitle>
          <AlertDialogDescription>
            {new Date(document.createdAt).toLocaleDateString()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex-1 overflow-auto my-4">
          {document.fileUrl ? (
            <iframe 
              src={document.fileUrl}
              className="w-full h-[500px] border-none"
              title={document.name}
            />
          ) : (
            <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
              {document.content}
            </div>
          )}
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          {document.fileUrl && (
            <AlertDialogAction asChild>
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                {t('downloadDocument')}
              </Button>
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const DocumentHistory = () => {
  const { t, locale } = useLocale();
  const { toast } = useToast();
  const { history, isLoading, error, deleteFromHistory, fetchDocumentHistory } = useDocumentHistory();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedDocument, setSelectedDocument] = useState<DocumentHistoryEntry | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  
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
  
  const filteredHistory = history.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  
  const handleViewDocument = (document: DocumentHistoryEntry) => {
    setSelectedDocument(document);
    setIsViewerOpen(true);
  };
  
  const handleDeleteClick = (documentId: string) => {
    setDocumentToDelete(documentId);
    setDeleteConfirmOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (documentToDelete) {
      await deleteFromHistory(documentToDelete);
      setDeleteConfirmOpen(false);
      setDocumentToDelete(null);
      
      toast({
        title: t('documentDeleted') || "Document supprimé",
        description: t('documentDeletedDescription') || "Le document a été supprimé avec succès",
      });
    }
  };
  
  const handleDirectDownload = (document: DocumentHistoryEntry) => {
    if (document.fileUrl) {
      const link = document.createElement("a");
      link.href = document.fileUrl;
      link.download = `${document.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
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
  
  const categories = [
    { value: "all", label: t('allTemplates') },
    { value: "leaseDocuments", label: t('leaseDocuments') },
    { value: "paymentDocuments", label: t('paymentDocuments') },
    { value: "noticeDocuments", label: t('noticeDocuments') },
    { value: "inspectionDocuments", label: t('inspectionDocuments') },
    { value: "miscDocuments", label: t('miscDocuments') }
  ];
  
  return (
    <>
      <Card className="w-full">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {t('documentHistory')}
            </CardTitle>
            <Button 
              variant="outline" 
              onClick={() => fetchDocumentHistory()}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {t('refresh')}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder={t('search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:w-1/2"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="md:w-1/3">
                <SelectValue placeholder={t('category')} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {searchTerm || categoryFilter !== "all" ? t('noSearchResults') : t('noDocumentHistory')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('documentName')}</TableHead>
                    <TableHead>{t('documentCategory')}</TableHead>
                    <TableHead>{t('dateGenerated')}</TableHead>
                    <TableHead className="w-[140px]">{t('documentActions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell className="font-medium">{document.name}</TableCell>
                      <TableCell>{t(document.category)}</TableCell>
                      <TableCell>{formatDate(document.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewDocument(document)}
                            title={t('view')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDirectDownload(document)}
                            title={t('download')}
                            disabled={!document.fileUrl}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive"
                            onClick={() => handleDeleteClick(document.id)}
                            title={t('delete')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <DocumentViewer 
        document={selectedDocument}
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedDocument(null);
        }}
      />
      
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteTemplate')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteTemplateConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
