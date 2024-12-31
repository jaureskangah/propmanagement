import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppSidebar from "./components/AppSidebar";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Maintenance from "./pages/Maintenance";
import Tenants from "./pages/Tenants";

function App() {
  // TODO: Add authentication state management
  const isAuthenticated = false;

  return (
    <Router>
      <div className="flex min-h-screen">
        {isAuthenticated && <AppSidebar />}
        <main className={`flex-1 ${!isAuthenticated ? 'p-0' : 'p-8'}`}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/tenants" element={<Tenants />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;