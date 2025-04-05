import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';

export interface DocumentTemplate {
  id: string;
  name: string;
  content: string;
  category?: string;
  created_at: string;
  updated_at?: string;
  user_id?: string;
  description?: string;
}

export function useTemplates() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setTemplates(data || []);
      return data || [];
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load templates.',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const saveTemplate = async (template: Omit<DocumentTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .insert([template])
        .select();

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Template saved successfully.',
      });
      
      return data?.[0];
    } catch (error: any) {
      console.error('Error saving template:', error);
      toast({
        title: 'Error',
        description: 'Failed to save template.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<DocumentTemplate>) => {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Template updated successfully.',
      });

      return data?.[0];
    } catch (error: any) {
      console.error('Error updating template:', error);
      toast({
        title: 'Error',
        description: 'Failed to update template.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('document_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Template deleted successfully.',
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting template:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete template.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    isLoading,
    templates,
    fetchTemplates,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
  };
}
