import { Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentUpload } from "./DocumentUpload";
import { DocumentGenerator } from "./documents/DocumentGenerator";
import { DocumentList } from "./documents/DocumentList";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { Tenant, TenantDocument } from "@/types/tenant";

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
      <DocumentGenerator tenant={tenant} onDocumentGenerated={onDocumentUpdate} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Uploaded Documents</CardTitle>
          </div>
          <DocumentUpload tenantId={tenantId} onUploadComplete={onDocumentUpdate} />
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No documents available. Upload your first document.
              </p>
            </div>
          ) : (
            <DocumentList 
              documents={documents}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};