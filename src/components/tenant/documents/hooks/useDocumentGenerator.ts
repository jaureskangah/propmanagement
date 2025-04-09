
import { useState, useEffect } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useToast } from "@/hooks/use-toast";
import { generateCustomPdf } from "@/components/tenant/documents/templates/customPdf";
import { Tenant } from "@/types/tenant";
import { processDynamicFields } from "../templates/utils/contentParser";

export function useDocumentGenerator(tenant?: Tenant | null) {
  const { t } = useLocale();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isSaveTemplateDialogOpen, setIsSaveTemplateDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSelectTemplate = (templateId: string, templateName: string) => {
    setSelectedTemplate(templateId);
    setSelectedTemplateName(templateName);
  };

  const handleGeneratePreview = async (content: string) => {
    setIsGenerating(true);
    setPreviewError(null);
    
    try {
      if (!content || content.trim() === '') {
        throw new Error(t('documentGenerator.emptyDocument') || "Le contenu du document est vide");
      }
      
      try {
        const lines = content.split('\n');
        const title = lines.length > 0 ? lines[0].trim() : t('documentGenerator.document') || 'Document';
        
        // Traiter les champs dynamiques si un locataire est fourni
        let processedContent = content;
        if (tenant) {
          processedContent = processDynamicFields(content, tenant);
        }
        
        const pdfBuffer = await generateCustomPdf(processedContent, {
          title: title,
          headerText: selectedTemplateName || t('documentGenerator.document') || 'Document',
          showPageNumbers: true,
          showDate: true
        }, tenant);
        
        const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
        const previewUrl = URL.createObjectURL(pdfBlob);
        
        setPreviewUrl(previewUrl);
        setActiveTab("preview");
      } catch (pdfError) {
        console.error("Error generating PDF from content:", pdfError);
        throw new Error(t('documentGenerator.pdfGenerationError') || "Erreur lors de la génération du PDF");
      }
    } catch (error) {
      console.error("Error generating preview:", error);
      setPreviewError(error instanceof Error ? error.message : t('documentGenerator.unknownError') || "Erreur inconnue");
      setActiveTab("preview");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdatePreview = async (content: string) => {
    return handleGeneratePreview(content);
  };

  const handleSaveToHistory = async () => {
    // Implement history saving logic here
    toast({
      title: t('documentGenerator.documentSaved') || "Document enregistré",
      description: t('documentGenerator.documentSavedDescription') || "Votre document a été enregistré avec succès"
    });
  };

  const handleDownload = async () => {
    if (!previewUrl) return;
    
    setIsDownloading(true);
    
    try {
      const link = document.createElement("a");
      link.href = previewUrl;
      link.download = `${selectedTemplateName || t('documentGenerator.document') || "document"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      await handleSaveToHistory();
      
      toast({
        title: t('documentGenerator.downloadStarted') || "Téléchargement commencé",
        description: t('documentGenerator.downloadStartedDescription') || "Votre document sera téléchargé dans quelques instants"
      });
    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: t('error') || "Erreur",
        description: t('documentGenerator.downloadError') || "Erreur lors du téléchargement du document",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Fonction pour insérer un champ dynamique dans l'éditeur
  const handleInsertDynamicField = (field: string) => {
    setDocumentContent(prev => {
      const textarea = document.querySelector('textarea');
      if (!textarea) return prev + field;
      
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      return prev.substring(0, start) + field + prev.substring(end);
    });
  };

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return {
    selectedTemplate,
    selectedTemplateName,
    documentContent,
    previewUrl,
    isGenerating,
    isDownloading,
    activeTab,
    previewError,
    isSaveTemplateDialogOpen,
    handleSelectTemplate,
    handleGeneratePreview,
    handleUpdatePreview,
    handleDownload,
    handleInsertDynamicField,
    setDocumentContent,
    setActiveTab,
    setIsSaveTemplateDialogOpen
  };
}
