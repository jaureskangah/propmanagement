
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

export type DocumentTemplate = {
  id: string;
  name: string;
  content: string;
  description?: string;
  category: string;
  created_at: string;
  updated_at: string;
};

export function useTemplates() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const fetchTemplates = async (): Promise<DocumentTemplate[]> => {
    if (!user) return [];
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les modèles de documents",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveTemplate = async (template: Omit<DocumentTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .insert({
          ...template,
          user_id: user.id,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Le modèle a été sauvegardé",
      });
      
      return data;
    } catch (error: any) {
      console.error('Error saving template:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le modèle",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateTemplate = async (id: string, updates: Partial<Omit<DocumentTemplate, 'id' | 'created_at' | 'updated_at'>>) => {
    if (!user) return false;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('document_templates')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Le modèle a été mis à jour",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error updating template:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le modèle",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteTemplate = async (id: string) => {
    if (!user) return false;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('document_templates')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Le modèle a été supprimé",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting template:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le modèle",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    fetchTemplates,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
  };
}
