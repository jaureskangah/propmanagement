
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "../RecentActivity";
import { ActivityGroup } from "./ActivityGroup";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ExportButton } from "./ExportButton";

interface ActivityListProps {
  groupedActivities: {[key: string]: Activity[]};
  hasMoreActivities?: boolean;
  onShowMore?: () => void;
}

export const ActivityList = ({ 
  groupedActivities, 
  hasMoreActivities = false, 
  onShowMore 
}: ActivityListProps) => {
  const { t } = useLocale();
  
  // Animation variants for container
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Check if there are any activities
  const hasActivities = Object.keys(groupedActivities).length > 0;

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key="activity-groups"
        className="space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Add export button row */}
        <div className="flex justify-end">
          <ExportButton 
            groupedActivities={groupedActivities} 
            hasActivities={hasActivities} 
          />
        </div>
        
        {Object.entries(groupedActivities).map(([dateGroup, activities]) => (
          <ActivityGroup 
            key={dateGroup} 
            dateGroup={dateGroup} 
            activities={activities} 
          />
        ))}
        
        {hasMoreActivities && onShowMore && (
          <motion.div 
            className="flex justify-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={onShowMore}
              className="flex items-center gap-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              {t('viewAll')} <ChevronDown className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
