
import { useState, useEffect } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DocumentTemplate, useTemplates } from "@/hooks/useTemplates";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Trash2, Edit, FileWarning } from "lucide-react";
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
  const { t, currentLocale } = useLocale();
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
    return currentLocale === 'fr' ? fr : enUS;
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
    { id: "all", name: t('allTemplates'), icon: FileText },
    { id: "lease", name: t('leaseDocuments'), icon: FileText },
    { id: "payment", name: t('paymentDocuments'), icon: FileText },
    { id: "notice", name: t('noticeDocuments'), icon: FileText },
    { id: "inspection", name: t('inspectionDocuments'), icon: FileText },
    { id: "custom", name: t('miscDocuments'), icon: FileText },
  ];
  
  return (
    <div className="space-y-4">
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">{t('allTemplates')}</TabsTrigger>
          <TabsTrigger value="custom">{t('customTemplates')}</TabsTrigger>
          <TabsTrigger value="lease">{t('leaseDocuments')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value={selectedCategory}>
          <ScrollArea className="h-[400px] pr-4">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-3 border rounded-md">
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
              <div className="text-center py-8">
                <FileWarning className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">{t('noTemplatesFound')}</p>
                <p className="text-sm text-muted-foreground mt-1">{t('createTemplateHint')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3" onClick={() => onSelectTemplate(template)}>
                      <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{template.name}</p>
                        <p className="text-xs text-muted-foreground">
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
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteTemplate')}</AlertDialogTitle>
            <AlertDialogDescription>{t('deleteTemplateConfirmation')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTemplate} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
