
import { MessageSquare, ArrowUpRight, PlusCircle, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Communication } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

interface CommunicationsWidgetProps {
  communications: Communication[];
}

export const CommunicationsWidget = ({ communications }: CommunicationsWidgetProps) => {
  const { t } = useLocale();
  const navigate = useNavigate();
  
  const unreadCount = communications.filter(comm => comm.status === 'unread').length;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      whileHover={{ y: -5 }}
      className="rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-blue-700 dark:text-blue-300">Communications</h3>
          {unreadCount > 0 && (
            <Badge variant="default" className="ml-2 bg-blue-500 hover:bg-blue-600">
              {unreadCount}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
          >
            <Badge variant="outline" className="border-blue-200 bg-blue-100/50 text-blue-800 dark:border-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              {unreadCount} {unreadCount === 1 ? 'nouveau message' : 'nouveaux messages'}
            </Badge>
          </motion.div>
        )}
      </div>
      
      <div className="space-y-4">
        {communications.length === 0 ? (
          <div className="text-center py-6 bg-white/60 dark:bg-gray-800/20 rounded-lg">
            <MessageSquare className="h-10 w-10 text-blue-300 dark:text-blue-700 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('noCommunications')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {communications.slice(0, 3).map((comm, index) => (
              <motion.div 
                key={comm.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`
                  flex items-center justify-between p-3 rounded-lg shadow-sm hover:shadow transition-shadow cursor-pointer
                  ${comm.status === 'unread' 
                    ? 'bg-blue-100/40 dark:bg-blue-900/40 border-l-4 border-blue-500' 
                    : 'bg-white/70 dark:bg-gray-800/50'}
                `}
                onClick={() => navigate('/tenant/communications')}
              >
                <div className="flex flex-col flex-1 min-w-0 pr-2">
                  <div className="flex items-center">
                    <span className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">{comm.subject}</span>
                    {comm.status === 'unread' && (
                      <Badge variant="default" className="ml-2 h-2 w-2 p-0 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <div className="flex text-xs text-gray-500 dark:text-gray-400 items-center">
                    {!comm.is_from_tenant && <User className="h-3 w-3 mr-1" />}
                    {comm.is_from_tenant && <span className="text-xs text-blue-600 dark:text-blue-400 mr-1">{t('sentByYou')}</span>}
                    <Clock className="h-3 w-3 ml-1 mr-1" />
                    <span className="truncate">
                      {formatDate(comm.created_at)}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    comm.category === "urgent"
                      ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                      : comm.category === "maintenance"
                      ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
                      : "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                  }
                >
                  {comm.category}
                </Badge>
              </motion.div>
            ))}
            
            {communications.length > 3 && (
              <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                {t('andMoreMessages', { count: (communications.length - 3).toString() })}
              </div>
            )}
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          <Button 
            className="flex-1 text-xs border-blue-200 bg-white/80 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-800 dark:bg-gray-800/50 dark:text-blue-300 dark:hover:bg-gray-800"
            variant="outline"
            onClick={() => navigate('/tenant/communications')}
            size="sm"
          >
            <span className="mr-1">{t('allMessages')}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
          <Button 
            className="flex-1 text-xs bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 dark:bg-blue-700 dark:hover:bg-blue-600"
            onClick={() => navigate('/tenant/communications')}
            size="sm"
          >
            <span className="mr-1">{t('newMessage')}</span>
            <PlusCircle className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
