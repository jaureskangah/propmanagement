
import { Home } from "lucide-react";
import { DashboardMetric } from "@/components/DashboardMetric";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";

interface PropertyDisplayProps {
  propertyName: string;
  unitNumber: string;
}

export const PropertyDisplay = ({ propertyName, unitNumber }: PropertyDisplayProps) => {
  const { t } = useLocale();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <DashboardMetric
        title={t('property')}
        value={propertyName}
        description={`${t('unit')} ${unitNumber}`}
        icon={<Home className="h-5 w-5" />}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none shadow-md hover:shadow-lg transition-shadow p-6"
      />
    </motion.div>
  );
};
