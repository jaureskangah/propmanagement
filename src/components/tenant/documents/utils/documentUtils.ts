
import { supabase } from "@/lib/supabase";
import { Toast } from "@/components/ui/toast";

/**
 * Télécharge un document à partir de son URL
 */
export const downloadDocument = async (fileUrl: string | undefined | null, fileName: string, t: (key: string) => string): Promise<Toast> => {
  console.log("downloadDocument called with URL:", fileUrl);
  
  if (!fileUrl) {
    console.error("Impossible de télécharger - URL manquante");
    return {
      title: t("error") || "Erreur",
      description: t("fileNotFound") || "Fichier introuvable",
      variant: "destructive",
    };
  }

  try {
    // Vérification que l'URL est valide
    const url = new URL(fileUrl);
    
    // Fetch le fichier
    const response = await fetch(fileUrl);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    // Créer un blob à partir de la réponse
    const blob = await response.blob();
    
    // Créer un URL pour le blob
    const downloadUrl = window.URL.createObjectURL(blob);
    
    // Créer un lien temporaire pour le téléchargement
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    
    // Ajouter le lien au document, cliquer dessus, puis le supprimer
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Libérer l'URL du blob
    window.URL.revokeObjectURL(downloadUrl);
    
    return {
      title: t("downloadStarted") || "Téléchargement démarré",
      description: t("fileDownloading") || "Le fichier est en cours de téléchargement",
    };
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error);
    return {
      title: t("downloadError") || "Erreur de téléchargement",
      description: t("couldNotDownload") || "Impossible de télécharger le fichier",
      variant: "destructive",
    };
  }
};

/**
 * Ouvre un document dans un nouvel onglet
 */
export const openDocumentInNewTab = (fileUrl: string | undefined | null, t: (key: string) => string): Toast => {
  console.log("openDocumentInNewTab called with URL:", fileUrl);
  
  if (!fileUrl) {
    console.error("Impossible d'ouvrir - URL manquante");
    return {
      title: t("error") || "Erreur",
      description: t("fileNotFound") || "Fichier introuvable",
      variant: "destructive",
    };
  }

  try {
    // Vérification que l'URL est valide
    const url = new URL(fileUrl);
    
    // Ouvrir dans un nouvel onglet
    window.open(fileUrl, '_blank');
    
    return {
      title: t("openedInNewTab") || "Ouvert dans un nouvel onglet",
      description: t("documentOpened") || "Le document a été ouvert dans un nouvel onglet",
    };
  } catch (error) {
    console.error("Erreur lors de l'ouverture:", error);
    return {
      title: t("openError") || "Erreur d'ouverture",
      description: t("couldNotOpen") || "Impossible d'ouvrir le fichier",
      variant: "destructive",
    };
  }
};

/**
 * Supprime un document
 */
export const deleteDocument = async (documentId: string, onSuccess: () => void, t: (key: string) => string): Promise<Toast> => {
  try {
    // Supprimer le document de la base de données
    const { error } = await supabase
      .from('tenant_documents')
      .delete()
      .eq('id', documentId);

    if (error) throw error;
    
    // Appeler le callback de succès pour rafraîchir la liste
    onSuccess();
    
    return {
      title: t("docDeleteSuccess") || "Document supprimé",
      description: t("docDeleteSuccessDesc") || "Le document a été supprimé avec succès",
    };
  } catch (error) {
    console.error('Erreur lors de la suppression du document:', error);
    return {
      title: t("docDeleteError") || "Erreur",
      description: t("docDeleteErrorDesc") || "Impossible de supprimer le document",
      variant: "destructive",
    };
  }
};

/**
 * Génère une URL signée pour un document stocké
 */
export const generateSignedUrl = async (documentId: string, filename: string) => {
  try {
    // Extraire l'extension du fichier
    const fileExt = filename.split('.').pop() || '';
    // Construire le chemin du fichier
    const filePath = `${documentId}.${fileExt}`;
    
    // Créer une URL signée
    const { data, error } = await supabase
      .storage
      .from('tenant_documents')
      .createSignedUrl(filePath, 60 * 60); // 1 heure d'expiration
    
    if (error) {
      console.error("Erreur lors de la création de l'URL signée:", error);
      return null;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error("Erreur lors de la génération de l'URL signée:", error);
    return null;
  }
};

/**
 * Assure que le document a une URL valide
 */
export const ensureDocumentUrl = async (document: any) => {
  if (!document) return null;
  
  // Si l'URL est déjà définie, la retourner
  if (document.file_url) return document;
  
  // Sinon, générer une URL signée
  if (document.id && document.name) {
    const signedUrl = await generateSignedUrl(document.id, document.name);
    if (signedUrl) {
      // Mettre à jour le document en mémoire
      document.file_url = signedUrl;
      
      // Mettre à jour la base de données
      await supabase
        .from('tenant_documents')
        .update({ file_url: signedUrl })
        .eq('id', document.id);
    }
  }
  
  return document;
};
