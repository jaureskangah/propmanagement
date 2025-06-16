
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "../RecentActivity";

interface ActivityGroupProps {
  dateGroup: string;
  activities: Activity[];
}

export const ActivityGroup = ({ dateGroup, activities }: ActivityGroupProps) => {
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

  // Animation variants for individual items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24
      }
    }
  };

  // Animation variants for date headers
  const headerVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: {
        delay: 0.1,
        duration: 0.4
      }
    }
  };

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h3 
        className="text-sm font-medium text-muted-foreground border-b pb-1"
        variants={headerVariants}
      >
        {dateGroup}
      </motion.h3>
      <motion.div 
        variants={container}
        className="space-y-4"
      >
        <AnimatePresence>
          {activities.map(activity => (
            <motion.div 
              key={`${activity.type}-${activity.id}`}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.01, 
                transition: { duration: 0.2 } 
              }}
              layout
            >
              {activity.component}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
