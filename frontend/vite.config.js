import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {

            if (id.includes("react")) {
              return "react-vendor";
            }

            if (id.includes("recharts")) {
              return "charts";
            }

            if (id.includes("axios")) {
              return "axios";
            }

            return "vendor";
          }
        }
      }
    }
  }
});
