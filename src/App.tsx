
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/AuthProvider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { Toaster } from "sonner";

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
