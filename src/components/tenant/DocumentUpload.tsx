
import React, { useState, useCallback, useRef } from "react";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";
import { DragDropArea } from "./upload/DragDropArea";
import { FilePreview } from "./upload/FilePreview";
import { UploadProgress } from "./upload/UploadProgress";
import { CategorySelector } from "./upload/CategorySelector";
import { UploadButton } from "./upload/UploadButton";
import { Info } from "lucide-react";

interface DocumentUploadProps {
  tenantId: string;
  onUploadComplete: () => void;
}

export const DocumentUpload = ({ tenantId, onUploadComplete }: DocumentUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("other");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useLocale();
  const { isUploading, uploadDocument } = useDocumentUpload(tenantId, onUploadComplete);

  const simulateProgress = useCallback(() => {
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 90 ? 90 : newProgress; // Cap at 90% until complete
      });
    }, 300);
    return interval;
  }, []);

  const handleUpload = async () => {
    if (selectedFile) {
      setUploadStatus('uploading');
      setErrorMessage(null);
      const progressInterval = simulateProgress();
      
      try {
        await uploadDocument(selectedFile, selectedCategory);
        clearInterval(progressInterval);
        setUploadProgress(100);
        setUploadStatus('success');
        // Reset after a short delay to show success
        setTimeout(() => {
          setSelectedFile(null);
          setSelectedCategory("other");
          setUploadProgress(0);
          setUploadStatus('idle');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }, 2000);
      } catch (error: any) {
        clearInterval(progressInterval);
        setUploadStatus('error');
        setErrorMessage(error.message || "Unknown error");
        console.error("Upload error:", error);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert(t("fileSizeLimit"));
        return;
      }
      setSelectedFile(file);
      setUploadStatus('idle');
      setErrorMessage(null);
    }
  };

  const handleFileDrop = (file: File) => {
    setSelectedFile(file);
    setUploadStatus('idle');
    setErrorMessage(null);
  };

  return (
    <div className="space-y-4">
      {errorMessage === "storageBucketMissing" && (
        <div className="text-sm p-3 border border-yellow-300 bg-yellow-50 rounded-md text-yellow-700 flex items-start gap-2">
          <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{t("storageBucketMissing")}</p>
            <p className="mt-1">The document storage system needs to be configured. Please contact your administrator.</p>
          </div>
        </div>
      )}
      
      {!selectedFile ? (
        <DragDropArea 
          onFileDrop={handleFileDrop} 
          fileInputRef={fileInputRef}
        />
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <FilePreview 
            file={selectedFile} 
            onRemove={() => {
              setSelectedFile(null);
              setUploadStatus('idle');
              setErrorMessage(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
          />

          <UploadProgress status={uploadStatus} progress={uploadProgress} />
          
          {uploadStatus === 'error' && errorMessage && errorMessage !== "storageBucketMissing" && (
            <div className="text-sm p-3 border border-red-300 bg-red-50 rounded-md text-red-700">
              {t(errorMessage) || errorMessage}
            </div>
          )}
          
          <CategorySelector 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          
          <UploadButton 
            isUploading={isUploading} 
            onClick={handleUpload}
            disabled={isUploading || uploadStatus === 'uploading'}
          />
        </motion.div>
      )}

      <div className="text-xs text-center text-muted-foreground">
        {t("supportedFormats")}
      </div>
    </div>
  );
};
