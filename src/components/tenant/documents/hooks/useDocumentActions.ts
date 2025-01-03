import { useToast } from "@/hooks/use-toast";

export const useDocumentActions = () => {
  const { toast } = useToast();

  const handleDownload = async (url: string, filename: string) => {
    if (!url) {
      console.error("Download failed - No URL for document:", filename);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document - URL manquante",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Downloading document:", filename, "from URL:", url);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Erreur",
        description: "Échec du téléchargement du document",
        variant: "destructive",
      });
    }
  };

  const handleOpenInNewTab = (url: string, filename: string) => {
    if (!url) {
      console.error("Cannot open document - No URL for:", filename);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir le document - URL manquante",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("Opening document in new tab:", url);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error("Error opening document:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir le document",
        variant: "destructive",
      });
    }
  };

  return {
    handleDownload,
    handleOpenInNewTab
  };
};