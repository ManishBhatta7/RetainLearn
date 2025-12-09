import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    // Proxy Supabase Functions requests during development to avoid CORS
    proxy: {
      '/functions': {
        target: 'https://gwarmogcmeehajnevbmi.supabase.co',
        changeOrigin: true,
        secure: true,
        // keep path as /functions/<name>
      }
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext", // Required for modern web features
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
});