
import React, { useEffect, useRef, useState } from "react";
import { encodeCorrectly } from "@/components/tenant/documents/utils/documentUtils";

export interface PdfViewerProps {
  url: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [encodedUrl, setEncodedUrl] = useState<string>("");
  const [loadError, setLoadError] = useState<boolean>(false);
  
  useEffect(() => {
    // Encoder l'URL pour éviter les problèmes avec les caractères spéciaux
    try {
      const encoded = encodeCorrectly(url);
      console.log("URL encodée pour le PDF:", encoded);
      setEncodedUrl(encoded);
    } catch (e) {
      console.error("Erreur lors de l'encodage:", e);
      setEncodedUrl(url);
    }
  }, [url]);
  
  useEffect(() => {
    if (iframeRef.current) {
      // Appliquer un arrière-plan blanc à l'iframe
      iframeRef.current.style.backgroundColor = "#ffffff";
      
      try {
        // Essayer d'accéder au document de l'iframe pour appliquer des styles
        setTimeout(() => {
          if (iframeRef.current) {
            try {
              const iframeDoc = iframeRef.current.contentDocument || 
                (iframeRef.current.contentWindow && iframeRef.current.contentWindow.document);
              
              if (iframeDoc && iframeDoc.body) {
                iframeDoc.body.style.backgroundColor = "#ffffff";
                console.log("Fond blanc appliqué au corps de l'iframe");
              }
            } catch (e) {
              console.log("Impossible d'accéder au contenu de l'iframe:", e);
            }
          }
        }, 500);
      } catch (e) {
        console.log("Erreur lors de l'accès à l'iframe:", e);
      }
    }
  }, [encodedUrl]);
  
  // Ajouter un timestamp pour éviter les problèmes de cache
  const safeUrl = encodedUrl ? 
    `${encodedUrl}${encodedUrl.includes('?') ? '&' : '?'}t=${Date.now()}` : 
    "";
  
  const handleError = () => {
    console.error("Erreur de chargement du PDF:", encodedUrl);
    setLoadError(true);
  };
  
  return (
    <div 
      className="w-full h-full pdf-container"
      style={{ 
        backgroundColor: "#ffffff",
        position: "relative",
        overflow: "hidden",
        minHeight: "500px"
      }}
      data-pdf-container="true"
    >
      {loadError ? (
        <div className="w-full h-full flex items-center justify-center bg-white text-red-500">
          <p>Impossible de charger le document. Erreur d'accès au fichier.</p>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          src={safeUrl}
          className="w-full h-full pdf-viewer"
          title="PDF Document"
          style={{ 
            border: "none", 
            backgroundColor: "#ffffff",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%"
          }}
          onError={handleError}
        />
      )}
    </div>
  );
};
