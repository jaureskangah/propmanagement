
import { useEffect, useRef, useState } from "react";

interface PdfViewerProps {
  pdfUrl: string;
  onError: () => void;
}

export function PdfViewer({ pdfUrl, onError }: PdfViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const objectRef = useRef<HTMLObjectElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    if (containerRef.current) {
      console.log("PdfViewer: Enforcing white background on container");
      containerRef.current.style.backgroundColor = "#ffffff !important";
      
      // Log initial container dimensions
      const { width, height } = containerRef.current.getBoundingClientRect();
      console.log("PdfViewer: Initial container dimensions:", { width, height });
      setDimensions({ width, height });
    }
  }, []);

  // Track container dimensions
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        console.log("PdfViewer: Container resized:", { width, height });
        setDimensions({ width, height });
      }
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    console.log("PdfViewer: Preparing to style PDF viewer");
    
    const timer = setTimeout(() => {
      try {
        if (iframeRef.current) {
          iframeRef.current.style.backgroundColor = "#ffffff !important";
          console.log("PdfViewer: Applied white background to iframe");
          
          try {
            const iframeDoc = iframeRef.current.contentDocument || 
              (iframeRef.current.contentWindow && iframeRef.current.contentWindow.document);
            
            if (iframeDoc && iframeDoc.body) {
              iframeDoc.body.style.backgroundColor = "#ffffff !important";
              console.log("PdfViewer: Applied white background to iframe body");
            }
          } catch (e) {
            console.log("PdfViewer: Cannot access iframe content:", e);
          }
        }
        
        if (objectRef.current) {
          objectRef.current.style.backgroundColor = "#ffffff !important";
          console.log("PdfViewer: Applied white background to object element");
        }
      } catch (e) {
        console.log("PdfViewer: Error styling PDF elements:", e);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [pdfUrl]);

  return (
    <div 
      ref={containerRef}
      className="border rounded-md h-[500px] overflow-hidden shadow-sm pdf-frame-container" 
      style={{ 
        backgroundColor: "#ffffff !important",
        position: "relative"
      }}
    >
      <object
        ref={objectRef}
        data={pdfUrl}
        type="application/pdf"
        className="w-full h-full pdf-viewer"
        style={{ 
          backgroundColor: "#ffffff !important",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1
        }}
        onError={() => {
          console.log("PdfViewer: Object error event fired");
          onError();
        }}
      >
        <iframe
          ref={iframeRef}
          src={pdfUrl}
          title="Document Preview"
          className="w-full h-full pdf-viewer"
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
                  doc.body.style.backgroundColor = "#ffffff !important";
                  console.log("PdfViewer: Applied white background to iframe body");
                }
              }
            } catch (e) {
              console.log("PdfViewer: Error styling iframe:", e);
            }
          }}
        />
      </object>
    </div>
  );
}
