
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
    console.log("URL avant encodage:", url);
    
    // Séparer l'URL pour ne pas encoder les parties déjà encodées
    const urlObj = new URL(url);
    
    // Récupérer le chemin
    let path = urlObj.pathname;
    
    // Trouver le dernier segment (le nom du fichier)
    const lastSlashIndex = path.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
      const basePath = path.substring(0, lastSlashIndex + 1);
      const fileName = path.substring(lastSlashIndex + 1);
      
      // Décoder complètement le nom de fichier d'abord
      let decodedFileName;
      try {
        // Essayer de décoder plusieurs fois pour s'assurer que tout est décodé
        decodedFileName = decodeURIComponent(fileName);
        // Certains noms de fichier peuvent être doublement encodés
        if (decodedFileName.includes('%')) {
          try {
            decodedFileName = decodeURIComponent(decodedFileName);
          } catch (e) {
            // Ignorer l'erreur si le décodage supplémentaire échoue
          }
        }
      } catch (e) {
        console.warn("Erreur lors du décodage du nom de fichier, utilisation tel quel:", e);
        decodedFileName = fileName;
      }
      
      console.log("Nom de fichier décodé:", decodedFileName);
      
      // Remplacer manuellement les caractères problématiques par leur forme encodée
      let sanitizedFileName = decodedFileName
        .replace(/'/g, "%27")  // Apostrophe
        .replace(/\(/g, "%28") // Parenthèse ouvrante
        .replace(/\)/g, "%29") // Parenthèse fermante
        .replace(/!/g, "%21")  // Point d'exclamation
        .replace(/\^/g, "%5E") // Circonflexe
        .replace(/\+/g, "%2B") // Plus
        .replace(/#/g, "%23")  // Dièse
        .replace(/@/g, "%40")  // Arobase
        .replace(/&/g, "%26")  // Esperluette
        .replace(/=/g, "%3D")  // Égal
        .replace(/:/g, "%3A")  // Deux-points
        .replace(/;/g, "%3B")  // Point-virgule
        .replace(/"/g, "%22")  // Guillemets doubles
        .replace(/</g, "%3C")  // Inférieur à
        .replace(/>/g, "%3E")  // Supérieur à
        .replace(/\{/g, "%7B") // Accolade ouvrante
        .replace(/\}/g, "%7D") // Accolade fermante
        .replace(/\\/g, "%5C") // Backslash
        .replace(/\|/g, "%7C") // Barre verticale
        .replace(/\$/g, "%24") // Dollar
        .replace(/\*/g, "%2A") // Astérisque
        .replace(/\[/g, "%5B") // Crochet ouvrant
        .replace(/\]/g, "%5D") // Crochet fermant
        .replace(/,/g, "%2C"); // Virgule
      
      console.log("Nom de fichier sanitizé avec remplacements manuels:", sanitizedFileName);
      
      // Encoder le reste des caractères
      // Ne pas réencoder les séquences % déjà présentes
      let encodedFileName = '';
      for (let i = 0; i < sanitizedFileName.length; i++) {
        if (sanitizedFileName[i] === '%' && i + 2 < sanitizedFileName.length) {
          // Vérifier si les deux caractères suivants sont hexadécimaux
          const hex1 = sanitizedFileName[i+1];
          const hex2 = sanitizedFileName[i+2];
          if (/^[0-9A-Fa-f]$/.test(hex1) && /^[0-9A-Fa-f]$/.test(hex2)) {
            // C'est une séquence encodée, garder telle quelle
            encodedFileName += sanitizedFileName.substring(i, i+3);
            i += 2; // Sauter les deux prochains caractères
          } else {
            // Ce n'est pas une séquence encodée valide
            encodedFileName += encodeURIComponent(sanitizedFileName[i]);
          }
        } else if (
          // Caractères non alphanumériques qui ne sont pas déjà encodés
          !/^[a-zA-Z0-9\-_.]$/.test(sanitizedFileName[i]) && 
          !sanitizedFileName.substring(i, i+3).match(/^%[0-9A-Fa-f]{2}$/)
        ) {
          encodedFileName += encodeURIComponent(sanitizedFileName[i]);
        } else {
          // Caractères alphanumériques, conserver tels quels
          encodedFileName += sanitizedFileName[i];
        }
      }
      
      console.log("Nom de fichier final après encodage sélectif:", encodedFileName);
      
      // Remplacer le chemin dans l'URL
      path = basePath + encodedFileName;
    }
    
    // Reconstruire l'URL
    urlObj.pathname = path;
    const finalUrl = urlObj.toString();
    console.log("URL finale encodée:", finalUrl);
    return finalUrl;
  } catch (e) {
    console.error("Erreur lors de l'encodage complexe de l'URL:", e, "URL originale:", url);
    
    // Méthode de secours simplifiée
    try {
      // Extraire le nom du fichier à partir de l'URL
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      // Décoder d'abord pour éviter le double encodage
      let decodedFileName;
      try {
        decodedFileName = decodeURIComponent(fileName);
      } catch (e) {
        decodedFileName = fileName;
      }
      
      // Appliquer un encodage manuel pour les caractères problématiques
      const encodedFileName = decodedFileName
        .replace(/'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/!/g, "%21")
        .replace(/#/g, "%23")
        .replace(/@/g, "%40")
        .replace(/=/g, "%3D")
        .replace(/&/g, "%26")
        .replace(/:/g, "%3A")
        .replace(/;/g, "%3B")
        .replace(/"/g, "%22")
        .replace(/</g, "%3C")
        .replace(/>/g, "%3E")
        .replace(/\$/g, "%24")
        .replace(/\*/g, "%2A");
      
      // Reconstruire l'URL
      urlParts[urlParts.length - 1] = encodedFileName;
      const fallbackUrl = urlParts.join('/');
      
      console.log("URL de secours simplifiée:", fallbackUrl);
      return fallbackUrl;
    } catch (fallbackError) {
      console.error("Échec de la méthode de secours:", fallbackError);
      
      // Dernier recours: encodage simple
      try {
        const simpleEncoded = encodeURI(url);
        console.log("Encodage simple en dernier recours:", simpleEncoded);
        return simpleEncoded;
      } catch (finalError) {
        console.error("Impossible d'encoder l'URL, retour à l'original:", finalError);
        return url;
      }
    }
  }
};

// Import the TenantDocument type
import { TenantDocument } from "@/types/tenant";
