
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import AppSidebar from "@/components/AppSidebar";

export const TenantsLoading = () => {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 container mx-auto p-6">
        <div className="mb-6">
          <Skeleton className="h-10 w-60 mb-2" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-[600px] w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
