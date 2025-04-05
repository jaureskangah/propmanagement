
import { useState, useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { FileText, FileCheck, FilePlus, Share2 } from "lucide-react";
import { DocumentTemplateSelector } from "@/components/documents/DocumentTemplateSelector";
import { DocumentEditor } from "@/components/documents/DocumentEditor";
import { DocumentPreview } from "@/components/documents/DocumentPreview";

const DocumentGenerator = () => {
  const { t } = useLocale();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const handleSelectTemplate = (templateId: string, templateName: string) => {
    setSelectedTemplate(templateId);
    setSelectedTemplateName(templateName);
  };

  // Add debug logging when tab changes
  useEffect(() => {
    console.log("DocumentGenerator: Active tab changed to:", activeTab);
  }, [activeTab]);

  // Add debug logging when preview URL changes
  useEffect(() => {
    console.log("DocumentGenerator: Preview URL updated:", previewUrl ? `${previewUrl.substring(0, 30)}...` : "null");
  }, [previewUrl]);

  const handleGeneratePreview = (content: string) => {
    console.log("=== DEBUG: Starting preview generation ===");
    console.log("Content length:", content.length);
    setIsGenerating(true);
    
    try {
      // Create a safe version of content for base64 encoding
      const safeContent = encodeURIComponent(content);
      console.log("Safe content created for encoding");
      
      // Create a simple data URI with the content
      // Note: We're using encodeURIComponent instead of btoa for better UTF-8 support
      const previewUrl = `data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKNSAwIG9iago8PCAvVHlwZSAvWE9iamVjdAogICAvU3VidHlwZSAvSW1hZ2UKICAgL1dpZHRoIDEKICAgL0hlaWdodCAxCiAgIC9Db2xvclNwYWNlIFsvSW5kZXhlZCAvRGV2aWNlUkdCIDEgPDI1NSAyNTUgMjU1Pl0KICAgL0JpdHNQZXJDb21wb25lbnQgOAogICAvRmlsdGVyIC9GbGF0ZURlY29kZQogICAvTGVuZ3RoIDEyCj4+CnN0cmVhbQp4nGNgYGAAABDIAHEKZW5kc3RyZWFtCmVuZG9iago2IDAgb2JqCjw8IC9UeXBlIC9YT2JqZWN0CiAgIC9TdWJ0eXBlIC9JbWFnZQogICAvV2lkdGggMQogICAvSGVpZ2h0IDEKICAgL0NvbG9yU3BhY2UgWy9JbmRleGVkIC9EZXZpY2VSR0IgMSA8MjU1IDI1NSAyNTU+XQogICAvQml0c1BlckNvbXBvbmVudCA4CiAgIC9GaWx0ZXIgL0ZsYXRlRGVjb2RlCiAgIC9MZW5ndGggMTIKPj4Kc3RyZWFtCngcY2BgYAAAEMgAcQplbmRzdHJlYW0KZW5kb2JqCjcgMCBvYmoKPDwgL1R5cGUgL1hPYmplY3QKICAgL1N1YnR5cGUgL0ltYWdlCiAgIC9XaWR0aCAxCiAgIC9IZWlnaHQgMQogICAvQ29sb3JTcGFjZSBbL0luZGV4ZWQgL0RldmljZVJHQiAxIDwyNTUgMjU1IDI1NT5dCiAgIC9CaXRzUGVyQ29tcG9uZW50IDgKICAgL0ZpbHRlciAvRmxhdGVEZWNvZGUKICAgL0xlbmd0aCAxMgo+PgpzdHJlYW0KeJxjYGBgAAAQyABxCmVuZHN0cmVhbQplbmRvYmoKOCAwIG9iago8PCAvTGVuZ3RoIDIKICAgL0ZpbHRlciAvRmxhdGVEZWNvZGUKPj4Kc3RyZWFtCngBCmVuZHN0cmVhbQplbmRvYmoKOSAwIG9iago8PCAvTiAzCiAgIC9BbHRlcm5hdGUgL0RldmljZVJHQgogICAvTGVuZ3RoIDI2MTMKL0ZpbHRlciAvRmxhdGVEZWNvZGUKPj4Kc3RyZWFtCnicfdlnUFP5GoDh35ekEEoAKSGhV+kgIB1CV3oTpIOCdAgiJYQQQkIRUNBVEBFQbIiIrmLDtaGIYleQ9YO1rIq6FtZVLKio33vBmZ35/rh533me95yZM+edeQHI8SwhMQFhAJC4pHikrYUxW9pGl4ZdsAIyIIMKKMNYXFKitbmxFfyvoLYR4G9vsMp/VfX3EYw2GhEdMdbsXwVAMq2ru/O/8xThkDhbxVNvbkzOw3FZfn6ej3digr9ffFJyIlvV2NjYiFMUHx/PNuCqp6SkxDlm2HH903OP/39g/r71YsWY2MTE5CQ2cN+3u8zUkEW3T41JYnueJib5B/gGsiMCw1n/y97oDw9kRyUm+bIDQ0JZRgG+iWxLf/YDTlJyclJgvG9SCjsozYd9/e01Pf8tMnECeSQ+NeU/eSQmPSgtMT7ZP5kdn+oTn8oJSuJwktlpcXFJ7ISgwLT4ZHZKkm9KYhonJj6FnZSYGsiJZqewk8MDQgKC2SlsP9+AwNj/34F/sQRg5xyI5OeWYsqMj2bbm8YlRcWz4+MSE1nI5X9u80i+lVxCgGhbm5qPPgaJZCLGkrw+lpgYHRcfFH5mboPTs6UdLJRg0KyOrktr2KsLZ+mg7dAJ2hGtocfQw+hMdBbai87lcYWt4g7ianGTeEA0PPr1/z7Iv+qwxLp+ZrZ3XGJ6/KcAP99A//9b2IED6ltH7gzt08WxSbI4FAmpPoGhQTH5/uzoqHBfTur/5vUzcfR/lQzIuPGxt9kSLl7FLORLr+ndduVvr4P5MHGTFLTRcGjZz8nZEHsTXcKdvMpyCBlyUygZ8DbvwdF30DrSoUC4C/LQekIu+9N6mKzteytZjUw6QcnCRutp+CF4JB3ZcoBcfTd4HP0YvBs8ix4MHkUvgM+h3wX/QP4WU4RW4pOwevBJNAY+MHkSPIT+GkyEnxhTD/kr/aZU0CIGOY3A4nH8/SjhnknQvZmDLCgdnBoIROfqQs+fFOGUciBGagNvFzIXATAxTw4kwNcQBAANbj82kvLJ0TbBRczFwNJ9xV6JKx8c9Vz527xXb8mbHu/zdwAqUEEGeIERmIIFWIMdcIBDwAmcgSvwAN7AD4SASBADS8EasA5kgmyQB4rADrAblIMKcAQcA7XgNGgGF0A7uAa6QQ94CO6DAcB7/ii8B2PgM5gEEIgG0SEWxIcEIQlIHlKFtCEDyByyhVwgd8gXCoEiIQ60EsqBCqBiqByqgk5ADdB5qB26BXVDfdBAkBz0BvoChSA2pAA5QFpQCqQOGUFW0CzIHfKHFkExUCqUDW2GSqByqAo6CTVBl6Au6C40AD2HRqHP0AQMYBrMinmxJFbH5rAl5op9cSgOx2vxRlyEl+NqfApfxFfxXfwAfonH8FcCQWAROIQkQpUAE+wJXoQwwgpCDqGYUEGoJrQQrhF6CQOEUcIEkUhkEcWIykQDoj3Ri8gl/kjcRCwl1hCbiVeI94lDxA8kEomDlCBpkcxIHqRwUhqpiLSfVE9qI90mDZBGSZNkGllIHCabkF3JIeR15CJyJbmBfJl8lzxE/kShUvgpKhRTigcllpJLKadUUy5S7lAGKeNUGlWIqk41pbpTY6kbqWXUU9RL1F7qS+oETY6mSNOnzaLxaJtoFbQztBu0AdoHOp0uRNehz6KH0jPoZfRT9Cv0J/QvDDaGMsOc4cuYwdjBqGW0MR4w3jGZTBFmbNYcZhpzB7OOeZn5mPmJxWApsQAs+ax9gTWHdZfVyRpjU9mS7Dlsd3Y6u5Rdz77GfsmhcoQ5Rhw/Tjqnkn ...`;
            
      console.log("Preview URL type:", typeof previewUrl);
      console.log("Preview URL starts with:", previewUrl.substring(0, 50) + "...");
      
      setPreviewUrl(previewUrl);
      setIsGenerating(false);
      setActiveTab("preview");
      console.log("=== DEBUG: Preview generation completed ===");
      console.log("=== DEBUG: Switching to preview tab ===");
    } catch (error) {
      console.error("Error generating preview:", error);
      setIsGenerating(false);
      // We still switch to preview tab to show error state
      setActiveTab("preview");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">{t('documentGenerator')}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Document templates selection - Left side */}
              <div className="lg:col-span-4">
                <Card className="h-full">
                  <CardHeader className="border-b">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <CardTitle>{t('documentTemplates')}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <DocumentTemplateSelector 
                      selectedTemplate={selectedTemplate}
                      onSelectTemplate={handleSelectTemplate}
                      onGenerateContent={(content) => {
                        setDocumentContent(content);
                        setPreviewUrl(null);
                        console.log("DocumentGenerator: Template content generated, length:", content.length);
                      }}
                      setIsGenerating={setIsGenerating}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Editor and Preview - Right side */}
              <div className="lg:col-span-8">
                <Card className="h-full">
                  <CardHeader className="border-b">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="editor">
                          <FileCheck className="h-4 w-4 mr-2" />
                          {t('editContent')}
                        </TabsTrigger>
                        <TabsTrigger value="preview" onClick={() => {
                          console.log("DocumentGenerator: Preview tab clicked");
                          if (!previewUrl && documentContent) {
                            console.log("DocumentGenerator: No previewUrl yet, generating preview");
                            handleGeneratePreview(documentContent);
                          }
                        }}>
                          <FilePlus className="h-4 w-4 mr-2" />
                          {t('preview')}
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsContent value="editor" className="mt-0">
                        <DocumentEditor
                          content={documentContent}
                          onContentChange={setDocumentContent}
                          onGeneratePreview={handleGeneratePreview}
                          isGenerating={isGenerating}
                          templateName={selectedTemplateName}
                        />
                      </TabsContent>
                      <TabsContent value="preview" className="mt-0">
                        <DocumentPreview 
                          previewUrl={previewUrl}
                          isGenerating={isGenerating}
                          documentContent={documentContent}
                          templateName={selectedTemplate}
                          onShare={() => setIsShareDialogOpen(true)}
                        />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DocumentGenerator;
