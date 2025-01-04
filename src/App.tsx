import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {showSidebar && <AppSidebar />}
      <main className={`flex-1 ${!showSidebar ? 'p-0' : 'p-4 lg:p-8'} overflow-x-hidden`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/tenants" element={<Tenants />} />
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