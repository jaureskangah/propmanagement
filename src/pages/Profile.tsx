
import React, { useState } from 'react';
import AppSidebar from "@/components/AppSidebar";
import { useAuth } from '@/components/AuthProvider';
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/sidebar/ModernSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const ProfileContent = () => {
  const { open } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "p-6 md:p-8 pt-24 md:pt-8 transition-all duration-300",
      !isMobile && (open ? "md:ml-[270px]" : "md:ml-[80px]")
    )}>
      <h1 className="text-3xl font-bold mb-8">Profile Page</h1>
      {/* Contenu du profil */}
    </div>
  );
};

const Profile = () => {
  const { user } = useAuth();
  const isTenantUser = user?.user_metadata?.is_tenant_user;

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isTenant={isTenantUser} />
      <ProfileContent />
    </div>
  );
};

export default Profile;
