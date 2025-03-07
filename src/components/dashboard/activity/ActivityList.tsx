
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "@/hooks/dashboard/useActivities";
import { NoActivity } from "./NoActivity";
import { ActivityGroup } from "./ActivityGroup";

interface ActivityListProps {
  groupedActivities: {[key: string]: Activity[]};
}

export const ActivityList = ({ groupedActivities }: ActivityListProps) => {
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
  
  return (
    <AnimatePresence mode="wait">
      {Object.keys(groupedActivities).length === 0 ? (
        <NoActivity />
      ) : (
        <motion.div 
          key="activity-groups"
          className="space-y-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {Object.entries(groupedActivities).map(([dateGroup, activities]) => (
            <ActivityGroup 
              key={dateGroup} 
              dateGroup={dateGroup} 
              activities={activities} 
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
