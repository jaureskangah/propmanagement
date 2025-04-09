
import { Loader2, Save, Download, Share2, FileSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";

interface ActionButtonsProps {
  onSave?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onSign?: () => void;
  isSaving?: boolean;
  isDownloading?: boolean;
  documentType?: string;
}

export function ActionButtons({ 
  onSave, 
  onDownload, 
  onShare, 
  onSign,
  isSaving = false, 
  isDownloading = false,
  documentType
}: ActionButtonsProps) {
  const { t } = useLocale();
  
  // Vérifier si c'est un document qui nécessite une signature
  const isSignableDocument = documentType === 'leaseAgreement' || 
                             documentType === 'leaseRenewal' || 
                             documentType === 'leaseTermination';
  
  return (
    <div className="flex flex-wrap justify-end gap-3">
      {onSave && (
        <Button
          variant="outline"
          onClick={onSave}
          disabled={isSaving}
          className="bg-blue-100 border-blue-300 hover:bg-blue-200 hover:text-blue-800 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-800"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('saving') || "Enregistrement..."}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
              {t('saveDocument') || "Enregistrer"}
            </>
          )}
        </Button>
      )}
      
      {onShare && (
        <Button 
          variant="outline"
          onClick={onShare}
          className="bg-purple-100 border-purple-300 hover:bg-purple-200 hover:text-purple-800 text-purple-700 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-800"
        >
          <Share2 className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
          {t('shareDocument') || "Partager le document"}
        </Button>
      )}
      
      {onSign && isSignableDocument && (
        <Button 
          variant="outline"
          onClick={onSign}
          className="bg-amber-100 border-amber-300 hover:bg-amber-200 hover:text-amber-800 text-amber-700 dark:bg-amber-900 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-800"
        >
          <FileSignature className="mr-2 h-4 w-4 text-amber-600 dark:text-amber-400" />
          {t('signDocument') || "Signer"}
        </Button>
      )}
      
      {onDownload && (
        <Button 
          onClick={onDownload} 
          disabled={isDownloading}
          className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800"
        >
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('downloading') || "Téléchargement..."}
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              {t('downloadDocument') || "Télécharger"}
            </>
          )}
        </Button>
      )}
    </div>
  );
}
