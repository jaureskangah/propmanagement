
import { supabase } from "@/lib/supabase";
import { TenantDocument } from "@/types/tenant";
import { encodeCorrectly } from "./urlEncoder";
import { ensureDocumentUrl } from "./fileUrl";

// Type de retour pour nos fonctions toast
export type ToastReturn = {
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
    // Utiliser une URL correctement encodée
    const encodedUrl = encodeCorrectly(fileUrl);
    console.log("Encoded URL for download:", encodedUrl);
    
    // Ouvrir l'URL encodée dans un nouvel onglet
    window.open(encodedUrl, '_blank');
    
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
    // Utiliser une URL correctement encodée
    const encodedUrl = encodeCorrectly(fileUrl);
    console.log("Encoded URL for opening in tab:", encodedUrl);
    
    // Ouvrir directement dans un nouvel onglet
    window.open(encodedUrl, '_blank');
    
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
 * Prépare un document avec une URL valide et encodée
 */
export const prepareDocumentForUse = (document: TenantDocument): TenantDocument => {
  // S'assurer que le document a une URL
  const docWithUrl = ensureDocumentUrl(document);
  
  // Si le document a une URL, on l'encode correctement
  if (docWithUrl.file_url) {
    console.log(`Préparation de l'URL pour le document ${docWithUrl.id}`);
    // Nous ne modifions pas directement l'URL ici, car encodeCorrectly est utilisé lors de l'ouverture
  }
  
  return docWithUrl;
};
