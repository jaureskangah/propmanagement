
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './components/AuthProvider.tsx'
import { LocaleProvider } from './components/providers/LocaleProvider.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import { TooltipProvider } from './components/ui/tooltip'

// Configuration optimisée du client React Query pour les performances
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Optimisations de performance par défaut
      staleTime: 1000 * 60 * 2, // 2 minutes avant qu'une requête soit considérée comme périmée
      gcTime: 1000 * 60 * 10, // Durée de conservation dans le cache (10 minutes)
      retry: 1, // Limiter les tentatives de nouvelle requête en cas d'échec
      refetchOnWindowFocus: false, // Ne pas refetch automatiquement quand la fenêtre regagne le focus
      refetchOnMount: true, // Refetch au montage des composants
    },
  },
})

// Observer et loguer les changements de cache pour le débogage
if (process.env.NODE_ENV === 'development') {
  queryClient.getQueryCache().subscribe(event => {
    if (event.type === 'added' || event.type === 'removed') {
      console.debug(`[Query Cache] ${event.type}: `, event.query.queryKey);
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <React.StrictMode>
        <LocaleProvider>
          <ThemeProvider>
            <TooltipProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </LocaleProvider>
      </React.StrictMode>
    </AuthProvider>
  </QueryClientProvider>
)
