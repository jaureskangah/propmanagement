
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
        minHeight: "500px"
      }}
      data-pdf-container="true"
    >
      <iframe
        ref={iframeRef}
        src={pdfUrl}
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
        onError={onError}
      />
    </div>
  );
};
