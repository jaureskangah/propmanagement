import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import AppSidebar from "@/components/AppSidebar";
import Dashboard from "@/pages/Dashboard";
import Properties from "@/pages/Properties";
import Tenants from "@/pages/Tenants";
import Maintenance from "@/pages/Maintenance";
import LandingPage from "@/pages/LandingPage";
import TenantMaintenance from "@/pages/tenant/TenantMaintenance";
import TenantCommunications from "@/pages/tenant/TenantCommunications";
import { AuthProvider } from "@/components/AuthProvider";
import { useAuthSession } from "@/hooks/useAuthSession";

function App() {
  const { session, profile } = useAuthSession();
  const isTenant = profile?.is_tenant_user;
  const isAuthenticated = !!session;

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <div className="flex">
            {isAuthenticated && <AppSidebar isTenant={isTenant} />}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                {!isTenant ? (
                  <>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/properties" element={<Properties />} />
                    <Route path="/tenants" element={<Tenants />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                  </>
                ) : (
                  <>
                    <Route path="/tenant/maintenance" element={<TenantMaintenance />} />
                    <Route path="/tenant/communications" element={<TenantCommunications />} />
                  </>
                )}
              </Routes>
            </main>
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;