
import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useDocumentHistory } from "@/hooks/useDocumentHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DocumentHistoryEntry } from "@/types/documentHistory";
import { FileText, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DocumentViewer } from "./DocumentViewer";
import { DocumentHistoryItem } from "./DocumentHistoryItem";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { DocumentFilters } from "./DocumentFilters";

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
          <DocumentFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
          />
          
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
                    <DocumentHistoryItem 
                      key={document.id}
                      document={document}
                      onView={handleViewDocument}
                      onDelete={handleDeleteClick}
                      locale={locale}
                    />
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
      
      <DeleteConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
