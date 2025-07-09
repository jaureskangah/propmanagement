
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
      staleTime: 1000 * 60 * 5, // 5 minutes pour réduire les requêtes
      gcTime: 1000 * 60 * 15, // Cache plus long pour les performances
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Éviter les refetch inutiles au montage
      refetchOnReconnect: false, // Éviter les refetch sur reconnexion
    },
  },
})

// Désactiver les logs en production pour améliorer les performances
if (process.env.NODE_ENV === 'development') {
  queryClient.getQueryCache().subscribe(event => {
    if (event.type === 'added' || event.type === 'removed') {
      console.debug(`[Query Cache] ${event.type}: `, event.query.queryKey);
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocaleProvider>
          <ThemeProvider>
            <TooltipProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </LocaleProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
