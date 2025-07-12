import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Image, FileIcon, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

interface QuickUploadProps {
  tenantId: string;
  onUploadComplete: () => void;
  compact?: boolean;
}

interface FileWithPreview extends File {
  preview?: string;
  category?: string;
  uploadProgress?: number;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
}

export const QuickUpload = ({ tenantId, onUploadComplete, compact = false }: QuickUploadProps) => {
  const { t } = useLocale();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadDocument } = useDocumentUpload(tenantId, onUploadComplete);

  const documentCategories = [
    { value: 'lease', label: t('lease') },
    { value: 'identity', label: t('identity') },
    { value: 'income', label: t('income') },
    { value: 'insurance', label: t('insurance') },
    { value: 'other', label: t('other') }
  ];

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    if (file.type === 'application/pdf') {
      return <FileText className="h-4 w-4" />;
    }
    return <FileIcon className="h-4 w-4" />;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).map(file => ({
      ...file,
      category: 'other',
      uploadStatus: 'pending' as const,
      uploadProgress: 0
    }));
    
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).map(file => ({
        ...file,
        category: 'other',
        uploadStatus: 'pending' as const,
        uploadProgress: 0
      }));
      
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const updateFileCategory = (fileIndex: number, category: string) => {
    setFiles(prev => prev.map((file, index) => 
      index === fileIndex ? { ...file, category } : file
    ));
  };

  const removeFile = (fileIndex: number) => {
    setFiles(prev => prev.filter((_, index) => index !== fileIndex));
  };

  const uploadFile = async (fileIndex: number) => {
    const file = files[fileIndex];
    if (!file || !file.category) return;

    // Update status to uploading
    setFiles(prev => prev.map((f, index) => 
      index === fileIndex ? { ...f, uploadStatus: 'uploading' as const, uploadProgress: 0 } : f
    ));

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map((f, index) => 
          index === fileIndex && f.uploadProgress !== undefined && f.uploadProgress < 90
            ? { ...f, uploadProgress: f.uploadProgress + 10 }
            : f
        ));
      }, 200);

      await uploadDocument(file, file.category);
      
      clearInterval(progressInterval);
      
      // Update to success
      setFiles(prev => prev.map((f, index) => 
        index === fileIndex 
          ? { ...f, uploadStatus: 'success' as const, uploadProgress: 100 }
          : f
      ));

      // Remove after delay
      setTimeout(() => {
        removeFile(fileIndex);
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map((f, index) => 
        index === fileIndex 
          ? { ...f, uploadStatus: 'error' as const, uploadProgress: 0 }
          : f
      ));
    }
  };

  const uploadAllFiles = async () => {
    const pendingFiles = files
      .map((file, index) => ({ file, index }))
      .filter(({ file }) => file.uploadStatus === 'pending' && file.category);

    for (const { index } of pendingFiles) {
      await uploadFile(index);
    }
  };

  if (compact) {
    return (
      <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors">
        <CardContent className="p-4">
          <div
            className={cn(
              "text-center cursor-pointer transition-colors rounded-lg p-4",
              isDragging && "bg-primary/10"
            )}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {t('dragDropOrClick')}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileSelect}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Drop Zone */}
      <Card 
        className={cn(
          "border-dashed border-2 transition-all duration-300 cursor-pointer",
          isDragging 
            ? "border-primary bg-primary/5 scale-105" 
            : "border-muted-foreground/25 hover:border-primary/50"
        )}
      >
        <CardContent 
          className="p-8"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-center">
            <motion.div
              animate={{ scale: isDragging ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            </motion.div>
            <h3 className="text-lg font-medium mb-2">{t('uploadDocuments')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('dragDropMultipleFiles')}
            </p>
            <Button variant="outline">
              {t('selectFiles')}
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileSelect}
          />
        </CardContent>
      </Card>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex-shrink-0">
                  {getFileIcon(file)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  
                  {file.uploadStatus === 'uploading' && (
                    <Progress 
                      value={file.uploadProgress || 0} 
                      className="mt-2 h-1"
                    />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {file.uploadStatus === 'pending' && (
                    <Select
                      value={file.category}
                      onValueChange={(value) => updateFileCategory(index, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder={t('category')} />
                      </SelectTrigger>
                      <SelectContent>
                        {documentCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {file.uploadStatus === 'pending' && file.category && (
                    <Button
                      size="sm"
                      onClick={() => uploadFile(index)}
                      disabled={!file.category}
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      {t('upload')}
                    </Button>
                  )}
                  
                  {file.uploadStatus === 'success' && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Check className="h-4 w-4" />
                      <span className="text-xs">{t('uploaded')}</span>
                    </div>
                  )}
                  
                  {file.uploadStatus === 'error' && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => uploadFile(index)}
                    >
                      {t('retry')}
                    </Button>
                  )}
                  
                  {file.uploadStatus !== 'uploading' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
            
            {files.some(f => f.uploadStatus === 'pending' && f.category) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end"
              >
                <Button onClick={uploadAllFiles}>
                  <Upload className="h-4 w-4 mr-2" />
                  {t('uploadAll')}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};