
import React from "react";
import { File, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

export const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between p-4 border rounded-lg bg-background/80 backdrop-blur-sm shadow-sm hover:shadow transition-all border-purple-200 dark:border-purple-800/40"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
          <File className="h-8 w-8 text-purple-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate max-w-[250px] mb-1">
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {Math.round(file.size / 1024)} KB
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="ml-2 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
        >
          <XCircle className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
};
