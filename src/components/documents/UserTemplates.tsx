
import { useState, useEffect } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DocumentTemplate, useTemplates } from "@/hooks/useTemplates";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Trash2, FileWarning } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";

interface UserTemplatesProps {
  onSelectTemplate: (template: DocumentTemplate) => void;
}

export function UserTemplates({ onSelectTemplate }: UserTemplatesProps) {
  const { t, locale } = useLocale();
  const { fetchTemplates, deleteTemplate, isLoading } = useTemplates();
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    loadTemplates();
  }, []);
  
  const loadTemplates = async () => {
    const data = await fetchTemplates();
    setTemplates(data);
  };
  
  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;
    
    const success = await deleteTemplate(templateToDelete);
    if (success) {
      setTemplates(templates.filter(t => t.id !== templateToDelete));
      setTemplateToDelete(null);
    }
  };
  
  const filteredTemplates = selectedCategory === "all" 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);
    
  const getLocale = () => {
    return locale === 'fr' ? fr : enUS;
  };
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: getLocale()
      });
    } catch (e) {
      return dateString;
    }
  };
  
  const categories = [
    { id: "all", name: t('documentGenerator.allTemplates') },
    { id: "lease", name: t('documentGenerator.leaseDocuments') },
    { id: "payment", name: t('documentGenerator.paymentDocuments') },
    { id: "notice", name: t('documentGenerator.noticeDocuments') },
    { id: "inspection", name: t('documentGenerator.inspectionDocuments') },
    { id: "custom", name: t('documentGenerator.miscDocuments') },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">{t('documentGenerator.mySavedTemplates')}</h2>
        <p className="text-muted-foreground">{t('documentGenerator.saveAsTemplateDescription')}</p>
      </div>
      
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="all" className="text-sm py-2">{t('documentGenerator.allTemplates')}</TabsTrigger>
          <TabsTrigger value="custom" className="text-sm py-2">{t('documentGenerator.customTemplates')}</TabsTrigger>
          <TabsTrigger value="lease" className="text-sm py-2">{t('documentGenerator.leaseDocuments')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value={selectedCategory} className="mt-0">
          <ScrollArea className="h-[400px] pr-4">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg bg-background">
                    <div className="w-10 h-10">
                      <Skeleton className="h-10 w-10 rounded-md" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <FileWarning className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-70" />
                <h3 className="text-lg font-medium mb-1">{t('documentGenerator.noTemplatesFound')}</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">{t('documentGenerator.createTemplateHint')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/40 transition-colors"
                  >
                    <div 
                      className="flex items-center space-x-4 flex-1 cursor-pointer" 
                      onClick={() => onSelectTemplate(template)}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-base">{template.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(template.created_at)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTemplateToDelete(template.id);
                      }}
                      className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                      title={t('documentGenerator.deleteTemplate')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={!!templateToDelete} onOpenChange={(open) => !open && setTemplateToDelete(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('documentGenerator.deleteTemplate')}</AlertDialogTitle>
            <AlertDialogDescription>{t('documentGenerator.deleteTemplateConfirmation')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="font-medium">{t('documentGenerator.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTemplate} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('documentGenerator.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
