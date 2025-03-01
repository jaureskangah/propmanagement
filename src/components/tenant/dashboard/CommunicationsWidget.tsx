
import { MessageSquare, ArrowUpRight, PlusCircle, User } from "lucide-react";
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
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-5"
    >
      <div className="flex items-center mb-4">
        <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
        <h3 className="font-semibold text-blue-700">{t('communications')}</h3>
        {unreadCount > 0 && (
          <Badge variant="default" className="ml-2 bg-blue-500 hover:bg-blue-600">
            {unreadCount}
          </Badge>
        )}
      </div>
      
      <div className="space-y-4">
        {communications.length === 0 ? (
          <div className="text-center py-6 bg-white/60 rounded-lg">
            <MessageSquare className="h-10 w-10 text-blue-300 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-gray-500">{t('noCommunications')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {communications.slice(0, 3).map((comm, index) => (
              <motion.div 
                key={comm.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`
                  flex items-center justify-between p-3 rounded-lg shadow-sm hover:shadow transition-shadow
                  ${comm.status === 'unread' ? 'bg-blue-100/40' : 'bg-white/70'}
                `}
              >
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center">
                    <span className="text-sm font-medium truncate text-gray-800">{comm.subject}</span>
                    {comm.status === 'unread' && (
                      <Badge variant="default" className="ml-2 h-2 w-2 p-0 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <div className="flex text-xs text-gray-500">
                    {!comm.is_from_tenant && <User className="h-3 w-3 mr-1" />}
                    <span className="truncate">
                      {formatDate(comm.created_at)}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    comm.category === "urgent"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : comm.category === "maintenance"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-green-50 text-green-700 border-green-200"
                  }
                >
                  {comm.category}
                </Badge>
              </motion.div>
            ))}
            
            {communications.length > 3 && (
              <div className="text-sm text-center text-gray-500 mt-2">
                {t('andMoreMessages', { count: (communications.length - 3).toString() })}
              </div>
            )}
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          <Button 
            className="flex-1 border-blue-200 bg-white/80 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
            variant="outline"
            onClick={() => navigate('/tenant/communications')}
          >
            {t('viewAll')}
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Button>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate('/tenant/communications/new')}
          >
            {t('sendMessage')}
            <PlusCircle className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
