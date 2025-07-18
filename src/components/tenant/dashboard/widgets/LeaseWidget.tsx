
import { Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";

interface LeaseWidgetProps {
  leaseStart: string;
  leaseEnd: string;
  daysLeft: number;
  status: 'active' | 'expiring' | 'expired';
}

export const LeaseWidget = ({ leaseStart, leaseEnd, daysLeft, status }: LeaseWidgetProps) => {
  const { t, language } = useLocale();
  
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'from-emerald-50 to-green-50 border-emerald-100';
      case 'expiring': return 'from-amber-50 to-yellow-50 border-amber-100';
      case 'expired': return 'from-rose-50 to-red-50 border-rose-100';
      default: return 'from-blue-50 to-indigo-50 border-blue-100';
    }
  };
  
  const getStatusTextColor = () => {
    switch (status) {
      case 'active': return 'text-emerald-700';
      case 'expiring': return 'text-amber-700';
      case 'expired': return 'text-rose-700';
      default: return 'text-blue-700';
    }
  };
  
  const getProgressPercentage = () => {
    try {
      const start = new Date(leaseStart).getTime();
      const end = new Date(leaseEnd).getTime();
      const now = new Date().getTime();
      const totalDuration = end - start;
      const elapsed = now - start;
      
      // If lease hasn't started yet
      if (elapsed < 0) return 0;
      // If lease has expired
      if (elapsed > totalDuration) return 100;
      
      return Math.min(100, Math.round((elapsed / totalDuration) * 100));
    } catch (e) {
      return 0;
    }
  };

  // Format dates according to language
  const formatLeaseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  const progressPercentage = getProgressPercentage();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      whileHover={{ y: -5 }}
      className={`rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden bg-gradient-to-br ${getStatusColor()} border p-5 h-full flex flex-col`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Calendar className={`h-5 w-5 mr-2 ${getStatusTextColor()}`} />
          <h3 className={`font-semibold ${getStatusTextColor()}`}>
            {status === 'active' && t('leaseStatusActive')}
            {status === 'expiring' && t('leaseStatusExpiringDays', { days: daysLeft.toString() })}
            {status === 'expired' && t('leaseStatusExpired', { days: daysLeft.toString() })}
          </h3>
        </div>
      </div>
      
      <div className="space-y-4 flex-1">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{t('lease.start')}</span>
            <span className="font-medium text-gray-700">{formatLeaseDate(leaseStart)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{t('lease.end')}</span>
            <span className="font-medium text-gray-700">{formatLeaseDate(leaseEnd)}</span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200/50 rounded-full h-2.5 mt-4">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`h-2.5 rounded-full ${
              status === 'active' ? 'bg-green-500' : 
              status === 'expiring' ? 'bg-amber-500' : 'bg-rose-500'
            }`}
          />
        </div>
        
        <div className="mt-2 flex items-center">
          {status === 'active' && (
            <div className="flex items-center text-emerald-600">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{t('daysLeft', { days: daysLeft.toString() })}</span>
            </div>
          )}
          {status === 'expiring' && (
            <div className="flex items-center text-amber-600">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{t('daysLeft', { days: daysLeft.toString() })}</span>
            </div>
          )}
          {status === 'expired' && (
            <div className="flex items-center text-rose-600">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{t('daysAgo', { days: daysLeft.toString() })}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
