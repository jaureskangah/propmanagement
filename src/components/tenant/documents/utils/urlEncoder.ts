
import { toast } from "@/hooks/use-toast";

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
