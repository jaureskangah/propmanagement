
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/AuthProvider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";

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

// Composant pour gérer les redirections basées sur le rôle de l'utilisateur
const AuthRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // Si l'utilisateur est un locataire, rediriger vers le tableau de bord du locataire
      if (user?.user_metadata?.is_tenant_user) {
        navigate('/tenant/dashboard', { replace: true });
      } else {
        // Sinon, rediriger vers le tableau de bord standard
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  return null;
};

function App() {
  // Initialiser la langue au démarrage de l'application
  initializeLanguage();

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <LocaleProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}

export default App;
