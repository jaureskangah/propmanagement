
import React from "react";
import { File, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

export const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex-shrink-0">
          <File className="h-10 w-10 text-blue-500" />
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
    </div>
  );
};
