
import React from "react";

export interface PdfViewerProps {
  url: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
  return (
    <div className="w-full h-full">
      <iframe
        src={url}
        className="w-full h-full"
        title="PDF Document"
        style={{ border: "none" }}
      />
    </div>
  );
};
