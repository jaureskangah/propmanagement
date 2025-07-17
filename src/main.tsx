
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
import { Toaster } from './components/ui/sonner'
import * as Sentry from "@sentry/react"

// Configuration de Sentry pour le monitoring d'erreurs
Sentry.init({
  dsn: "https://jhjhzwbvmkurwfohjxlu.supabase.co/functions/v1/sentry-dsn",
  environment: process.env.NODE_ENV,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

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
    <Sentry.ErrorBoundary fallback={({ error, resetError }) => (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Une erreur s'est produite</h1>
          <p className="text-muted-foreground mb-4">Nous avons été notifiés de ce problème.</p>
          <button 
            onClick={resetError}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Réessayer
          </button>
        </div>
      </div>
    )}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LocaleProvider>
            <ThemeProvider>
              <TooltipProvider>
                <BrowserRouter>
                  <App />
                  <Toaster />
                </BrowserRouter>
              </TooltipProvider>
            </ThemeProvider>
          </LocaleProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
)
