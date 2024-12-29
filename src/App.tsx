import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppSidebar from "./components/AppSidebar";
import Dashboard from "./pages/Index";
import Properties from "./pages/Properties";
import Maintenance from "./pages/Maintenance";
import Tenants from "./pages/Tenants";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
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