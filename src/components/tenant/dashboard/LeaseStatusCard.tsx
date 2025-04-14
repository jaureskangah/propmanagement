
import { Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";

interface LeaseStatusCardProps {
  leaseStart: string;
  leaseEnd: string;
  daysLeft: number;
  status: 'active' | 'expiring' | 'expired';
}

export const LeaseStatusCard = ({ leaseStart, leaseEnd, daysLeft, status }: LeaseStatusCardProps) => {
  const { t } = useLocale();
  
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'from-emerald-50 to-green-50 border-emerald-100 dark:from-emerald-950/70 dark:to-green-950/70 dark:border-emerald-800/50';
      case 'expiring': return 'from-amber-50 to-yellow-50 border-amber-100 dark:from-amber-950/70 dark:to-yellow-950/70 dark:border-amber-800/50';
      case 'expired': return 'from-rose-50 to-red-50 border-rose-100 dark:from-rose-950/70 dark:to-red-950/70 dark:border-rose-800/50';
      default: return 'from-blue-50 to-indigo-50 border-blue-100 dark:from-blue-950/70 dark:to-indigo-950/70 dark:border-blue-800/50';
    }
  };
  
  const getStatusTextColor = () => {
    switch (status) {
      case 'active': return 'text-emerald-700 dark:text-emerald-400';
      case 'expiring': return 'text-amber-700 dark:text-amber-400';
      case 'expired': return 'text-rose-700 dark:text-rose-400';
      default: return 'text-blue-700 dark:text-blue-400';
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
  
  const progressPercentage = getProgressPercentage();
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={`rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden bg-gradient-to-br ${getStatusColor()} border p-5`}
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
      
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">{t('lease.start')}</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{new Date(leaseStart).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">{t('lease.end')}</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{new Date(leaseEnd).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200/50 dark:bg-gray-700/70 rounded-full h-2.5 mt-4">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`h-2.5 rounded-full ${
              status === 'active' ? 'bg-green-500 dark:bg-green-600' : 
              status === 'expiring' ? 'bg-amber-500 dark:bg-amber-600' : 'bg-rose-500 dark:bg-rose-600'
            }`}
          />
        </div>
        
        <div className="mt-2 flex items-center">
          {status === 'active' && (
            <div className="flex items-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{t('daysLeft', { days: daysLeft.toString() })}</span>
            </div>
          )}
          {status === 'expiring' && (
            <div className="flex items-center text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{t('daysLeft', { days: daysLeft.toString() })}</span>
            </div>
          )}
          {status === 'expired' && (
            <div className="flex items-center text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{t('daysAgo', { days: daysLeft.toString() })}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
