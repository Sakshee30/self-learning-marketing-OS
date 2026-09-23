import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "frontend/platform-admin",
  plugins: [react()],
  build: {
    outDir: "../../dist-platform-admin",
    emptyOutDir: true,
    sourcemap: true
  },
  server: {
    port: 5174,
    host: "0.0.0.0"
  }
});
