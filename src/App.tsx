import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { AuthProvider } from "./components/AuthProvider";
import AppSidebar from "./components/AppSidebar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Maintenance from "./pages/Maintenance";
import Tenants from "./pages/Tenants";
import { useAuth } from "./components/AuthProvider";

function AppRoutes() {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthenticated = !!user;
  const isLandingPage = location.pathname === "/";
  const showSidebar = isAuthenticated && !isLandingPage;

  // Query to check if user is a tenant
  const { data: profileData } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Si l'utilisateur est un tenant et essaie d'accéder à une route non autorisée,
  // redirigez-le vers la page de maintenance
  const isTenantAccessingRestrictedRoute = 
    profileData?.is_tenant_user && 
    !["/maintenance", "/communications", "/"].includes(location.pathname);

  if (isTenantAccessingRestrictedRoute) {
    return <Navigate to="/maintenance" replace />;
  }

  // Protected route component
  const ProtectedRoute = ({ children, allowTenant = false }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }

    // Si c'est un tenant et que la route n'autorise pas les tenants
    if (profileData?.is_tenant_user && !allowTenant) {
      return <Navigate to="/maintenance" />;
    }

    return children;
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {showSidebar && <AppSidebar isTenant={profileData?.is_tenant_user} />}
      <main className={`flex-1 ${!showSidebar ? 'p-0' : 'p-4 lg:p-8'} overflow-x-hidden`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/properties" element={
            <ProtectedRoute>
              <Properties />
            </ProtectedRoute>
          } />
          <Route path="/maintenance" element={
            <ProtectedRoute allowTenant>
              <Maintenance />
            </ProtectedRoute>
          } />
          <Route path="/tenants" element={
            <ProtectedRoute>
              <Tenants />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;