import { FileText, Download, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { TenantDocument } from "@/types/tenant";
import { useToast } from "@/hooks/use-toast";

interface DocumentListProps {
  documents: TenantDocument[];
  onDelete: (documentId: string, filename: string) => void;
}

export const DocumentList = ({ documents, onDelete }: DocumentListProps) => {
  const { toast } = useToast();

  const handleDownload = (url: string | null, filename: string) => {
    if (!url) {
      console.error("Download failed - No URL for document:", filename);
      toast({
        title: "Error",
        description: "Cannot download document - URL is missing",
        variant: "destructive",
      });
      return;
    }

    console.log("Downloading document:", filename, "from URL:", url);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = (url: string | null, filename: string) => {
    if (!url) {
      console.error("Cannot open document - No URL for:", filename);
      toast({
        title: "Error",
        description: "Cannot open document - URL is missing",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const documentUrl = new URL(url);
      console.log("Opening document in new tab:", documentUrl.toString());
      window.open(documentUrl.toString(), '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error("Invalid document URL:", url, error);
      toast({
        title: "Error",
        description: "Cannot open document - Invalid URL",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
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
              onClick={() => handleDownload(doc.file_url, doc.name)}
              title="Download document"
              className="hover:text-blue-600 hover:bg-blue-50"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleOpenInNewTab(doc.file_url, doc.name)}
              title="Open in new tab"
              className="hover:text-blue-600 hover:bg-blue-50"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(doc.id, doc.name)}
              className="hover:text-red-600 hover:bg-red-50"
              title="Delete document"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};