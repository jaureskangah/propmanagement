
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, Download, Trash2, Clock } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export interface DocumentHistory {
  id: string;
  name: string;
  file_url: string;
  created_at: string;
  document_type?: string;
  category?: string;
}

export function DocumentHistoryView() {
  const { user } = useAuth();
  const { t } = useLocale();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchDocumentHistory();
  }, [user]);

  const fetchDocumentHistory = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Fetch documents history from Supabase
      const { data, error } = await supabase
        .from('document_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching document history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setDocumentToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;
    
    try {
      // Delete document from Supabase
      const { error } = await supabase
        .from('document_history')
        .delete()
        .eq('id', documentToDelete);

      if (error) throw error;

      // Update local state
      setDocuments(documents.filter(doc => doc.id !== documentToDelete));
      
      toast({
        title: t('documentDeleted'),
        description: t('documentDeleteSuccess'),
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: t('error'),
        description: t('errorDeletingDocument'),
        variant: "destructive",
      });
    } finally {
      setDeleteConfirmOpen(false);
      setDocumentToDelete(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          {t('documentHistory')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, idx) => (
              <div key={idx} className="flex items-center">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">{t('noDocumentHistory')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div 
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(doc.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(doc.file_url, '_blank')}
                    title={t('openDocument')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = doc.file_url;
                      a.download = doc.name;
                      a.click();
                    }}
                    title={t('downloadDocument')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => confirmDelete(doc.id)}
                    title={t('deleteDocument')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('confirmDeleteDocument')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('documentDeleteWarning')}
              </AlertDialogDescription>
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
      </CardContent>
    </Card>
  );
}
