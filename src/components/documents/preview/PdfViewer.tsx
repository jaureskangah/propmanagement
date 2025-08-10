
import React, { useEffect, useRef } from "react";

interface PdfViewerProps {
  pdfUrl: string;
  onError?: () => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ pdfUrl, onError }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.style.backgroundColor = "#ffffff";
      
      try {
        // Try to access iframe content document to apply styles
        setTimeout(() => {
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
              if (onError) onError();
            }
          }
        }, 300);
      } catch (e) {
        console.log("Error accessing iframe:", e);
        if (onError) onError();
      }
    }
  }, [pdfUrl, onError]);
  
  return (
    <div 
      className="w-full h-full pdf-container"
      style={{ 
        backgroundColor: "#ffffff",
        position: "relative",
        overflow: "hidden",
        minHeight: "500px",
        maxWidth: "100%"
      }}
      data-pdf-container="true"
    >
      <object
        data={pdfUrl}
        type="application/pdf"
        className="w-full h-full pdf-viewer"
        aria-label="PDF Document"
        style={{
          backgroundColor: "#ffffff",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none"
        }}
        onError={onError as any}
      >
        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "#ffffff" }}>
          <p>
            Impossible d'afficher le PDF dans la page. 
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Ouvrir le document dans un nouvel onglet</a>.
          </p>
        </div>
      </object>

      {/* Fallback iframe (caché) si certains navigateurs ne gèrent pas <object> */}
      <iframe
        ref={iframeRef}
        src={pdfUrl}
        title="PDF Document"
        className="w-full h-full"
        style={{ display: "none", border: "none", backgroundColor: "#ffffff" }}
        onError={onError}
      />
    </div>
  );
};
