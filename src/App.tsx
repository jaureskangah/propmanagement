
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme-provider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { AuthProvider } from "./components/AuthProvider";
import { TenantProvider } from "./components/providers/TenantProvider";
import { Toaster } from "./components/ui/toaster";
import Routes from "./Routes";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <LocaleProvider>
            <AuthProvider>
              <TenantProvider>
                <Routes />
                <Toaster />
              </TenantProvider>
            </AuthProvider>
          </LocaleProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
