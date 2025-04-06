
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";
import { History } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DocumentGeneratorHeader = () => {
  const { t } = useLocale();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">{t('documentGenerator')}</h1>
      <Button 
        variant="outline"
        onClick={() => navigate('/document-history')}
        className="flex items-center gap-2"
      >
        <History className="h-4 w-4" />
        {t('documentHistory')}
      </Button>
    </div>
  );
};
