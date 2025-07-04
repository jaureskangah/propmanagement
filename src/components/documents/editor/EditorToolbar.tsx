
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Sparkles, Share2, FileCheck, Loader2, Save, PenSquare, Download } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface EditorToolbarProps {
  onOpenAIDialog: () => void;
  onOpenShareDialog: () => void;
  onOpenSaveTemplateDialog: () => void;
  onToggleAdvancedEditing: () => void;
  onGeneratePreview: () => void;
  onDownload?: () => void;
  isGenerating: boolean;
  isDownloading?: boolean;
  hasContent: boolean;
  hasPreview?: boolean;
  isAdvancedEditingEnabled: boolean;
}

export function EditorToolbar({
  onOpenAIDialog,
  onOpenShareDialog,
  onOpenSaveTemplateDialog,
  onToggleAdvancedEditing,
  onGeneratePreview,
  onDownload,
  isGenerating,
  isDownloading = false,
  hasContent,
  hasPreview = false,
  isAdvancedEditingEnabled
}: EditorToolbarProps) {
  const { t } = useLocale();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
      {/* Groupes de boutons pour desktop / Stack pour mobile */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        
        {/* Groupe Édition */}
        <motion.div 
          className="flex gap-2 p-2 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100/50 shadow-sm"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="outline"
            onClick={onOpenAIDialog}
            className="gap-2 bg-white/80 border-purple-200 hover:bg-purple-100 hover:text-purple-800 text-purple-700 transition-all duration-200 hover:scale-105 hover:shadow-md"
            size={isMobile ? "sm" : "default"}
          >
            <Sparkles className="h-4 w-4 text-purple-600" />
            {!isMobile && (t('documentGenerator.aiAssistant') || "Assistant IA")}
          </Button>
          
          <Button
            variant={isAdvancedEditingEnabled ? "default" : "outline"}
            onClick={onToggleAdvancedEditing}
            className={`gap-2 transition-all duration-200 hover:scale-105 hover:shadow-md ${
              isAdvancedEditingEnabled 
                ? "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg" 
                : "bg-white/80 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-800 text-indigo-700"
            }`}
            size={isMobile ? "sm" : "default"}
          >
            <PenSquare className={`h-4 w-4 ${isAdvancedEditingEnabled ? "text-white" : "text-indigo-600"}`} />
            {!isMobile && (t('documentGenerator.advancedEditing') || "Édition avancée")}
          </Button>
        </motion.div>

        {/* Groupe Actions */}
        <motion.div 
          className="flex gap-2 p-2 rounded-xl bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100/50 shadow-sm"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Button
            variant="outline"
            onClick={onOpenShareDialog}
            className="gap-2 bg-white/80 border-blue-200 hover:bg-blue-100 hover:text-blue-800 text-blue-700 transition-all duration-200 hover:scale-105 hover:shadow-md"
            size={isMobile ? "sm" : "default"}
          >
            <Share2 className="h-4 w-4 text-blue-600" />
            {!isMobile && (t('documentGenerator.shareDocument') || "Partager")}
          </Button>
          
          <Button
            variant="outline"
            onClick={onOpenSaveTemplateDialog}
            className="gap-2 bg-white/80 border-amber-200 hover:bg-amber-100 hover:text-amber-800 text-amber-700 transition-all duration-200 hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:hover:scale-100"
            disabled={!hasContent}
            size={isMobile ? "sm" : "default"}
          >
            <Save className="h-4 w-4 text-amber-600" />
            {!isMobile && (t('documentGenerator.saveAsTemplate') || "Enregistrer")}
          </Button>

          {onDownload && hasPreview && (
            <Button
              variant="outline"
              onClick={onDownload}
              disabled={isDownloading || !hasPreview}
              className="gap-2 bg-white/80 border-green-200 hover:bg-green-100 hover:text-green-800 text-green-700 transition-all duration-200 hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:hover:scale-100"
              size={isMobile ? "sm" : "default"}
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin text-green-600" />
              ) : (
                <Download className="h-4 w-4 text-green-600" />
              )}
              {!isMobile && (t('downloadDocument') || "Télécharger")}
            </Button>
          )}
        </motion.div>
      </div>
      
      {/* Bouton Principal - Générer l'aperçu */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Button
          onClick={onGeneratePreview}
          disabled={!hasContent || isGenerating}
          className="gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 w-full sm:w-auto px-6"
          size={isMobile ? "sm" : "lg"}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('documentGenerator.generating') || "Génération..."}
            </>
          ) : (
            <>
              <FileCheck className="h-4 w-4" />
              {t('documentGenerator.generatePreview') || "Générer l'aperçu"}
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
