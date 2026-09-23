import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => ({
  plugins: [tailwindcss(), react()],
  base: command === "serve" ? "/" : "/self-learning-marketing-OS/",
  server: {
    port: 5173,
    host: "0.0.0.0"
  }
}));
