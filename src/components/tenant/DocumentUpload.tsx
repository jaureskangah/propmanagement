import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";

interface DocumentUploadProps {
  tenantId: string;
  onUploadComplete: () => void;
}

export const DocumentUpload = ({ tenantId, onUploadComplete }: DocumentUploadProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { isUploading, uploadDocument } = useDocumentUpload(tenantId, onUploadComplete);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadDocument(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        className="w-full"
        variant="outline"
        disabled={isUploading}
      >
        <Upload className="mr-2 h-4 w-4" />
        {isUploading ? "Chargement en cours..." : "Charger un document"}
      </Button>
    </div>
  );
};