
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Sparkles, Save, PenSquare, Download, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface EditorToolbarProps {
  onOpenAIDialog: () => void;
  onOpenSaveTemplateDialog: () => void;
  onToggleAdvancedEditing: () => void;
  onDownload?: () => void;
  isDownloading?: boolean;
  hasContent: boolean;
  hasPreview?: boolean;
  isAdvancedEditingEnabled: boolean;
}

export function EditorToolbar({
  onOpenAIDialog,
  onOpenSaveTemplateDialog,
  onToggleAdvancedEditing,
  onDownload,
  isDownloading = false,
  hasContent,
  hasPreview = false,
  isAdvancedEditingEnabled
}: EditorToolbarProps) {
  const { t } = useLocale();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
      {/* Groupe principal des 3 boutons - Centré */}
      <div className="flex justify-center flex-1">
        <motion.div 
          className="flex flex-col gap-3 sm:flex-row sm:gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Assistant IA */}
          <Button
            variant="outline"
            onClick={onOpenAIDialog}
            className="gap-2 bg-white/80 border-purple-200 hover:bg-purple-100 hover:text-purple-800 text-purple-700 transition-all duration-200 hover:scale-105 hover:shadow-md min-w-[140px] sm:min-w-[160px]"
            size={isMobile ? "sm" : "default"}
          >
            <Sparkles className="h-4 w-4 text-purple-600 flex-shrink-0" />
            <span className="truncate">
              {isMobile ? "Assistant IA" : (t('documentGenerator.aiAssistant') || "Assistant IA")}
            </span>
          </Button>
          
          {/* Édition avancée */}
          <Button
            variant={isAdvancedEditingEnabled ? "default" : "outline"}
            onClick={onToggleAdvancedEditing}
            className={`gap-2 transition-all duration-200 hover:scale-105 hover:shadow-md min-w-[140px] sm:min-w-[160px] ${
              isAdvancedEditingEnabled 
                ? "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg" 
                : "bg-white/80 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-800 text-indigo-700"
            }`}
            size={isMobile ? "sm" : "default"}
          >
            <PenSquare className={`h-4 w-4 flex-shrink-0 ${isAdvancedEditingEnabled ? "text-white" : "text-indigo-600"}`} />
            <span className="truncate">
              {isMobile ? "Édition" : (t('documentGenerator.advancedEditing') || "Édition avancée")}
            </span>
          </Button>

          {/* Enregistrer comme Modèle */}
          <Button
            variant="outline"
            onClick={onOpenSaveTemplateDialog}
            className="gap-2 bg-white/80 border-amber-200 hover:bg-amber-100 hover:text-amber-800 text-amber-700 transition-all duration-200 hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:hover:scale-100 min-w-[140px] sm:min-w-[180px]"
            disabled={!hasContent}
            size={isMobile ? "sm" : "default"}
          >
            <Save className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <span className="truncate">
              {isMobile ? "Modèle" : (t('documentGenerator.saveAsTemplate') || "Enregistrer modèle")}
            </span>
          </Button>
        </motion.div>
      </div>

      {/* Bouton Télécharger (si aperçu disponible) */}
      {onDownload && hasPreview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Button
            variant="outline"
            onClick={onDownload}
            disabled={isDownloading || !hasPreview}
            className="gap-2 bg-white/80 border-green-200 hover:bg-green-100 hover:text-green-800 text-green-700 transition-all duration-200 hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:hover:scale-100 min-w-[120px]"
            size={isMobile ? "sm" : "default"}
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin text-green-600" />
            ) : (
              <Download className="h-4 w-4 text-green-600" />
            )}
            {!isMobile && (t('downloadDocument') || "Télécharger")}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
