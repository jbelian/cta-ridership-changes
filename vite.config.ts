import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/cta-ridership-changes",
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
