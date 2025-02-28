
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { AlertTriangle, Clock, MessageSquare, FileUp } from "lucide-react";

interface NewCommunicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newCommData: {
    type: string;
    subject: string;
    content: string;
    category: string;
  };
  onDataChange: (data: any) => void;
  onSubmit: () => void;
}

export const NewCommunicationDialog = ({
  isOpen,
  onClose,
  newCommData,
  onDataChange,
  onSubmit,
}: NewCommunicationDialogProps) => {
  const { toast } = useToast();
  const { t } = useLocale();

  const handleCategoryChange = (value: string) => {
    onDataChange({ ...newCommData, category: value });
  };

  const getCategoryIcon = (category: string) => {    
    switch (category) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />;
      case 'maintenance':
        return <Clock className="h-4 w-4 text-yellow-500 mr-2" />;
      case 'payment':
        return <FileUp className="h-4 w-4 text-green-500 mr-2" />;
      default:
        return <MessageSquare className="h-4 w-4 text-blue-500 mr-2" />;
    }
  };

  const handleSubmit = () => {
    if (!newCommData.subject.trim()) {
      toast({
        title: t('error'),
        description: t('subjectRequired'),
        variant: "destructive",
      });
      return;
    }

    if (!newCommData.content.trim()) {
      toast({
        title: t('error'),
        description: t('contentRequired'),
        variant: "destructive",
      });
      return;
    }

    onSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('newMessage')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t('messageCategory')}</Label>
            <Select 
              value={newCommData.category} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="flex items-center gap-2">
                <SelectValue placeholder={t('selectCategory')}>
                  <div className="flex items-center">
                    {getCategoryIcon(newCommData.category)}
                    <span>{newCommData.category}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general" className="flex items-center gap-2">
                  <div className="flex items-center">
                    {getCategoryIcon('general')}
                    <span>{t('general')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="maintenance" className="flex items-center gap-2">
                  <div className="flex items-center">
                    {getCategoryIcon('maintenance')}
                    <span>{t('maintenance')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="payment" className="flex items-center gap-2">
                  <div className="flex items-center">
                    {getCategoryIcon('payment')}
                    <span>Payment</span>
                  </div>
                </SelectItem>
                <SelectItem value="urgent" className="flex items-center gap-2">
                  <div className="flex items-center">
                    {getCategoryIcon('urgent')}
                    <span>{t('urgent')}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('subject')}<span className="text-red-500">*</span></Label>
            <Input
              value={newCommData.subject}
              onChange={(e) => onDataChange({ ...newCommData, subject: e.target.value })}
              placeholder={t('enterSubject')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{t('content')}<span className="text-red-500">*</span></Label>
            <Textarea
              value={newCommData.content}
              onChange={(e) => onDataChange({ ...newCommData, content: e.target.value })}
              placeholder={t('enterMessage')}
              rows={4}
              required
              className="resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit}>
            {t('send')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
