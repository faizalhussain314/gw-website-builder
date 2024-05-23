import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/wp-content/plugins/gw-website-builder-main/dist/", // Adjust this path as necessary
  build: {
    outDir: path.resolve(__dirname, "dist"),
    rollupOptions: {
      // additional configurations here
    },
  },
});
