
import React from 'react';
import { cn } from "@/lib/utils";
import AnimatedSidebar from '../sidebar/AnimatedSidebar';
import { AnimatedSidebarProvider } from '../sidebar/AnimatedSidebarProvider';

interface AnimatedLayoutProps {
  children: React.ReactNode;
  isTenant?: boolean;
}

const AnimatedLayout = ({ children, isTenant = false }: AnimatedLayoutProps) => {
  return (
    <AnimatedSidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AnimatedSidebar isTenant={isTenant} />
        <main className="flex-1 ml-[80px] transition-all duration-300">
          <div className="p-6 md:p-8 pt-24 md:pt-8">
            {children}
          </div>
        </main>
      </div>
    </AnimatedSidebarProvider>
  );
};

export default AnimatedLayout;
