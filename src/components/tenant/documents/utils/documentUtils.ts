
import { supabase } from "@/lib/supabase";
import { ToastProps } from "@/components/ui/toast";

// Define the correct return type for our toast functions
type ToastReturn = {
  title: string;
  description: string;
  variant?: "default" | "destructive";
};

/**
 * Télécharge un document à partir de son URL
 */
export const downloadDocument = async (fileUrl: string | undefined | null, fileName: string, t: (key: string) => string): Promise<ToastReturn> => {
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
    // Simplification: utiliser directement l'API window.open pour télécharger
    const downloadWindow = window.open(fileUrl, '_blank');
    
    if (!downloadWindow) {
      throw new Error("Popup bloqué");
    }
    
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
export const openDocumentInNewTab = (fileUrl: string | undefined | null, t: (key: string) => string): ToastReturn => {
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
    // Ouvrir directement dans un nouvel onglet sans validation supplémentaire
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
export const deleteDocument = async (documentId: string, onSuccess: () => void, t: (key: string) => string): Promise<ToastReturn> => {
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
 * Récupère l'URL du document directement depuis Supabase Storage
 */
export const getStorageUrl = (tenantId: string, fileName: string): string => {
  return `https://jhjhzwbvmkurwfohjxlu.supabase.co/storage/v1/object/public/tenant_documents/${tenantId}/${fileName}`;
};

/**
 * Assure que le document a une URL valide (version simplifiée)
 */
export const ensureDocumentUrl = async (document: any) => {
  if (!document) return null;
  
  // Si l'URL est déjà définie et valide, la retourner
  if (document.file_url && document.file_url !== "undefined" && document.file_url !== "null") {
    console.log("Document has valid URL:", document.file_url);
    return document;
  }
  
  // Sinon, générer une URL directe
  if (document.tenant_id && document.name) {
    const directUrl = getStorageUrl(document.tenant_id, document.name);
    console.log("Generated direct URL for document:", directUrl);
    
    // Mettre à jour le document en mémoire
    document.file_url = directUrl;
    
    // Mettre à jour la base de données
    try {
      const { error } = await supabase
        .from('tenant_documents')
        .update({ file_url: directUrl })
        .eq('id', document.id);
        
      if (error) {
        console.error("Error updating document URL in database:", error);
      }
    } catch (err) {
      console.error("Error in database operation:", err);
    }
  } else {
    console.error("Cannot generate URL - missing tenant_id or name", document);
  }
  
  return document;
};
