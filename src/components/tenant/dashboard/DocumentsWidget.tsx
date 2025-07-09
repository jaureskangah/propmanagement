
import { File, FileText, ArrowUpRight, Download, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TenantDocument } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";

interface DocumentsWidgetProps {
  documents: TenantDocument[];
}

export const DocumentsWidget = ({ documents }: DocumentsWidgetProps) => {
  const { t } = useLocale();
  const navigate = useNavigate();
  
  const getDocumentIcon = (docName: string, docType?: string, category?: string) => {
    if (category === 'lease' || docType === 'lease') {
      return <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    } else if (category === 'receipt' || docType === 'receipt') {
      return <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />;
    } else if (category === 'important') {
      return <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />;
    } else {
      const lowerName = docName.toLowerCase();
      if (lowerName.endsWith('.pdf')) {
        return <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      } else if (lowerName.includes('lease') || lowerName.includes('bail')) {
        return <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      } else if (lowerName.includes('receipt') || lowerName.includes('payment') || lowerName.includes('reçu')) {
        return <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />;
      } else {
        return <FileText className="h-4 w-4 text-purple-500 dark:text-purple-400" />;
      }
    }
  };

  const handleDownloadDocument = async (doc: TenantDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!doc.file_url) return;
    
    try {
      // Utiliser fetch pour récupérer le fichier
      const response = await fetch(doc.file_url);
      if (!response.ok) throw new Error('Erreur lors du téléchargement');
      
      // Créer un blob à partir de la réponse
      const blob = await response.blob();
      
      // Créer une URL temporaire pour le blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Créer un élément de lien temporaire
      const link = window.document.createElement('a');
      link.href = blobUrl;
      link.download = doc.name || 'document';
      
      // Ajouter au document, cliquer, puis supprimer
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      // Nettoyer l'URL temporaire
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      // Fallback: ouvrir dans un nouvel onglet
      window.open(doc.file_url, '_blank');
    }
  };

  const handleViewDocument = (doc: TenantDocument) => {
    if (!doc.file_url) return;
    window.open(doc.file_url, '_blank');
  };
  
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 border border-purple-100/50 dark:from-purple-950/80 dark:via-violet-950/70 dark:to-indigo-950/60 dark:border-purple-800/30"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-200/40 to-violet-300/30 rounded-full -translate-y-12 translate-x-12 dark:from-purple-700/20 dark:to-violet-600/15" />
      
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg">
              <FileText className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{t("documents")}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {documents.length} {documents.length === 1 ? 'document' : 'documents'}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-xl bg-white/80 dark:bg-gray-800/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 shadow-sm hover:shadow-md transition-all"
            onClick={() => navigate('/tenant/documents')}
          >
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {documents.length === 0 ? (
            <div className="text-center py-8 bg-white/70 dark:bg-gray-800/50 rounded-xl border border-purple-100/50 dark:border-purple-800/30">
              <div className="inline-flex p-4 rounded-full bg-purple-100 dark:bg-purple-900/40 mb-3">
                <FolderOpen className="h-8 w-8 text-purple-500 dark:text-purple-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">{t("noDocuments")}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Aucun document disponible</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.slice(0, 3).map((doc, index) => (
                <motion.div 
                  key={doc.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group flex items-center p-4 rounded-xl bg-white/80 dark:bg-gray-800/60 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-purple-100/30 dark:border-purple-800/20 hover:border-purple-200 dark:hover:border-purple-700/40"
                  onClick={() => handleViewDocument(doc)}
                >
                  <div className="flex-shrink-0 p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/70 transition-colors">
                    {getDocumentIcon(doc.name, doc.document_type, doc.category)}
                  </div>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                      {doc.name}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(doc.created_at)}</div>
                      {doc.category && (
                        <>
                          <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                          <div className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full">
                            {doc.category}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 opacity-0 group-hover:opacity-100 transition-all"
                      onClick={(e) => handleDownloadDocument(doc, e)}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors" />
                  </div>
                </motion.div>
              ))}
              
              {documents.length > 3 && (
                <div className="text-center pt-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/30 rounded-lg px-3 py-2 inline-block">
                    {t("andMoreDocuments", { count: (documents.length - 3).toString() })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-5 pt-4 border-t border-purple-100/50 dark:border-purple-800/30">
          <Button 
            className="w-full justify-between text-sm bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all group"
            onClick={() => navigate('/tenant/documents')}
            size="sm"
          >
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              {t("viewAllDocuments")}
            </div>
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
