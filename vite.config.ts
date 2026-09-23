import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "serve" ? "/" : "/self-learning-marketing-OS/",
  server: {
    port: 5173,
    host: "0.0.0.0"
  }
}));
