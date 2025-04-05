
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useTemplates } from "@/hooks/useTemplates";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    { id: "lease", name: t('leaseDocuments') },
    { id: "payment", name: t('paymentDocuments') },
    { id: "notice", name: t('noticeDocuments') },
    { id: "inspection", name: t('inspectionDocuments') },
    { id: "custom", name: t('miscDocuments') },
  ];
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('saveAsTemplate')}</DialogTitle>
          <DialogDescription>{t('saveAsTemplateDescription')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t('templateName')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('templateNamePlaceholder')}
              autoFocus
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">{t('category')}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectCategory')} />
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
            <Label htmlFor="description">{t('description')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('templateDescriptionPlaceholder')}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading || !name}
            className="gap-2"
          >
            {isLoading ? t('saving') : t('saveTemplate')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
