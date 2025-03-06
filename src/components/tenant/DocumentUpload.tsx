
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileUp, File, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface DocumentUploadProps {
  tenantId: string;
  onUploadComplete: () => void;
}

export const DocumentUpload = ({ tenantId, onUploadComplete }: DocumentUploadProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("other");
  const [uploadProgress, setUploadProgress] = useState(0); // État pour suivre la progression
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const { t } = useLocale();
  const { isUploading, uploadDocument } = useDocumentUpload(tenantId, onUploadComplete);

  const simulateProgress = useCallback(() => {
    // Fonction pour simuler une progression du téléversement
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 90 ? 90 : newProgress; // Plafond à 90% jusqu'à la fin réelle
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
        // Réinitialiser après un court délai pour montrer le succès
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
      if (file.size > 10 * 1024 * 1024) { // 10MB limite
        alert(t("fileSizeLimit"));
        return;
      }
      setSelectedFile(file);
      setUploadStatus('idle');
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB limite
        alert(t("fileSizeLimit"));
        return;
      }
      setSelectedFile(file);
      setUploadStatus('idle');
    }
  };

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <motion.div 
          className={`border-2 rounded-lg p-6 text-center cursor-pointer transition-all h-36 flex flex-col items-center justify-center ${
            dragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-dashed border-gray-300 dark:border-gray-700'
          }`}
          whileHover={{ scale: 1.01 }}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          />
          
          <AnimatePresence mode="wait">
            {dragActive ? (
              <motion.div
                key="drop"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <FileUp className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <p className="text-lg font-medium text-blue-600 mb-1">
                  {t("dropFilesHere")}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="drag"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <FileUp className="h-12 w-12 mx-auto mb-3 text-blue-500" />
                <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("dragFilesHere")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("orClickToUpload")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <File className="h-10 w-10 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate max-w-[250px] mb-1">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {Math.round(selectedFile.size / 1024)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedFile(null);
                  setUploadStatus('idle');
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="ml-2 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
              >
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {uploadStatus === 'uploading' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("uploadingFile")}</span>
                <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{t("uploadComplete")}</span>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{t("uploadFailed")}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("category")}</label>
            <Select 
              value={selectedCategory} 
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="important">{t("importantDocuments")}</SelectItem>
                <SelectItem value="lease">{t("leaseDocuments")}</SelectItem>
                <SelectItem value="receipt">{t("paymentReceipts")}</SelectItem>
                <SelectItem value="other">{t("otherDocuments")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={handleUpload}
            disabled={isUploading || uploadStatus === 'uploading'}
            className="w-full"
          >
            {uploadStatus === 'uploading' ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                {t("uploading")}
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {t("uploadDocument")}
              </>
            )}
          </Button>
        </motion.div>
      )}

      <div className="text-xs text-center text-muted-foreground">
        {t("supportedFormats")}
      </div>
    </div>
  );
};
