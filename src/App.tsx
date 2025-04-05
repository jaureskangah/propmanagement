
import { ThemeProvider } from "@/components/theme-provider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "sonner";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Tenants from "./pages/Tenants";
import Maintenance from "./pages/Maintenance";
import Settings from "./pages/Settings";
import Communications from "./pages/Communications";
import AdminDashboard from "./pages/AdminDashboard";
import TenantProfile from "./pages/TenantProfile";
import TenantMaintenance from "./pages/tenant/TenantMaintenance";
import TenantCommunications from "./pages/tenant/TenantCommunications";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import TenantDocuments from "./pages/TenantDocuments";
import TenantPayments from "./pages/TenantPayments";
import About from "./pages/company/About";
import Careers from "./pages/company/Careers";
import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import Cookies from "./pages/legal/Cookies";
import Finances from "./pages/Finances";
import DocumentGenerator from "./pages/DocumentGenerator";
import { ensureTenantDocumentsBucket } from "./utils/createStorageBucket";

// Assurons-nous que la langue est initialisée au démarrage de l'application
const initializeLanguage = () => {
  const savedLanguage = localStorage.getItem('app-language');
  if (!savedLanguage) {
    // Si aucune langue n'est définie, utilisons la langue du navigateur ou l'anglais par défaut
    const browserLang = navigator.language.split('-')[0];
    const defaultLang = browserLang === 'fr' ? 'fr' : 'en';
    localStorage.setItem('app-language', defaultLang);
  }
};

function App() {
  // Initialiser la langue au démarrage de l'application
  initializeLanguage();

  useEffect(() => {
    // Initialize storage
    ensureTenantDocumentsBucket().then((success) => {
      if (success) {
        console.log("Storage bucket setup complete");
      } else {
        console.error("Failed to setup storage bucket");
      }
    });
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <LocaleProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/communications" element={<Communications />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/finances" element={<Finances />} />
          <Route path="/documents" element={<DocumentGenerator />} />
          <Route path="/company/about" element={<About />} />
          <Route path="/company/careers" element={<Careers />} />
          <Route path="/legal/terms" element={<Terms />} />
          <Route path="/legal/privacy" element={<Privacy />} />
          <Route path="/legal/cookies" element={<Cookies />} />
          <Route path="/tenant/profile" element={<TenantProfile />} />
          <Route path="/tenant/maintenance" element={<TenantMaintenance />} />
          <Route path="/tenant/communications" element={<TenantCommunications />} />
          <Route path="/tenant/documents" element={<TenantDocuments />} />
          <Route path="/tenant/payments" element={<TenantPayments />} />
          <Route path="/tenant/dashboard" element={<TenantDashboard />} />
          <Route path="/profile" element={<TenantProfile />} />
        </Routes>
        <Toaster position="top-right" />
      </LocaleProvider>
    </ThemeProvider>
  );
}

export default App;
