
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './utils/production-logger-replacer'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './components/AuthProvider.tsx'
import { LocaleProvider } from './components/providers/LocaleProvider.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import { TooltipProvider } from './components/ui/tooltip'
import { Toaster } from './components/ui/sonner'
import { Toaster as RadixToaster } from './components/ui/toaster'
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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocaleProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Sentry.ErrorBoundary fallback={({ error, resetError }) => (
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626', marginBottom: '1rem' }}>Une erreur s'est produite</h1>
                    <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Nous avons été notifiés de ce problème.</p>
                    <button 
                      onClick={resetError}
                      style={{ 
                        padding: '0.5rem 1rem', 
                        backgroundColor: '#3b82f6', 
                        color: 'white', 
                        borderRadius: '0.375rem', 
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Réessayer
                    </button>
                  </div>
                </div>
              )}>
                <BrowserRouter>
                  <App />
                  <Toaster />
                  <RadixToaster />
                </BrowserRouter>
              </Sentry.ErrorBoundary>
            </TooltipProvider>
          </ThemeProvider>
        </LocaleProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
