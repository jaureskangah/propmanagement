
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface AdminHeaderProps {
  onDownload: () => void;
  onShare: () => void;
}

export function AdminHeader({ onDownload, onShare }: AdminHeaderProps) {
  const { t } = useLocale();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 mobile-admin-header">
      <h1 className="text-2xl sm:text-3xl font-bold">{t('adminDashboard')}</h1>
      <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto mobile-admin-actions mobile-touch-target">
        <Button className="flex-1 sm:flex-none mobile-touch-target" variant="outline" onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          <span className="whitespace-nowrap">{t('downloadData')}</span>
        </Button>
        <Button className="flex-1 sm:flex-none mobile-touch-target" variant="outline" onClick={onShare}>
          <Share2 className="h-4 w-4 mr-2" />
          <span className="whitespace-nowrap">{t('shareData')}</span>
        </Button>
      </div>
    </div>
  );
}
