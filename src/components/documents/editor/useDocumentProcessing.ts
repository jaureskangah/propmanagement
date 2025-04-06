
import { useMemo } from 'react';
import { TenantData } from '@/components/tenant/documents/hooks/useTenantData';
import { processDynamicFields } from '@/components/tenant/documents/templates/utils/contentParser';

export function useDocumentProcessing(
  content: string,
  onGeneratePreview: (content: string) => void,
  tenant: TenantData | null,
  isGenerating: boolean
) {
  // Process content with tenant data if available
  const processedContent = useMemo(() => {
    if (!tenant || !content) return content;
    return processDynamicFields(content, tenant);
  }, [content, tenant]);
  
  // Handle preview generation
  const handleGeneratePreview = () => {
    if (!content || isGenerating) return;
    
    // Process content with dynamic fields if tenant data is available
    const contentToPreview = tenant ? processedContent : content;
    onGeneratePreview(contentToPreview);
  };
  
  return {
    processedContent,
    handleGeneratePreview
  };
}
