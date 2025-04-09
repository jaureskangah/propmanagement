
import { FileText, Download, ExternalLink, Trash2, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DocumentUpload } from "./DocumentUpload";
import { TenantDocument } from "@/types/tenant";
import { formatDate } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { Tenant } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";

interface TenantDocumentsProps {
  documents: TenantDocument[];
  tenantId: string;
  onDocumentUpdate: () => void;
  tenant: Tenant;
}

export const TenantDocuments = ({ 
  documents, 
  tenantId,
  onDocumentUpdate,
  tenant 
}: TenantDocumentsProps) => {
  const { toast } = useToast();
  const { t } = useLocale();

  const handleDownload = async (url: string, filename: string) => {
    console.log("Downloading document:", filename, "from URL:", url);
    
    try {
      // Determine the MIME type based on file extension
      const getContentType = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase() || '';
        const mimeTypes: {[key: string]: string} = {
          'pdf': 'application/pdf',
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'doc': 'application/msword',
        };
        return mimeTypes[extension] || 'application/octet-stream';
      };
      
      // Use direct fetch to get the file with correct content type
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      // Get the file as a blob with the correct MIME type
      const blob = await response.blob();
      const contentType = getContentType(filename);
      const fileBlob = new Blob([blob], { type: contentType });
      
      // Create a download link and click it
      const downloadUrl = URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      
      toast({
        title: t('downloadStarted'),
        description: t('downloadStartedDescription')
      });
    } catch (error) {
      console.error("Erreur lors du téléchargement du document:", error);
      toast({
        title: t("error"),
        description: t("uploadError"),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (documentId: string, filename: string) => {
    try {
      console.log("Deleting document:", filename);

      const { error: deleteError } = await supabase
        .from('tenant_documents')
        .delete()
        .eq('id', documentId);

      if (deleteError) {
        console.error("Error deleting document:", deleteError);
        throw deleteError;
      }

      toast({
        title: "Document deleted",
        description: "The document has been successfully deleted",
      });

      onDocumentUpdate();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the document",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">{t('uploadedDocuments')}</CardTitle>
          </div>
          <DocumentUpload tenantId={tenantId} onUploadComplete={onDocumentUpdate} />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t('noDocuments')}
                </p>
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-700">
                      <FileText className="h-5 w-5" />
                    </div>
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
                      size="icon"
                      onClick={() => handleDownload(doc.file_url!, doc.name)}
                      title="Download document"
                      className="hover:text-blue-600 hover:bg-blue-50"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      title="Open in new tab"
                      className="hover:text-blue-600 hover:bg-blue-50"
                    >
                      <a 
                        href={doc.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(doc.id, doc.name)}
                      className="hover:text-red-600 hover:bg-red-50"
                      title="Delete document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
