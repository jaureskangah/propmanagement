
import React from "react";
import { Upload } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

export const EmptyDocumentsState = () => {
  const { t } = useLocale();
  
  return (
    <div className="text-center py-8 border-2 border-dashed rounded-lg">
      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">
        {t('noDocuments')}
      </p>
    </div>
  );
};
