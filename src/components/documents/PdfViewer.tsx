
import React from "react";

export interface PdfViewerProps {
  url: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
  return (
    <div className="w-full h-full bg-white">
      <iframe
        src={url}
        className="w-full h-full bg-white"
        title="PDF Document"
        style={{ 
          border: "none", 
          backgroundColor: "#ffffff" 
        }}
      />
    </div>
  );
};
