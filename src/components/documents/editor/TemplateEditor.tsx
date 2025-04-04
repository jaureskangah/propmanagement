
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Download, Save, Eye, Edit, X, Check } from "lucide-react";
import { Template } from "../DocumentGeneratorContent";
import { generateCustomPdf } from "../../tenant/documents/templates/customPdf";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

interface TemplateEditorProps {
  selectedTemplate: Template | null;
  onClearSelection: () => void;
}

export const TemplateEditor = ({ selectedTemplate, onClearSelection }: TemplateEditorProps) => {
  const { t } = useLocale();
  const { toast } = useToast();
  const { user } = useAuth();
  const [editedContent, setEditedContent] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [properties, setProperties] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (selectedTemplate) {
      setEditedContent(selectedTemplate.content);
      setDocumentName(selectedTemplate.name);
      setIsEditing(true);
    } else {
      setEditedContent("");
      setDocumentName("");
    }
  }, [selectedTemplate]);

  useEffect(() => {
    const fetchProperties = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('properties')
          .select('id, name')
          .eq('owner_id', user.id);
          
        if (!error && data) {
          setProperties(data);
          if (data.length > 0) {
            setSelectedProperty(data[0].id);
          }
        }
      }
    };
    
    fetchProperties();
  }, [user]);

  const handlePreview = async () => {
    if (!editedContent) {
      toast({
        title: t('error'),
        description: t('noContentToPreview'),
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const pdfBuffer = await generateCustomPdf(editedContent);
      const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      setGeneratedPdfUrl(pdfUrl);
      setIsPreviewOpen(true);
      setIsEditing(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: t('error'),
        description: t('failedToGenerateDocument'),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!documentName) {
      toast({
        title: t('error'),
        description: t('pleaseEnterDocumentName'),
        variant: "destructive",
      });
      return;
    }

    if (!selectedProperty) {
      toast({
        title: t('error'),
        description: t('pleaseSelectProperty'),
        variant: "destructive",
      });
      return;
    }
    
    // Ici on simule la sauvegarde du document
    toast({
      title: t('success'),
      description: t('documentSaved'),
    });
  };

  const handleDownload = () => {
    if (generatedPdfUrl) {
      const link = document.createElement('a');
      link.href = generatedPdfUrl;
      link.download = `${documentName || 'document'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: t('success'),
        description: t('documentDownloaded'),
      });
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    if (generatedPdfUrl) {
      URL.revokeObjectURL(generatedPdfUrl);
      setGeneratedPdfUrl(null);
    }
  };

  if (!selectedTemplate) {
    return (
      <Card className="h-full flex flex-col justify-center items-center p-8 text-center">
        <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">{t('selectTemplateToStart')}</p>
      </Card>
    );
  }

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">
            {selectedTemplate.name}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClearSelection}
            title={t('clearSelection')}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="mb-4 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="documentName">{t('documentName')}</Label>
                <Input 
                  id="documentName" 
                  value={documentName} 
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder={t('enterDocumentName')}
                />
              </div>
              <div>
                <Label htmlFor="property">{t('selectProperty')}</Label>
                <Select 
                  value={selectedProperty} 
                  onValueChange={setSelectedProperty}
                >
                  <SelectTrigger id="property">
                    <SelectValue placeholder={t('selectProperty')} />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map(property => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
            placeholder={t('enterDocumentContent')}
            disabled={!isEditing}
          />
        </CardContent>
        <CardFooter className="justify-end space-x-2">
          {isEditing ? (
            <Button
              onClick={handlePreview}
              disabled={!editedContent || isGenerating}
              className="flex items-center"
            >
              <Eye className="mr-2 h-4 w-4" />
              {isGenerating ? t('generating') : t('preview')}
            </Button>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="flex items-center"
            >
              <Edit className="mr-2 h-4 w-4" />
              {t('edit')}
            </Button>
          )}
          <Button
            disabled={!editedContent}
            className="flex items-center"
            onClick={handleSave}
          >
            <Save className="mr-2 h-4 w-4" />
            {t('save')}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isPreviewOpen} onOpenChange={handleClosePreview}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{documentName || selectedTemplate.name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-full space-y-4">
            <div className="flex-1 min-h-0">
              {generatedPdfUrl && (
                <iframe
                  src={generatedPdfUrl}
                  className="w-full h-full rounded-md border"
                  title="PDF Preview"
                />
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleClosePreview}>
                <X className="mr-2 h-4 w-4" />
                {t('close')}
              </Button>
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                {t('download')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
