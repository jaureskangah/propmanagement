
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Download, Eye, Trash2 } from "lucide-react";
import { Loader2 } from "lucide-react";

interface DocumentHistoryEntry {
  id: string;
  name: string;
  content: string;
  file_url: string;
  document_type?: string;
  category?: string;
  created_at: string;
}

export function DocumentHistory() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<DocumentHistoryEntry | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchDocumentHistory();
  }, []);

  const fetchDocumentHistory = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('document_history')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching document history:', error);
      toast({
        title: "Error",
        description: "Could not fetch document history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (document: DocumentHistoryEntry) => {
    if (!document.file_url) return;
    
    // Create a link element and simulate click to download
    const a = document.createElement('a');
    a.href = document.file_url;
    a.download = `${document.name || 'document'}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: t('downloadStarted'),
      description: t('downloadStartedDescription')
    });
  };

  const handleView = (document: DocumentHistoryEntry) => {
    if (!document.file_url) return;
    window.open(document.file_url, '_blank');
  };

  const confirmDelete = (document: DocumentHistoryEntry) => {
    setSelectedDocument(document);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedDocument) return;
    
    try {
      const { error } = await supabase
        .from('document_history')
        .delete()
        .eq('id', selectedDocument.id);
      
      if (error) throw error;
      
      setDocuments(documents.filter(doc => doc.id !== selectedDocument.id));
      toast({
        title: t('documentDeleted'),
        description: t('documentDeleteSuccess')
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: t('errorDeletingDocument'),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedDocument(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('default', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-muted-foreground">{t('noDocumentHistory')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t('documentHistory')}</CardTitle>
          <CardDescription>
            {t('history')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('type')}</TableHead>
                <TableHead>{t('date')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map(doc => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>{doc.document_type || 'custom'}</TableCell>
                  <TableCell>{formatDate(doc.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="icon" 
                        variant="outline"
                        onClick={() => handleView(doc)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="outline"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="outline"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => confirmDelete(doc)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmDeleteDocument')}</AlertDialogTitle>
            <AlertDialogDescription>{t('documentDeleteWarning')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
