
import React from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";

interface UploadButtonProps {
  isUploading: boolean;
  onClick: () => void;
  disabled: boolean;
}

export const UploadButton = ({ isUploading, onClick, disabled }: UploadButtonProps) => {
  const { t } = useLocale();

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
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
  );
};
