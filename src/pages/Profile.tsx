import React, { useState } from 'react';
import AppSidebar from "@/components/AppSidebar";
import { useAuth } from '@/components/AuthProvider';
import { cn } from "@/lib/utils";

const Profile = () => {
  const { user } = useAuth();
  const isTenantUser = user?.user_metadata?.is_tenant_user;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isTenant={isTenantUser} />
      <div className="ml-20 md:ml-20 p-6 md:p-8 pt-24 md:pt-8 transition-all duration-300">
        <h1 className="text-3xl font-bold mb-8">Profile Page</h1>
        {/* Contenu du profil */}
      </div>
    </div>
  );
};

export default Profile;
