
import React from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";

interface UploadButtonProps {
  isUploading: boolean;
  onClick: () => void;
  disabled: boolean;
}

export const UploadButton = ({ isUploading, onClick, disabled }: UploadButtonProps) => {
  const { t } = useLocale();

  return (
    <motion.div whileHover={{ scale: disabled ? 1 : 1.02 }} whileTap={{ scale: disabled ? 1 : 0.98 }}>
      <Button
        onClick={onClick}
        disabled={disabled}
        className="w-full font-medium shadow-sm bg-purple-600 hover:bg-purple-700 text-white"
        variant={disabled ? "outline" : "default"}
        size="lg"
      >
        {isUploading ? (
          <>
            <div className="animate-spin h-5 w-5 mr-2 border-2 border-current border-t-transparent rounded-full" />
            <span className="text-base">{t("uploading")}</span>
          </>
        ) : (
          <>
            <Upload className="h-5 w-5 mr-2" />
            <span className="text-base">{t("uploadDocument")}</span>
          </>
        )}
      </Button>
    </motion.div>
  );
};
