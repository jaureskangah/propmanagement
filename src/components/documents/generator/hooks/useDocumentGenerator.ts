
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateCustomPdf } from "@/components/tenant/documents/templates/customPdf";
import { useDocumentHistory } from "@/hooks/useDocumentHistory";
import { useTenantData, convertToTenant } from "@/components/tenant/documents/hooks/useTenantData";

export const useDocumentGenerator = () => {
  const { toast } = useToast();
  const { tenant } = useTenantData();
  const { addToHistory } = useDocumentHistory();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [autoPreviewEnabled, setAutoPreviewEnabled] = useState(true);

  const handleSelectTemplate = (templateId: string, templateName: string) => {
    setSelectedTemplate(templateId);
    setSelectedTemplateName(templateName);
  };

  const handleGeneratePreview = async (content: string) => {
    if (isGenerating || !content || content.trim() === '') {
      return;
    }
    
    setIsGenerating(true);
    setPreviewError(null);
    
    try {
      const lines = content.split('\n');
      const title = lines.length > 0 ? lines[0].trim() : 'Document';
      
      const tenantForPdf = tenant ? convertToTenant(tenant) : null;
      
      const pdfBuffer = await generateCustomPdf(content, {
        title: title,
        headerText: selectedTemplateName || 'Document',
        showPageNumbers: true,
        showDate: true
      }, tenantForPdf);
      
      const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
      
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      
      const newPreviewUrl = URL.createObjectURL(pdfBlob);
      setPreviewUrl(newPreviewUrl);
      setActiveTab("preview");
    } catch (error) {
      console.error("Error generating preview:", error);
      setPreviewError(error instanceof Error ? error.message : "Error generating preview");
      setActiveTab("preview");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToHistory = async (fileUrl: string | null) => {
    if (!documentContent || !selectedTemplateName) return;
    
    const docName = selectedTemplateName || "Document";
    const docCategory = selectedTemplate ? 
      (selectedTemplate.includes("lease") ? "leaseDocuments" : 
       selectedTemplate.includes("payment") ? "paymentDocuments" :
       selectedTemplate.includes("notice") ? "noticeDocuments" :
       selectedTemplate.includes("inspection") ? "inspectionDocuments" : "miscDocuments") 
      : "miscDocuments";
    
    const historyEntry = {
      name: docName,
      category: docCategory,
      documentType: selectedTemplate || "customDocument",
      fileUrl: fileUrl,
      content: documentContent
    };
    
    const result = await addToHistory(historyEntry);
    
    if (result) {
      toast({
        title: t('documentSaved'),
        description: t('documentSavedDescription')
      });
    }
  };

  const handleDownload = async () => {
    if (!previewUrl) return;
    
    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = `${selectedTemplateName || "document"}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    await handleSaveToHistory(previewUrl);
    
    toast({
      title: t('downloadStarted'),
      description: t('downloadStartedDescription')
    });
  };

  // Cleanup preview URLs when component unmounts
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
    activeTab,
    previewError,
    autoPreviewEnabled,
    setDocumentContent,
    setActiveTab,
    handleSelectTemplate,
    handleGeneratePreview,
    handleDownload
  };
};
