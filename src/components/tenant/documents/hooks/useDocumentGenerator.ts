
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { useTenant } from "@/components/providers/TenantProvider";
import { supabase } from "@/lib/supabase";
import { templateContent } from "../templates/templateContent";
import { useDocumentActions } from "./useDocumentActions";

export const useDocumentGenerator = () => {
  const [content, setContent] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { tenant } = useTenant();
  const { saveDocumentToHistory } = useDocumentActions();

  // Update content when template changes
  const handleTemplateChange = (templateId: string, name: string) => {
    setTemplateName(name);
    const template = templateContent[templateId];
    
    if (template) {
      let processedContent = template;
      
      // Replace tenant placeholders if tenant data is available
      if (tenant) {
        processedContent = processedContent
          .replace(/\{tenant_name\}/g, tenant.name || "")
          .replace(/\{tenant_email\}/g, tenant.email || "")
          .replace(/\{tenant_phone\}/g, tenant.phone || "")
          .replace(/\{property_address\}/g, tenant.properties?.name || "")
          .replace(/\{unit_number\}/g, tenant.unit_number || "")
          .replace(/\{lease_start\}/g, tenant.lease_start || "")
          .replace(/\{lease_end\}/g, tenant.lease_end || "")
          .replace(/\{rent_amount\}/g, tenant.rent_amount?.toString() || "");
      }
      
      setContent(processedContent);
    }
  };

  // Generate PDF preview from content
  const generatePreview = async () => {
    if (!content.trim()) {
      toast({
        title: "Erreur",
        description: "Le document est vide",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setPreviewError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-document-content', {
        body: {
          content,
          format: 'pdf'
        }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        setPreviewUrl(data.url);
        return data.url;
      } else {
        throw new Error("No URL returned from document generation");
      }
    } catch (error) {
      console.error('Error generating preview:', error);
      setPreviewError("Erreur lors de la génération de l'aperçu");
      setPreviewUrl(null);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Save document to history
  const saveDocument = async () => {
    const pdfUrl = previewUrl || await generatePreview();
    
    if (!pdfUrl || !user) return;
    
    try {
      await saveDocumentToHistory({
        name: templateName || "Document personnalisé",
        content,
        fileUrl: pdfUrl
      });
      
      toast({
        title: "Succès",
        description: "Document enregistré dans l'historique",
      });
    } catch (error) {
      console.error('Error saving document:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le document",
        variant: "destructive",
      });
    }
  };

  // Reset document content and preview
  const resetDocument = () => {
    setContent("");
    setTemplateContent("");
    setPreviewUrl(null);
    setPreviewError(null);
  };

  return {
    content,
    setContent,
    templateName,
    setTemplateName,
    isGenerating,
    previewUrl,
    previewError,
    tenant,
    handleTemplateChange,
    generatePreview,
    saveDocument,
    resetDocument
  };
};
