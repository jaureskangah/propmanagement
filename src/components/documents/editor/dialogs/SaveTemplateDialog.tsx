
import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useTemplates } from "@/hooks/useTemplates";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BaseDialog } from "./BaseDialog";

interface SaveTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  templateName?: string;
}

export function SaveTemplateDialog({
  isOpen,
  onClose,
  content,
  templateName = ""
}: SaveTemplateDialogProps) {
  const { t } = useLocale();
  const { saveTemplate, isLoading } = useTemplates();
  const [name, setName] = useState(templateName);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("custom");
  
  const handleSave = async () => {
    if (!name || !content) return;
    
    const result = await saveTemplate({
      name,
      content,
      description,
      category,
    });
    
    if (result) {
      onClose();
    }
  };
  
  const categories = [
    { id: "lease", name: t('documentGenerator.leaseDocuments') },
    { id: "payment", name: t('documentGenerator.paymentDocuments') },
    { id: "notice", name: t('documentGenerator.noticeDocuments') },
    { id: "inspection", name: t('documentGenerator.inspectionDocuments') },
    { id: "custom", name: t('documentGenerator.miscDocuments') },
  ];
  
  const dialogFooter = (
    <Button 
      onClick={handleSave} 
      disabled={isLoading || !name}
      className="gap-2"
    >
      {isLoading ? t('documentGenerator.saving') : t('documentGenerator.saveTemplate')}
    </Button>
  );

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={onClose}
      title={t('documentGenerator.saveAsTemplate')}
      description={t('documentGenerator.saveAsTemplateDescription')}
      footer={dialogFooter}
      size="lg"
    >
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">{t('documentGenerator.templateName')}</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('documentGenerator.templateNamePlaceholder')}
            autoFocus
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="category">{t('documentGenerator.category')}</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder={t('documentGenerator.selectCategory')} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">{t('documentGenerator.templateDescription')}</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('documentGenerator.templateDescriptionPlaceholder')}
            rows={3}
          />
        </div>
      </div>
    </BaseDialog>
  );
}
