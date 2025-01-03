import { useToast } from "@/hooks/use-toast";

export const useDocumentActions = () => {
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

  return {
    handleDownload,
    handleOpenInNewTab
  };
};