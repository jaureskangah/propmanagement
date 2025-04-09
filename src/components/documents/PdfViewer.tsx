
import React, { useEffect, useRef } from "react";

export interface PdfViewerProps {
  url: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    if (iframeRef.current) {
      // S'assurer que l'iframe a un fond blanc
      iframeRef.current.style.backgroundColor = "#ffffff";
      
      try {
        // Essayer d'accéder au document de l'iframe pour appliquer des styles
        const applyStyles = () => {
          if (iframeRef.current) {
            try {
              const iframeDoc = iframeRef.current.contentDocument || 
                (iframeRef.current.contentWindow && iframeRef.current.contentWindow.document);
              
              if (iframeDoc && iframeDoc.body) {
                iframeDoc.body.style.backgroundColor = "#ffffff";
                console.log("Applied white background to iframe body");
              }
            } catch (e) {
              console.log("Cannot access iframe content:", e);
            }
          }
        };
        
        // Essayer d'appliquer les styles plusieurs fois pour s'assurer qu'ils sont bien appliqués
        setTimeout(applyStyles, 300);
        setTimeout(applyStyles, 1000);
        setTimeout(applyStyles, 2000);
      } catch (e) {
        console.log("Error accessing iframe:", e);
      }
    }
  }, [url]);
  
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
      <iframe
        ref={iframeRef}
        src={url}
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
      />
    </div>
  );
};
