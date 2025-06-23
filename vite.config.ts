
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer les vendors principaux
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          
          // UI components séparés
          'ui-core': ['@radix-ui/react-dialog', '@radix-ui/react-tooltip'],
          'ui-forms': ['@radix-ui/react-select', '@radix-ui/react-checkbox'],
          'ui-motion': ['framer-motion'],
          
          // Utilitaires
          'utils': ['clsx', 'tailwind-merge', 'class-variance-authority'],
          'date-utils': ['date-fns'],
          
          // Landing page components (lazy loaded)
          'landing': [
            'src/components/landing/HowItWorks.tsx',
            'src/components/landing/Pricing.tsx',
            'src/components/landing/FAQ.tsx',
            'src/components/landing/Contact.tsx',
            'src/components/landing/CallToAction.tsx'
          ]
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    minify: mode !== 'development',
    cssCodeSplit: true,
    assetsInlineLimit: 2048, // Plus petit pour éviter les gros bundles
    emptyOutDir: true,
  },
  plugins: [
    react({
      tsDecorators: true,
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['framer-motion'],
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  esbuild: {
    logLimit: 0,
    legalComments: 'none',
    treeShaking: true,
    minifyIdentifiers: mode !== 'development',
    minifySyntax: mode !== 'development',
    minifyWhitespace: mode !== 'development',
  }
}));
