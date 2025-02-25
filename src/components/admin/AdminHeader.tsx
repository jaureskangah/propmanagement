
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface AdminHeaderProps {
  onDownload: () => void;
  onShare: () => void;
}

export function AdminHeader({ onDownload, onShare }: AdminHeaderProps) {
  const { t } = useLocale();

  console.log('AdminHeader translations:', {
    adminDashboard: t('adminDashboard'),
    downloadData: t('downloadData'),
    shareData: t('shareData')
  });

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold">{t('adminDashboard')}</h1>
      <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
        <Button className="flex-1 sm:flex-none" variant="outline" onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          <span className="whitespace-nowrap">{t('downloadData')}</span>
        </Button>
        <Button className="flex-1 sm:flex-none" variant="outline" onClick={onShare}>
          <Share2 className="h-4 w-4 mr-2" />
          <span className="whitespace-nowrap">{t('shareData')}</span>
        </Button>
      </div>
    </div>
  );
}
