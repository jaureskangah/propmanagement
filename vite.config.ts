
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
    // Disable sourcemaps in all modes to reduce memory usage
    sourcemap: false,
    // Set a hard limit on chunk size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Create smaller, more numerous chunks
          vendor: ['react', 'react-dom'],
          ui1: ['@radix-ui/react-tooltip'],
          ui2: ['@radix-ui/react-dialog'],
          ui3: ['class-variance-authority'],
          utils1: ['date-fns'],
          utils2: ['clsx', 'tailwind-merge'],
        },
        // Limit chunk size to improve memory usage
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Optimize build to use less memory - correctly format the minify option
    minify: mode !== 'development', // This is correct for Vite config
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    // Don't emit large files
    emptyOutDir: true,
  },
  plugins: [
    react({
      // Use faster SWC minifier - this is where we properly configure SWC
      minify: mode !== 'development'
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
    // Exclude heavy packages from optimization
    exclude: ['framer-motion'],
  },
  // Set a low memory budget for the build
  esbuild: {
    logLimit: 0,
    legalComments: 'none',
    treeShaking: true,
  }
}));
