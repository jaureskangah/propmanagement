
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileUp, File } from "lucide-react";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DocumentUploadProps {
  tenantId: string;
  onUploadComplete: () => void;
}

export const DocumentUpload = ({ tenantId, onUploadComplete }: DocumentUploadProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("other");
  const { t } = useLocale();
  const { isUploading, uploadDocument } = useDocumentUpload(tenantId, onUploadComplete);

  const handleUpload = async () => {
    if (selectedFile) {
      await uploadDocument(selectedFile, selectedCategory);
      setSelectedFile(null);
      setSelectedCategory("other");
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
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
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-dashed border-gray-300 dark:border-gray-700'} rounded-lg p-6 text-center cursor-pointer transition-all`}
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
        
        <FileUp className="h-12 w-12 mx-auto mb-4 text-blue-500" />
        <p className="text-sm text-muted-foreground mb-2">
          {t("dragDropFiles")}
        </p>
        <p className="text-xs text-muted-foreground">
          Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG
        </p>
      </div>
      
      {selectedFile && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <File className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium truncate max-w-[250px]">
                {selectedFile.name}
              </span>
            </div>
          </div>
          
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
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
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
    </div>
  );
};
