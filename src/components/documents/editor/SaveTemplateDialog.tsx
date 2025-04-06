
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
    { id: "lease", name: t('leaseDocuments') || "Documents de bail" },
    { id: "payment", name: t('paymentDocuments') || "Documents de paiement" },
    { id: "notice", name: t('noticeDocuments') || "Avis" },
    { id: "inspection", name: t('inspectionDocuments') || "Documents d'inspection" },
    { id: "custom", name: t('miscDocuments') || "Documents divers" },
  ];
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('saveAsTemplate') || "Enregistrer comme modèle"}</DialogTitle>
          <DialogDescription>{t('saveAsTemplateDescription') || "Enregistrez ce document comme modèle pour une utilisation future"}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t('templateName') || "Nom du modèle"}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('templateNamePlaceholder') || "Entrez un nom pour votre modèle"}
              autoFocus
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">{t('category') || "Catégorie"}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectCategory') || "Sélectionner une catégorie"} />
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
            <Label htmlFor="description">{t('description') || "Description"}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('templateDescriptionPlaceholder') || "Décrivez brièvement votre modèle"}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('cancel') || "Annuler"}
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading || !name}
            className="gap-2"
          >
            {isLoading ? (t('saving') || "Enregistrement...") : (t('saveTemplate') || "Enregistrer le modèle")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
