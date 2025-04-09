
import { toast } from "@/hooks/use-toast";

/**
 * Encode correctement une URL pour Supabase Storage
 * Cette fonction s'assure que l'URL est correctement encodée pour être utilisée avec Supabase Storage
 */
export const encodeCorrectly = (url: string): string => {
  try {
    console.log("URL avant encodage:", url);
    
    // Cas spécifique pour l'URL Supabase Storage
    if (url.includes('supabase.co/storage/v1/object/public/tenant_documents')) {
      // Extraire les parties de l'URL
      const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);
      const fileName = url.substring(url.lastIndexOf('/') + 1);
      
      // Décoder complètement le nom de fichier d'abord pour éviter le double encodage
      let decodedFileName;
      try {
        decodedFileName = decodeURIComponent(fileName);
      } catch (e) {
        decodedFileName = fileName;
      }
      
      console.log("Nom de fichier décodé:", decodedFileName);
      
      // Encoder spécifiquement l'apostrophe et autres caractères problématiques
      let encodedFileName = decodedFileName
        .replace(/'/g, "%27")      // Apostrophe
        .replace(/\(/g, "%28")     // Parenthèse ouvrante
        .replace(/\)/g, "%29")     // Parenthèse fermante
        .replace(/\s/g, "%20")     // Espaces
        .replace(/é/g, "%C3%A9")   // é
        .replace(/è/g, "%C3%A8")   // è
        .replace(/à/g, "%C3%A0")   // à
        .replace(/ô/g, "%C3%B4")   // ô
        .replace(/î/g, "%C3%AE")   // î
        .replace(/ê/g, "%C3%AA")   // ê
        .replace(/ë/g, "%C3%AB")   // ë
        .replace(/ç/g, "%C3%A7")   // ç
        .replace(/ù/g, "%C3%B9")   // ù
        .replace(/û/g, "%C3%BB");  // û
      
      // Encoder génériquement les autres caractères spéciaux
      encodedFileName = encodeURIComponent(encodedFileName)
        // Conserver les encodages spécifiques qu'on vient de faire
        .replace(/%25(\d\d)/g, "%$1");
      
      const finalUrl = baseUrl + encodedFileName;
      console.log("URL finale encodée:", finalUrl);
      return finalUrl;
    }
    
    // Pour les autres types d'URL, utiliser l'encodage standard
    return encodeURI(url);
  } catch (e) {
    console.error("Erreur lors de l'encodage de l'URL:", e);
    // Méthode de secours
    try {
      return encodeURI(url);
    } catch (finalError) {
      console.error("Impossible d'encoder l'URL:", finalError);
      return url;
    }
  }
};
