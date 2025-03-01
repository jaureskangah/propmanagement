
import { useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/components/providers/LocaleProvider";

export const useDocumentActions = (onUpdate: () => void) => {
  const { t } = useLocale();
  
  const handleDeleteDocument = async (documentId: string, toast: any) => {
    try {
      const { error } = await supabase
        .from('tenant_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;
      
      toast({
        title: "Succès",
        description: t("docDeleteSuccess"),
      });
      
      onUpdate();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive",
      });
    }
  };

  return {
    handleDeleteDocument
  };
};
