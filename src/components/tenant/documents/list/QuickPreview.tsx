
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { TenantDocument } from "@/types/tenant";
import { Eye, FileText, FileImage } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Skeleton } from "@/components/ui/skeleton";

interface QuickPreviewProps {
  document: TenantDocument;
  onFullView: () => void;
}

export const QuickPreview = ({ document, onFullView }: QuickPreviewProps) => {
  const { t } = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [isImage, setIsImage] = useState(false);
  const [isPdf, setIsPdf] = useState(false);

  useEffect(() => {
    if (document) {
      const name = (document.name || '').toLowerCase();
      setIsImage(!!name.match(/\.(jpg|jpeg|png|gif|webp)$/));
      setIsPdf(name.endsWith('.pdf'));
    }
  }, [document]);

  const handlePreviewLoad = () => {
    setIsLoading(false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/20"
          title={t("quickPreview")}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 md:w-96 p-0 shadow-lg" sideOffset={5}>
        <div className="flex flex-col">
          <div className="p-3 border-b">
            <div className="flex items-center gap-2">
              {isImage ? (
                <FileImage className="h-5 w-5 text-blue-600" />
              ) : (
                <FileText className="h-5 w-5 text-blue-600" />
              )}
              <p className="font-medium text-sm truncate">{document.name}</p>
            </div>
          </div>
          
          <div className="h-52 bg-slate-50 dark:bg-slate-900 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Skeleton className="h-40 w-40" />
              </div>
            )}
            
            {document.file_url && isImage ? (
              <img 
                src={document.file_url} 
                alt={document.name} 
                className="h-full w-full object-contain"
                onLoad={handlePreviewLoad}
              />
            ) : isPdf ? (
              <iframe 
                src={`${document.file_url}#toolbar=0&navpanes=0&scrollbar=0`} 
                className="w-full h-full border-none"
                title={document.name}
                onLoad={handlePreviewLoad}
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full flex-col gap-2">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {t("previewNotAvailable")}
                </p>
              </div>
            )}
          </div>
          
          <div className="p-3 border-t">
            <Button
              variant="default"
              size="sm"
              className="w-full"
              onClick={onFullView}
            >
              {t("openFullViewer")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
