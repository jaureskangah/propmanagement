
import React from 'react';
import { RentRemindersManagement } from '@/components/tenant/rent-reminders/RentRemindersManagement';
import { motion } from 'framer-motion';

const RentReminders = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <RentRemindersManagement />
    </motion.div>
  );
};

export default RentReminders;
