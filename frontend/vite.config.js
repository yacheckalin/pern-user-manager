import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": "/src",
      "@features": "/src/features",
      "@pages": "/src/pages",
      "@constants": "/src/constants",
      "@configs": "/src/config",
      "@shared": "/src/shared",
      "@layouts": "/src/layouts",
    },
  },
});
