
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

// Activer la persistance du cache pour améliorer les performances entre les sessions
const persistQueryClient = async () => {
  try {
    const { persistQueryClientRestore, persistQueryClient } = await import('@tanstack/react-query-persist-client');
    const { createSyncStoragePersister } = await import('@tanstack/query-sync-storage-persister');
    
    const localStoragePersister = createSyncStoragePersister({
      storage: window.localStorage,
      key: 'PROPERTY_MANAGER_QUERY_CACHE',
      throttleTime: 1000,
      maxAge: 1000 * 60 * 60 * 24, // 1 jour
    });
    
    await persistQueryClientRestore({
      queryClient,
      persister: localStoragePersister,
      maxAge: 1000 * 60 * 60 * 24, // 1 jour
      dehydrateOptions: {
        shouldDehydrateQuery: query => {
          // Ne pas persister les requêtes sensibles ou temporaires
          const queryKey = Array.isArray(query.queryKey) ? query.queryKey[0] : query.queryKey;
          const sensitiveKeys = ['auth', 'session', 'user_profile'];
          return !sensitiveKeys.includes(String(queryKey));
        },
      },
    });
    
    persistQueryClient({
      queryClient,
      persister: localStoragePersister,
      dehydrateOptions: {
        shouldDehydrateQuery: query => {
          // Ne pas persister les requêtes sensibles ou temporaires
          const queryKey = Array.isArray(query.queryKey) ? query.queryKey[0] : query.queryKey;
          const sensitiveKeys = ['auth', 'session', 'user_profile'];
          return !sensitiveKeys.includes(String(queryKey));
        },
      },
    });
    
    console.log('Query client persistence enabled');
  } catch (err) {
    console.warn('Query client persistence could not be enabled:', err);
  }
};

// Ne pas bloquer le rendu initial avec l'initialisation de la persistance du cache
if (typeof window !== 'undefined') {
  persistQueryClient().catch(err => {
    console.warn('Failed to initialize query persistence:', err);
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
