import { FileText, Download, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DocumentUpload } from "./DocumentUpload";
import { TenantDocument } from "@/types/tenant";
import { formatDate } from "@/lib/utils";

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
  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Documents du bail</CardTitle>
        <DocumentUpload tenantId={tenantId} onUploadComplete={onDocumentUpdate} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucun document disponible
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
                  {doc.file_url && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(doc.file_url!, doc.name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <a 
                          href={doc.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};