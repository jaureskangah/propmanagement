import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminNavigation } from './AdminNavigation';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1">
          <div className="max-w-6xl mx-auto p-6">
            <AdminNavigation />
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};