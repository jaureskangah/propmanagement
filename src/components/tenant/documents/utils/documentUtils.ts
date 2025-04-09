
import { supabase } from "@/lib/supabase";

// Type de retour pour nos fonctions toast
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
 * Génère une URL directe vers un fichier dans Supabase Storage
 */
export const getStorageUrl = (tenantId: string, fileName: string): string => {
  // Encoder correctement le nom du fichier pour l'URL
  const encodedFileName = encodeURIComponent(fileName);
  return `https://jhjhzwbvmkurwfohjxlu.supabase.co/storage/v1/object/public/tenant_documents/${tenantId}/${encodedFileName}`;
};

/**
 * S'assure qu'un document a une URL valide
 */
export const ensureDocumentUrl = (document: TenantDocument): TenantDocument => {
  if (!document.file_url) {
    document.file_url = getStorageUrl(document.tenant_id || '', document.name);
    console.log(`URL générée pour le document ${document.id}: ${document.file_url}`);
  }
  return document;
};

/**
 * Encode correctement une URL pour Supabase Storage
 * Cette fonction s'assure que l'URL est correctement encodée pour être utilisée avec Supabase Storage
 */
export const encodeCorrectly = (url: string): string => {
  try {
    // Séparer l'URL pour ne pas encoder les parties déjà encodées
    const urlObj = new URL(url);
    
    // Récupérer le chemin
    let path = urlObj.pathname;
    
    // Trouver le dernier segment (le nom du fichier)
    const lastSlashIndex = path.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
      const basePath = path.substring(0, lastSlashIndex + 1);
      const fileName = path.substring(lastSlashIndex + 1);
      
      // Décoder d'abord au cas où le nom est déjà partiellement encodé
      let decodedFileName;
      try {
        decodedFileName = decodeURIComponent(fileName);
      } catch (e) {
        // Si le décodage échoue, utiliser le nom tel quel
        decodedFileName = fileName;
      }
      
      // Encoder correctement tous les caractères spéciaux, y compris les apostrophes
      // Remplacer manuellement les apostrophes par leur forme encodée
      let sanitizedFileName = decodedFileName.replace(/'/g, "%27");
      
      // Ensuite encoder tout le reste
      const encodedFileName = encodeURIComponent(sanitizedFileName);
      
      path = basePath + encodedFileName;
      
      console.log("Original filename:", fileName);
      console.log("Decoded filename:", decodedFileName);
      console.log("Sanitized filename:", sanitizedFileName);
      console.log("Final encoded filename:", encodedFileName);
    }
    
    // Reconstruire l'URL
    urlObj.pathname = path;
    const finalUrl = urlObj.toString();
    console.log("Final encoded URL:", finalUrl);
    return finalUrl;
  } catch (e) {
    // Fallback si l'URL n'est pas valide
    console.error("Erreur d'encodage d'URL:", e, "URL originale:", url);
    
    // Tentative de fallback avec méthode simple
    try {
      // Essayer de trouver le dernier segment du chemin à l'aide de la chaîne
      const parts = url.split('/');
      const fileName = parts[parts.length - 1];
      
      // Remplacer directement le nom de fichier par sa version encodée
      const encodedFileName = encodeURIComponent(fileName).replace(/'/g, "%27");
      parts[parts.length - 1] = encodedFileName;
      
      return parts.join('/');
    } catch (fallbackError) {
      console.error("Même le fallback a échoué:", fallbackError);
      return url; // Retourner l'URL d'origine en dernier recours
    }
  }
};

// Import the TenantDocument type
import { TenantDocument } from "@/types/tenant";
