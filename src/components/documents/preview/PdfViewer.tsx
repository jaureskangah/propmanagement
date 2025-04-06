
import { useEffect, useRef, useState } from "react";

interface PdfViewerProps {
  pdfUrl: string;
  onError: () => void;
}

export function PdfViewer({ pdfUrl, onError }: PdfViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const objectRef = useRef<HTMLObjectElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      console.log("PdfViewer: Enforcing white background on container");
      containerRef.current.style.backgroundColor = "#ffffff";
    }
    
    // Apply background color to iframe and object after rendering
    const timer = setTimeout(() => {
      try {
        if (iframeRef.current) {
          iframeRef.current.style.backgroundColor = "#ffffff";
          console.log("PdfViewer: Applied white background to iframe");
          
          try {
            const iframeDoc = iframeRef.current.contentDocument || 
              (iframeRef.current.contentWindow && iframeRef.current.contentWindow.document);
            
            if (iframeDoc && iframeDoc.body) {
              iframeDoc.body.style.backgroundColor = "#ffffff";
              console.log("PdfViewer: Applied white background to iframe body");
            }
          } catch (e) {
            console.log("PdfViewer: Cannot access iframe content:", e);
          }
        }
        
        if (objectRef.current) {
          objectRef.current.style.backgroundColor = "#ffffff";
          console.log("PdfViewer: Applied white background to object element");
        }
      } catch (e) {
        console.log("PdfViewer: Error styling PDF elements:", e);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [pdfUrl]);

  return (
    <div 
      ref={containerRef}
      className="pdf-frame-container w-full h-full"
      data-pdf-container="true"
      style={{ 
        backgroundColor: "#ffffff",
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden"
      }}
    >
      <iframe
        ref={iframeRef}
        src={pdfUrl}
        title="Document Preview"
        className="w-full h-full pdf-viewer"
        style={{ 
          backgroundColor: "#ffffff",
          border: "none",
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%"
        }}
        onError={() => {
          console.log("PdfViewer: Iframe error event fired");
          onError();
        }}
        onLoad={() => {
          console.log("PdfViewer: Iframe loaded");
          try {
            if (iframeRef.current && iframeRef.current.contentDocument) {
              console.log("PdfViewer: Attempting to style iframe content");
              const doc = iframeRef.current.contentDocument;
              if (doc && doc.body) {
                doc.body.style.backgroundColor = "#ffffff";
                console.log("PdfViewer: Applied white background to iframe body");
              }
            }
          } catch (e) {
            console.log("PdfViewer: Error styling iframe:", e);
          }
        }}
      />
    </div>
  );
}
