
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";

export const NoTenantProfile = () => {
  const { t } = useLocale();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 shadow-sm">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <Home className="h-20 w-20 text-blue-300 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-center mb-4 text-blue-800">
          {t('noTenantProfile')}
        </h2>
        <p className="text-muted-foreground text-center max-w-md mb-8 text-lg">
          {t('noTenantProfileDescription')}
        </p>
        <Button 
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
          onClick={() => window.location.href = '/tenant/profile'}
        >
          Configurer votre profil
        </Button>
      </motion.div>
    </div>
  );
};
