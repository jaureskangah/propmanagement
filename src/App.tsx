
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/AuthProvider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Toaster } from "sonner";

function App() {
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
