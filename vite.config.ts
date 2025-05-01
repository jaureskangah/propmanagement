
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
    sourcemap: mode === 'development', // Only generate sourcemaps in development
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: [
            '@radix-ui/react-tooltip', 
            '@radix-ui/react-dialog', 
            'class-variance-authority'
          ],
          utils: ['date-fns', 'clsx', 'tailwind-merge'],
        },
        // Limit chunk size to improve memory usage
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Optimize build to use less memory
    minify: mode !== 'development', // Don't minify in development
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: [], // Add any problematic packages here
  },
}));
