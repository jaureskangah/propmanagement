
import React, { useState, useCallback, useRef } from "react";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";
import { DragDropArea } from "./upload/DragDropArea";
import { FilePreview } from "./upload/FilePreview";
import { UploadProgress } from "./upload/UploadProgress";
import { CategorySelector } from "./upload/CategorySelector";
import { UploadButton } from "./upload/UploadButton";

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
      } catch (error) {
        clearInterval(progressInterval);
        setUploadStatus('error');
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
    }
  };

  const handleFileDrop = (file: File) => {
    setSelectedFile(file);
    setUploadStatus('idle');
  };

  return (
    <div className="space-y-4">
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
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
          />

          <UploadProgress status={uploadStatus} progress={uploadProgress} />
          
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
