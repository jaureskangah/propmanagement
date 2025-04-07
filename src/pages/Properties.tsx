
import { useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";

const Properties = () => {
  useEffect(() => {
    document.title = "Properties | PropManagement";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="p-6 md:p-8 pt-24 md:pt-8 md:ml-[270px]">
        <h1 className="text-3xl font-bold mb-8">Properties</h1>
        <div className="rounded-lg border p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Property Management</h2>
          <p className="text-muted-foreground">
            This page is under development. Property management features will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Properties;
