
import React, { useEffect, useRef } from "react";

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
      console.log("TenantPdfViewer: Enforcing white background on container");
      containerRef.current.style.backgroundColor = "#ffffff !important";
    }
  }, []);

  useEffect(() => {
    console.log("TenantPdfViewer: Preparing to style PDF viewer");
    
    const timer = setTimeout(() => {
      try {
        if (iframeRef.current) {
          iframeRef.current.style.backgroundColor = "#ffffff !important";
          console.log("TenantPdfViewer: Applied white background to iframe");
          
          try {
            const iframeDoc = iframeRef.current.contentDocument || 
              (iframeRef.current.contentWindow && iframeRef.current.contentWindow.document);
            
            if (iframeDoc && iframeDoc.body) {
              iframeDoc.body.style.backgroundColor = "#ffffff !important";
              console.log("TenantPdfViewer: Applied white background to iframe body");
            }
          } catch (e) {
            console.log("TenantPdfViewer: Cannot access iframe content:", e);
          }
        }
        
        if (objectRef.current) {
          objectRef.current.style.backgroundColor = "#ffffff !important";
          console.log("TenantPdfViewer: Applied white background to object element");
        }
      } catch (e) {
        console.log("TenantPdfViewer: Error styling PDF elements:", e);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [pdfUrl]);

  return (
    <div 
      ref={containerRef}
      className="pdf-frame-container"
      style={{ 
        backgroundColor: "#ffffff !important",
        position: "relative",
        width: "100%",
        height: "100%"
      }}
    >
      <object
        ref={objectRef}
        data={pdfUrl}
        type="application/pdf"
        className="w-full h-full rounded-md border pdf-viewer"
        style={{ 
          backgroundColor: "#ffffff !important",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1
        }}
        onError={() => {
          console.log("TenantPdfViewer: Object error event fired");
          onError();
        }}
      >
        <iframe
          ref={iframeRef}
          src={pdfUrl}
          title="PDF Preview"
          className="w-full h-full rounded-md border pdf-viewer"
          style={{ 
            backgroundColor: "#ffffff !important",
            display: "block",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%"
          }}
          onError={() => {
            console.log("TenantPdfViewer: Iframe error event fired");
            onError();
          }}
          onLoad={() => {
            console.log("TenantPdfViewer: Iframe loaded");
            try {
              if (iframeRef.current && iframeRef.current.contentDocument) {
                iframeRef.current.contentDocument.body.style.backgroundColor = "#ffffff !important";
                console.log("TenantPdfViewer: Applied white background to iframe body");
              }
            } catch (e) {
              console.log("TenantPdfViewer: Error styling iframe:", e);
            }
          }}
        />
      </object>
    </div>
  );
}
