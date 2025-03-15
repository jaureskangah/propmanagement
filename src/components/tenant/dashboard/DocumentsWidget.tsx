
import { File, FileText, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TenantDocument } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface DocumentsWidgetProps {
  documents: TenantDocument[];
}

export const DocumentsWidget = ({ documents }: DocumentsWidgetProps) => {
  const { t } = useLocale();
  const navigate = useNavigate();
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 dark:from-purple-900/20 dark:to-violet-900/20 dark:border-purple-800/30 p-5"
    >
      <div className="flex items-center mb-4">
        <FileText className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
        <h3 className="font-semibold text-purple-700 dark:text-purple-300">{t('documents')}</h3>
      </div>
      
      <div className="space-y-4">
        {documents.length === 0 ? (
          <div className="text-center py-6 bg-white/60 dark:bg-gray-800/60 rounded-lg">
            <File className="h-10 w-10 text-purple-300 dark:text-purple-500/50 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('noDocuments')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.slice(0, 3).map((doc, index) => (
              <motion.div 
                key={doc.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center p-3 rounded-lg bg-white/70 dark:bg-gray-800/60 shadow-sm hover:shadow hover:bg-white/90 dark:hover:bg-gray-800/80 transition-all cursor-pointer"
                onClick={() => window.open(doc.file_url, '_blank')}
              >
                <FileText className="h-4 w-4 mr-3 text-purple-500 dark:text-purple-400" />
                <span className="text-sm flex-1 truncate text-gray-800 dark:text-gray-200">{doc.name}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-purple-700 dark:text-purple-400">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
            
            {documents.length > 3 && (
              <div className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
                {t('andMoreDocuments', { count: (documents.length - 3).toString() })}
              </div>
            )}
          </div>
        )}
        
        <Button 
          className="w-full mt-2 text-xs bg-purple-600 hover:bg-purple-700 text-white py-1 px-2 dark:bg-purple-700 dark:hover:bg-purple-800"
          onClick={() => navigate('/tenant/documents')}
          size="sm"
        >
          {t('viewAllDocuments')}
          <ArrowUpRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
};
