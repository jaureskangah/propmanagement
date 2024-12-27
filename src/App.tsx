import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Properties from "@/pages/Properties";
import Maintenance from "@/pages/Maintenance";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <SidebarProvider>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <main className="flex-1 overflow-y-auto bg-background">
                <Routes>
                  <Route path="/" element={<div>Dashboard</div>} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/maintenance" element={<Maintenance />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;