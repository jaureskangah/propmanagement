import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

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
      console.log("Getting public URL for download:", url);
      const { data } = supabase.storage
        .from('tenant_documents')
        .getPublicUrl(url);

      if (!data.publicUrl) {
        throw new Error("Failed to get public URL");
      }

      console.log("Downloading document:", filename, "from URL:", data.publicUrl);
      const link = document.createElement('a');
      link.href = data.publicUrl;
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

  const handleOpenInNewTab = async (url: string, filename: string) => {
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
      console.log("Getting public URL for opening:", url);
      const { data } = supabase.storage
        .from('tenant_documents')
        .getPublicUrl(url);

      if (!data.publicUrl) {
        throw new Error("Failed to get public URL");
      }

      console.log("Opening document in new tab:", data.publicUrl);
      window.open(data.publicUrl, '_blank', 'noopener,noreferrer');
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