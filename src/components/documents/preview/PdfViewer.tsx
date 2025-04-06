
import React, { useEffect, useState } from "react";

interface PdfViewerProps {
  pdfUrl: string;
  onError?: () => void;
}

export const PdfViewer = ({ pdfUrl, onError }: PdfViewerProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [pdfUrl]);

  const handleError = () => {
    console.error("PDF viewer error");
    if (onError) onError();
  };

  return (
    <div className="h-full w-full">
      {loading && (
        <div className="h-full w-full flex items-center justify-center bg-muted/20">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
      <iframe
        src={`${pdfUrl}#toolbar=1`}
        className="h-full w-full"
        style={{ minHeight: "500px", display: loading ? "none" : "block" }}
        title="PDF Document Preview"
        onError={handleError}
      />
    </div>
  );
};
