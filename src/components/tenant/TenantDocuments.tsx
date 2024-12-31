import { FileText, Download, ExternalLink, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DocumentUpload } from "./DocumentUpload";
import { TenantDocument } from "@/types/tenant";
import { formatDate } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface TenantDocumentsProps {
  documents: TenantDocument[];
  tenantId: string;
  onDocumentUpdate: () => void;
}

export const TenantDocuments = ({ 
  documents, 
  tenantId,
  onDocumentUpdate 
}: TenantDocumentsProps) => {
  const { toast } = useToast();

  const handleDownload = (url: string, filename: string) => {
    console.log("Downloading document:", filename, "from URL:", url);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Lease Documents</CardTitle>
        <DocumentUpload tenantId={tenantId} onUploadComplete={onDocumentUpdate} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No documents available
            </p>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-2 border rounded hover:bg-accent"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
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
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    title="Open in new tab"
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
                    className="text-destructive hover:text-destructive"
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
  );
};