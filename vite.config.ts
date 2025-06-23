import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/wp-content/plugins/gw-website-builder-main/API/dist/",
  define: {
    "process.env": {},
  },
  resolve: {
    alias: {
      "@api": path.resolve(__dirname, "src/infrastructure/api"),
      "@components": path.resolve(__dirname, "src/ui/component"),
      "@pages": path.resolve(__dirname, "src/ui/pages"),
      "@layouts": path.resolve(__dirname, "src/ui/Layouts"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@store": path.resolve(__dirname, "src/store"),
      "@types": path.resolve(__dirname, "src/types"),
      "@config": path.resolve(__dirname, "src/config"),
      "@dialog": path.resolve(__dirname, "src/ui/component/dialogs"),
      "@ui": path.resolve(__dirname, "src/ui"),
      "@utils": path.resolve(__dirname, "src/core/utils"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@Slice": path.resolve(__dirname, "src/Slice"),
    },
  },
  build: {
    // sourcemap: true,
    outDir: path.resolve(__dirname, "dist/"),
    rollupOptions: {
      input: path.resolve(__dirname, "src/main.tsx"),
      output: {
        entryFileNames: "mainfile.js",
        chunkFileNames: "[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo?.name?.endsWith(".css")) {
            return "mainfile.css";
          }
          return "[name][extname]";
        },
      },
    },
  },
});
