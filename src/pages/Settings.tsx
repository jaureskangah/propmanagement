
import React from 'react';
import { Navigate } from 'react-router-dom';
import AppSidebar from "@/components/AppSidebar";
import { SettingsPageHeader } from "@/components/settings/SettingsPageHeader";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { LanguageSection } from "@/components/settings/LanguageSection";
import { useAuth } from '@/components/AuthProvider';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Settings = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Vérifier si l'utilisateur est un locataire pour afficher la bonne sidebar
  const isTenantUser = user?.user_metadata?.is_tenant_user === true;

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar 
        isTenant={isTenantUser} 
        isCollapsed={sidebarCollapsed} 
        setIsCollapsed={setSidebarCollapsed} 
      />
      <main className={cn(
        "pt-16 md:pt-8 transition-all duration-300",
        sidebarCollapsed ? "md:ml-[80px]" : "md:ml-[270px]"
      )}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pb-8"
        >
          <div className="container mx-auto px-4 md:px-6 lg:px-8 space-y-6 max-w-4xl">
            <SettingsPageHeader />
            
            <div className="grid gap-6">
              <ProfileSection />
              <SecuritySection />
              <NotificationsSection />
              <AppearanceSection />
              <LanguageSection />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;
