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
      "@config": path.resolve(__dirname, "src/config"),
      "@component": path.resolve(__dirname, "src/ui/component"),
      "@assets": path.resolve(__dirname, "src/assets/"),
      "@dialog": path.resolve(__dirname, "src/ui/component/dialogs"),
      "@hooks": path.resolve(__dirname, "src/hooks/"),
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

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";

// export default defineConfig({
//   plugins: [react()],
//   base: "/wp-content/plugins/gw-website-builder-main/dist/",
//   server: {
//     proxy: {
//       "/process-content": {
//         target: "https://stagging.webspacekit.com/",
//         changeOrigin: true,
//         rewrite: (path) =>
//           path.replace(/^\/process-content/, "/new-react-webhook-file.php"),
//       },
//     },
//   },
// });
