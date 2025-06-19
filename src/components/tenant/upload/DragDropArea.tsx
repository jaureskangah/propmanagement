
import React, { useState } from "react";
import { FileUp } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion, AnimatePresence } from "framer-motion";

interface DragDropAreaProps {
  onFileDrop: (file: File) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const DragDropArea = ({ onFileDrop, fileInputRef }: DragDropAreaProps) => {
  const [dragActive, setDragActive] = useState(false);
  const { t } = useLocale();

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
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert(t("documents.fileSizeLimit"));
        return;
      }
      onFileDrop(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert(t("documents.fileSizeLimit"));
        return;
      }
      onFileDrop(file);
    }
  };

  return (
    <motion.div 
      className={`border-2 rounded-lg p-6 text-center cursor-pointer transition-all h-40 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm ${
        dragActive 
          ? 'border-purple-500 bg-purple-50/80 dark:bg-purple-900/30' 
          : 'border-dashed border-purple-200 dark:border-purple-700'
      }`}
      whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
      onClick={handleClick}
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
            <FileUp className="h-14 w-14 mx-auto mb-4 text-purple-500" />
            <p className="text-lg font-medium text-purple-600 mb-1">
              {t("documents.dropFilesHere")}
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
            <FileUp className="h-14 w-14 mx-auto mb-3 text-purple-500" />
            <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("documents.dragFilesHere")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("documents.orClickToUpload")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
