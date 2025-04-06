
import { useEffect, useRef } from "react";

/**
 * Hook for processing document content including dynamic field replacements
 */
export function useDocumentProcessing(
  content: string,
  onGeneratePreview: (content: string) => void,
  tenant: any | null,
  isGenerating: boolean
) {
  // Create ref for the preview handler function so we can update it dynamically
  const previewHandlerRef = useRef<(content: string) => void>((content) => {
    onGeneratePreview(content);
  });
  
  // Process content and replace dynamic fields with actual values
  const processContent = (inputContent: string): string => {
    if (!tenant) return inputContent;
    
    let processedContent = inputContent;
    
    // Replace date
    processedContent = processedContent.replace(/{{currentDate}}/g, new Date().toLocaleDateString());
    
    // Replace tenant fields
    processedContent = processedContent.replace(/{{tenant\.name}}/g, tenant.name || '');
    processedContent = processedContent.replace(/{{tenant\.email}}/g, tenant.email || '');
    processedContent = processedContent.replace(/{{tenant\.phone}}/g, tenant.phone || '');
    processedContent = processedContent.replace(/{{tenant\.unit_number}}/g, tenant.unit_number || '');
    processedContent = processedContent.replace(/{{tenant\.lease_start}}/g, tenant.lease_start || '');
    processedContent = processedContent.replace(/{{tenant\.lease_end}}/g, tenant.lease_end || '');
    processedContent = processedContent.replace(/{{tenant\.rent_amount}}/g, tenant.rent_amount?.toString() || '');
    
    // Replace property fields
    if (tenant.properties) {
      processedContent = processedContent.replace(/{{property\.name}}/g, tenant.properties.name || '');
    }
    
    return processedContent;
  };
  
  // Setup real-time preview with debounce
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Cancel any existing timeout
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }
    
    // Only generate preview if we have content and aren't already generating
    if (content && !isGenerating) {
      // Set a delay before generating preview to avoid too many calls
      previewTimeoutRef.current = setTimeout(() => {
        console.log("Auto-generating preview after content change");
        // Use the current handler from the ref
        previewHandlerRef.current(content);
      }, 1500); // 1.5 second delay
    }
    
    // Cleanup
    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, [content, isGenerating, onGeneratePreview]);
  
  // Process dynamic fields before generating preview
  useEffect(() => {
    // Create a function that processes content before generating preview
    const processedPreviewHandler = (inputContent: string) => {
      const processedContent = processContent(inputContent);
      onGeneratePreview(processedContent);
    };
    
    // Update the ref with our new handler function
    previewHandlerRef.current = processedPreviewHandler;
    
    // No need for cleanup as we don't need to restore original handler
  }, [content, tenant, onGeneratePreview]);
  
  // Handle preview generation with debounce
  const handleGeneratePreview = () => {
    // Clear any pending automatic preview
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }
    // Use the current handler from the ref
    previewHandlerRef.current(content);
  };
  
  return { handleGeneratePreview };
}
