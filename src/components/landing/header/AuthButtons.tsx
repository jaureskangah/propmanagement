
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { motion } from "framer-motion";

interface AuthButtonsProps {
  isAuthenticated: boolean;
  t: (key: string) => string;
  onSignInClick: () => void;
  onDashboardClick: () => void;
  onSignOutClick: () => void;
}

export const AuthButtons = ({ 
  isAuthenticated, 
  t, 
  onSignInClick, 
  onDashboardClick, 
  onSignOutClick 
}: AuthButtonsProps) => {
  return (
    <>
      {isAuthenticated ? (
        <>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button 
              variant="ghost"
              className="text-slate-600 hover:text-[#ea384c] hover:bg-slate-100 font-medium"
              onClick={onDashboardClick}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              {t('dashboard')}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              variant="ghost"
              className="text-slate-600 hover:text-[#ea384c] hover:bg-slate-100 font-medium"
              onClick={onSignOutClick}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('signOut')}
            </Button>
          </motion.div>
        </>
      ) : (
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="default"
            size="sm"
            className="bg-gradient-to-r from-[#ea384c] to-[#d31c3f] hover:from-[#f04357] hover:to-[#e42349] text-white shadow-md hover:shadow-lg transition-all duration-300"
            onClick={onSignInClick}
          >
            <LogIn className="h-4 w-4 mr-2" />
            {t('signIn')}
          </Button>
        </motion.div>
      )}
    </>
  );
};
